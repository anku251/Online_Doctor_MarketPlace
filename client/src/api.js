const API_BASE = 'http://127.0.0.1:8000'

export async function fetchDoctors() {
  const res = await fetch(`${API_BASE}/doctors`)
  return res.json()
}

export async function createAppointment(data) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create appointment')
  return res.json()
}

export async function listAppointments(patientName) {
  const url = new URL(`${API_BASE}/appointments`)
  if (patientName) url.searchParams.set('patientName', patientName)
  const res = await fetch(url)
  return res.json()
}
