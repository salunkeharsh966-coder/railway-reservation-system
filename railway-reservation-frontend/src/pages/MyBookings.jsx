import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const CLASS_LABELS = {
  SLEEPER: 'Sleeper',
  AC_3: 'AC 3-Tier',
  AC_2: 'AC 2-Tier',
  AC_1: 'AC 1-Tier',
  CHAIR_CAR: 'Chair Car',
}

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = () => {
    setLoading(true)
    api
      .get('/bookings/my', { params: { userId: user.userId } })
      .then(({ data }) => setBookings(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [user.userId])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setError('')
    setMessage('')
    try {
      await api.put(`/bookings/${id}/cancel`)
      setMessage('Booking cancelled successfully.')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>

  return (
    <div className="container py-4">
      <h2 className="mb-3">My Bookings</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {bookings.length === 0 && (
        <div className="alert alert-info">
          You have no bookings yet. <Link to="/search">Search trains</Link> to book your first journey.
        </div>
      )}

      {bookings.map((b) => (
        <div className="card shadow-sm border-0 mb-3" key={b.id}>
          <div className="card-body">
            <div className="row align-items-center g-3">
              <div className="col-md-5">
                <h5 className="mb-1">{b.trainName} <span className="badge bg-secondary">{b.trainNumber}</span></h5>
                <div className="text-muted small">
                  {b.source} → {b.destination} · {b.journeyDate} · {CLASS_LABELS[b.classType]}
                </div>
                <div className="mt-1">
                  PNR: <span className="pnr-badge text-primary">{b.pnr}</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="small text-muted">Passengers</div>
                <div className="fw-bold">{b.totalPassengers}</div>
                <div className="small text-muted mt-1">Amount</div>
                <div className="fw-bold">₹{b.totalAmount}</div>
              </div>
              <div className="col-md-2">
                <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                  {b.bookingStatus}
                </span>
              </div>
              <div className="col-md-2 text-md-end">
                <div className="d-grid gap-2">
                  <Link className="btn btn-sm btn-primary" to={`/ticket/${b.id}`}>View Ticket</Link>
                  {b.bookingStatus === 'CONFIRMED' && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(b.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
