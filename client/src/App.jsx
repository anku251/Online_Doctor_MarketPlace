import { NavLink, Route, Routes } from 'react-router-dom'
import Doctors from './pages/Doctors'
import Book from './pages/Book'
import Appointments from './pages/Appointments'
import VideoCall from './pages/VideoCall'

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">DH</div>
          <div>
            <p className="brand-label">Doc Health</p>
            <small>Trusted care network</small>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>Find Doctors</NavLink>
          <NavLink to="/appointments">Appointments</NavLink>
        </nav>
        <div className="profile-pill">
          <span className="user-name">Amit Kumar</span>
          <span className="user-city">Pune, MH</span>
        </div>
      </header>
      <main className="content-panel">
        <Routes>
          <Route path="/" element={<Doctors />} />
          <Route path="/book/:doctorId" element={<Book />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/call/:roomId" element={<VideoCall />} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Doc Health · Building connected Indian care</footer>
    </div>
  )
}
