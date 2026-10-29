import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api.js'

const CLASS_LABELS = {
  SLEEPER: 'Sleeper',
  AC_3: 'AC 3-Tier',
  AC_2: 'AC 2-Tier',
  AC_1: 'AC 1-Tier',
  CHAIR_CAR: 'Chair Car',
}

export default function BookingConfirmation() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const [method, setMethod] = useState('UPI')

  useEffect(() => {
    api
      .get(`/bookings/${bookingId}`)
      .then(({ data }) => {
        setBooking(data)
        if (data.payment) setPaid(true)
      })
      .catch((e) => setError(e.message))
  }, [bookingId])

  const handlePayment = async () => {
    setError('')
    setPaying(true)
    try {
      await api.post('/payments', { bookingId: Number(bookingId), paymentMethod: method })
      setPaid(true)
      const { data } = await api.get(`/bookings/${bookingId}`)
      setBooking(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setPaying(false)
    }
  }

  if (error && !booking) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>
  if (!booking) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <div className="display-4">✅</div>
        <h2>Booking Created Successfully</h2>
        <p className="text-muted">Your PNR is <span className="pnr-badge text-primary">{booking.pnr}</span></p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Journey Summary</h5>
              <table className="table table-sm">
                <tbody>
                  <tr><th>Train</th><td>{booking.trainName} ({booking.trainNumber})</td></tr>
                  <tr><th>Route</th><td>{booking.source} → {booking.destination}</td></tr>
                  <tr><th>Departure</th><td>{booking.departureTime}</td></tr>
                  <tr><th>Arrival</th><td>{booking.arrivalTime}</td></tr>
                  <tr><th>Journey date</th><td>{booking.journeyDate}</td></tr>
                  <tr><th>Class</th><td>{CLASS_LABELS[booking.classType]}</td></tr>
                  <tr><th>Passengers</th><td>{booking.totalPassengers}</td></tr>
                  <tr><th>Status</th><td><span className="badge bg-success">{booking.bookingStatus}</span></td></tr>
                </tbody>
              </table>

              <h6 className="mt-3">Passengers</h6>
              <ul className="list-group">
                {booking.passengers?.map((p) => (
                  <li className="list-group-item d-flex justify-content-between" key={p.id}>
                    <span>{p.name} ({p.age}, {p.gender})</span>
                    <span className="badge bg-secondary">Seat {p.seatNumber}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Payment</h5>
              <div className="d-flex justify-content-between fs-5 mb-3">
                <span>Total Amount</span>
                <span className="fw-bold text-primary">₹{booking.totalAmount}</span>
              </div>

              {paid ? (
                <div className="alert alert-success mb-0">
                  <strong>Payment successful</strong>
                  {booking.payment && (
                    <div className="small mt-1">
                      Payment ID: {booking.payment.paymentId}<br />
                      Method: {booking.payment.paymentMethod}<br />
                      Status: {booking.payment.paymentStatus}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <label className="form-label">Payment method (demo)</label>
                  <select className="form-select mb-3" value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option>UPI</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Net Banking</option>
                    <option>Wallet</option>
                  </select>
                  <button className="btn btn-success w-100" onClick={handlePayment} disabled={paying}>
                    {paying ? 'Processing…' : `Pay ₹${booking.totalAmount}`}
                  </button>
                  <p className="text-muted small mt-2 mb-0">
                    This is a simulated payment. No real money is transferred.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <Link className="btn btn-primary" to={`/ticket/${booking.id}`}>View Ticket</Link>
            <Link className="btn btn-outline-secondary" to="/my-bookings">My Bookings</Link>
            <button className="btn btn-outline-primary" onClick={() => navigate('/search')}>
              Book Another Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
