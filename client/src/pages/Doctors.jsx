import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDoctors } from '../api'

const availabilityMap = {
  d1: { label: 'Available Now', tone: 'success' },
  d2: { label: 'Busy in Call', tone: 'warning' },
  d3: { label: 'Available Now', tone: 'success' }
}

const heroStats = [
  { value: '150+', label: 'Top Specialists Online' },
  { value: '4.8★', label: 'Average Patient Rating' },
  { value: '24x7', label: 'Instant Video Visits' }
]

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchDoctors().then((d) => { setDoctors(d); setLoading(false) })
  }, [])

  const filtered = useMemo(() => (
    doctors.filter((d) => {
      const bucket = `${d.name} ${d.specialty} ${d.city}`.toLowerCase()
      return bucket.includes(query.toLowerCase())
    })
  ), [doctors, query])

  if (loading) return <p className="loading">Loading specialist roster…</p>

  return (
    <div className="doctors-page">
      <section className="hero">
        <div className="hero-pill">150+ Top Specialists Online</div>
        <h1>Expert doctors from AIIMS & Apollo in minutes.</h1>
        <p className="hero-copy">Consult leading cardiologists, pediatricians, dermatologists and more across India with instant video calls.</p>
        <div className="hero-tools">
          <div className="search-box">
            <span>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors, specialties, cities"
            />
          </div>
          <button className="cta" type="button">Book Consultation</button>
        </div>
      </section>

      <section className="stats">
        {heroStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="doctor-grid">
        {filtered.map((d) => {
          const availability = availabilityMap[d.id] || { label: 'Available', tone: 'success' }
          return (
            <article key={d.id} className="doc-card">
              <div className="doc-card-header">
                <div className="avatar" aria-hidden="true">{d.name.split(' ')[0][0]}</div>
                <span className={`badge ${availability.tone}`}>{availability.label}</span>
              </div>
              <h3>{d.name}</h3>
              <p className="specialty">{d.specialty}</p>
              <p className="location">{d.city}</p>
              <div className="meta">
                <span>⭐ {d.rating}</span>
                <span>{Math.floor(d.rating * 90)}+ consultations</span>
              </div>
              <div className="card-footer">
                <div>
                  <div className="fee">₹ {d.fee}</div>
                  <small>per consultation</small>
                </div>
                <div className="card-actions">
                  <button className="ghost-btn">Details</button>
                  <Link className="primary-btn" to={`/book/${d.id}`}>
                    {availability.tone === 'success' ? 'Connect' : 'Book'}
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
