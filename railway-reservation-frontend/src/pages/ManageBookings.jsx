import { useEffect, useState } from 'react'
import api from '../services/api.js'

const CLASS_LABELS = {
  SLEEPER: 'Sleeper',
  AC_3: 'AC 3-Tier',
  AC_2: 'AC 2-Tier',
  AC_1: 'AC 1-Tier',
  CHAIR_CAR: 'Chair Car',
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/admin/bookings')
      .then(({ data }) => setBookings(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const visible = bookings.filter((b) => {
    const statusOk = filter === 'ALL' || b.bookingStatus === filter
    const q = search.trim().toLowerCase()
    const searchOk =
      !q ||
      b.pnr.toLowerCase().includes(q) ||
      b.userName?.toLowerCase().includes(q) ||
      b.trainName?.toLowerCase().includes(q)
    return statusOk && searchOk
  })

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>

  return (
    <div className="container py-4">
      <h2 className="mb-3">Manage Bookings</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by PNR, user or train…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3 text-md-end">
          <span className="text-muted">{visible.length} booking(s)</span>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>PNR</th><th>User</th><th>Train</th><th>Route</th><th>Date</th>
                  <th>Class</th><th>Pax</th><th>Amount</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((b) => (
                  <tr key={b.id}>
                    <td className="pnr-badge">{b.pnr}</td>
                    <td>{b.userName}</td>
                    <td>{b.trainName} ({b.trainNumber})</td>
                    <td>{b.source} → {b.destination}</td>
                    <td>{b.journeyDate}</td>
                    <td>{CLASS_LABELS[b.classType]}</td>
                    <td>{b.totalPassengers}</td>
                    <td>₹{b.totalAmount}</td>
                    <td>
                      <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr><td colSpan={9} className="text-center text-muted py-3">No bookings match your filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
