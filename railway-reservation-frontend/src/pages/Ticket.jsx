import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api.js'

const CLASS_LABELS = {
  SLEEPER: 'Sleeper',
  AC_3: 'AC 3-Tier',
  AC_2: 'AC 2-Tier',
  AC_1: 'AC 1-Tier',
  CHAIR_CAR: 'Chair Car',
}

export default function Ticket() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/bookings/${bookingId}`).then(({ data }) => setBooking(data)).catch((e) => setError(e.message))
  }, [bookingId])

  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>
  if (!booking) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3 no-print">
        <Link to="/my-bookings" className="btn btn-sm btn-outline-secondary">← My Bookings</Link>
        <button className="btn btn-sm btn-primary" onClick={() => window.print()}>🖨 Print / Download</button>
      </div>

      <div className="ticket shadow-sm">
        <div className="ticket-header p-3 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">🚆 RailYatra E-Ticket</h4>
            <small>Electronic Reservation Slip</small>
          </div>
          <div className="text-end">
            <div className="small">PNR</div>
            <div className="pnr-badge fs-5">{booking.pnr}</div>
          </div>
        </div>

        <div className="p-4">
          <div className="row mb-3">
            <div className="col-md-6">
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  <tr><th style={{ width: '40%' }}>Train</th><td>{booking.trainName} ({booking.trainNumber})</td></tr>
                  <tr><th>From</th><td>{booking.source}</td></tr>
                  <tr><th>To</th><td>{booking.destination}</td></tr>
                  <tr><th>Departure</th><td>{booking.departureTime}</td></tr>
                  <tr><th>Arrival</th><td>{booking.arrivalTime}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  <tr><th style={{ width: '40%' }}>Journey Date</th><td>{booking.journeyDate}</td></tr>
                  <tr><th>Class</th><td>{CLASS_LABELS[booking.classType]}</td></tr>
                  <tr><th>Passengers</th><td>{booking.totalPassengers}</td></tr>
                  <tr><th>Booked On</th><td>{booking.bookingDate?.replace('T', ' ').slice(0, 16)}</td></tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span className={`badge ${booking.bookingStatus === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h6>Passenger Details</h6>
          <div className="table-responsive">
            <table className="table table-bordered table-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Seat</th><th>Preference</th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers?.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.seatNumber}</td>
                    <td>{p.seatPreference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              {booking.payment && (
                <div className="small text-muted">
                  <strong>Payment:</strong> {booking.payment.paymentId} · {booking.payment.paymentMethod} ·{' '}
                  {booking.payment.paymentStatus}
                </div>
              )}
            </div>
            <div className="col-md-6 text-md-end">
              <span className="fs-5">Total Fare: <strong className="text-primary">₹{booking.totalAmount}</strong></span>
            </div>
          </div>

          <hr />
          <p className="small text-muted mb-0">
            This is a computer-generated ticket for an academic demonstration project. Please carry a
            valid photo ID during travel. Payments shown are simulated.
          </p>
        </div>
      </div>
    </div>
  )
}
