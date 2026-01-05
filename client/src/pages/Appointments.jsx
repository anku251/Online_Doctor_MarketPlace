import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listAppointments } from '../api'

export default function Appointments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [patientName, setPatientName] = useState(localStorage.getItem('patientName') || '')

  useEffect(() => {
    listAppointments(patientName || undefined).then((d) => { setItems(d); setLoading(false) })
  }, [patientName])

  return (
    <div className="appointments-page">
      <section className="sub-hero">
        <h2>Upcoming Appointments</h2>
        <p>Track your confirmed video sessions and jump back into any room in one click.</p>
        <div className="filter-input">
          <span>👤</span>
          <input
            value={patientName}
            onChange={e => { setPatientName(e.target.value); localStorage.setItem('patientName', e.target.value) }}
            placeholder="Filter by patient name"
          />
        </div>
      </section>
      {loading ? <p className="loading">Fetching appointments…</p> : (
        <div className="appointment-grid">
          {items.map(a => (
            <article key={a.id} className="appointment-card">
              <div>
                <div className="title">Doctor {a.doctorId.toUpperCase()}</div>
                <div className="sub">{a.time}</div>
              </div>
              <Link className="primary-btn" to={`/call/${a.roomId}`}>Join Call</Link>
            </article>
          ))}
          {items.length === 0 && <p className="empty">No appointments yet. Book a doctor to get started.</p>}
        </div>
      )}
    </div>
  )
}
