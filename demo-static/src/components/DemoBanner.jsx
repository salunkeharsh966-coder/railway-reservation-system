import { useState } from 'react'
import { resetDemoData } from '../services/mockApi.js'

/**
 * Clearly-labelled demo strip shown on every page.
 * Explains that no backend is running and lets the visitor reset the data.
 */
export default function DemoBanner() {
  const [open, setOpen] = useState(false)

  const handleReset = () => {
    resetDemoData()
    localStorage.removeItem('railway_user')
    window.location.hash = '#/'
    window.location.reload()
  }

  return (
    <div className="demo-banner">
      <div className="container d-flex flex-wrap align-items-center gap-2 py-2">
        <span className="badge bg-warning text-dark fw-bold">DEMO MODE</span>
        <span className="small flex-grow-1">
          Static demo — all data is stored in <strong>your browser only</strong>. No backend or MySQL is running.
        </span>
        <button className="btn btn-sm btn-outline-light" onClick={() => setOpen(!open)}>
          {open ? 'Hide details' : 'What is this?'}
        </button>
        <button className="btn btn-sm btn-light" onClick={handleReset}>
          Reset demo data
        </button>
      </div>

      {open && (
        <div className="container pb-3">
          <div className="demo-panel small">
            <p className="mb-2">
              This is a <strong>browser-only demo</strong> of the Railway Reservation and Train Management System.
              The real project is a full-stack app — React + Vite frontend, Spring Boot REST API, Spring Data JPA
              and MySQL. Here, the HTTP layer has been swapped for an in-browser mock that mirrors the same
              endpoints, JSON shapes, status codes and error messages, so every screen behaves identically.
            </p>
            <p className="mb-2">
              <strong>Demo logins</strong> — one click on the login page, or type them:
              <br />
              User: <code>rahul@example.com</code> / <code>rahul123</code>
              <br />
              Admin: <code>admin@railway.com</code> / <code>admin123</code>
            </p>
            <p className="mb-0">
              Bookings, payments and cancellations you make are saved to <code>localStorage</code>, so they survive a
              refresh. Use <strong>Reset demo data</strong> to restore the original seed. All data is synthetic.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
