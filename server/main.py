import uuid
from typing import Dict, List, Optional, Set

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Doc Health API")

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"]
    ,
    allow_headers=["*"]
)


class AppointmentIn(BaseModel):
    patientName: str
    doctorId: str
    time: str  # ISO string for simplicity


class AppointmentOut(AppointmentIn):
    id: str
    roomId: str


# In-memory stores (simple demo)
DOCTORS = [
    {
        "id": "d1",
        "name": "Dr. Asha Verma",
        "specialty": "Cardiologist",
        "fee": 800,
        "city": "Mumbai",
        "rating": 4.7,
    },
    {
        "id": "d2",
        "name": "Dr. Rahul Gupta",
        "specialty": "Dermatologist",
        "fee": 600,
        "city": "Delhi",
        "rating": 4.5,
    },
    {
        "id": "d3",
        "name": "Dr. Neha Iyer",
        "specialty": "Pediatrician",
        "fee": 500,
        "city": "Bengaluru",
        "rating": 4.6,
    },
]

APPOINTMENTS: Dict[str, AppointmentOut] = {}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/doctors")
def list_doctors():
    return DOCTORS


@app.get("/appointments")
def list_appointments(patientName: Optional[str] = None) -> List[AppointmentOut]:
    items = list(APPOINTMENTS.values())
    if patientName:
        items = [a for a in items if a.patientName == patientName]
    return items


@app.post("/appointments", response_model=AppointmentOut)
def create_appointment(body: AppointmentIn):
    appt_id = str(uuid.uuid4())
    room_id = str(uuid.uuid4())
    appt = AppointmentOut(id=appt_id, roomId=room_id, **body.model_dump())
    APPOINTMENTS[appt_id] = appt
    return appt


# Simple WebSocket room manager for signaling
class Room:
    def __init__(self) -> None:
        self.connections: Set[WebSocket] = set()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.add(ws)

    def disconnect(self, ws: WebSocket):
        self.connections.discard(ws)

    async def send_personal(self, ws: WebSocket, message: str):
        await ws.send_text(message)

    async def broadcast(self, sender: WebSocket, message: str):
        for c in list(self.connections):
            if c is sender:
                continue
            try:
                await c.send_text(message)
            except Exception:
                # Remove broken connections
                self.disconnect(c)


rooms: Dict[str, Room] = {}


def get_room(room_id: str) -> Room:
    if room_id not in rooms:
        rooms[room_id] = Room()
    return rooms[room_id]


@app.websocket("/ws/{room_id}")
async def ws_endpoint(ws: WebSocket, room_id: str):
    room = get_room(room_id)
    await room.connect(ws)
    try:
        # Let the client know if it's the first in the room (initiator)
        initiator = len(room.connections) == 1
        await ws.send_json({"type": "info", "initiator": initiator})

        while True:
            data = await ws.receive_text()
            # Broadcast signaling messages to other peers in the room
            await room.broadcast(ws, data)
    except WebSocketDisconnect:
        room.disconnect(ws)
    except Exception:
        room.disconnect(ws)
