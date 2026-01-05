import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createAppointment, fetchDoctors } from '../api'

export default function Book() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [patientName, setPatientName] = useState(localStorage.getItem('patientName') || '')
  const [time, setTime] = useState('')

  useEffect(() => {
    fetchDoctors().then(setDoctors)
  }, [])

  const doctor = useMemo(() => doctors.find(d => d.id === doctorId), [doctors, doctorId])

  async function onSubmit(e) {
    e.preventDefault()
    if (!patientName || !time) return alert('Please enter your name and time')
    localStorage.setItem('patientName', patientName)
    const appt = await createAppointment({ patientName, doctorId, time })
    navigate(`/call/${appt.roomId}`)
  }

  if (!doctor) return <p className="loading">Finding doctor details…</p>

  return (
    <div className="booking-page">
      <section className="booking-card">
        <div className="badge success">Instant Video Visit</div>
        <h2>Book {doctor.specialty} consultation</h2>
        <p>{doctor.name} · {doctor.city}</p>
        <div className="booking-fee">₹ {doctor.fee} <span>per session</span></div>
      </section>
      <form onSubmit={onSubmit} className="booking-form">
        <label>
          Your Name
          <input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="e.g. Rohan" />
        </label>
        <label>
          Preferred Time (IST)
          <input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} />
        </label>
        <button className="primary-btn" type="submit">Create Room & Join Call</button>
      </form>
    </div>
  )
}
