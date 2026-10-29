import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const CLASSES = [
  { key: 'SLEEPER', label: 'Sleeper', fare: 'fareSleeper' },
  { key: 'AC_3', label: 'AC 3-Tier', fare: 'fareAc3' },
  { key: 'AC_2', label: 'AC 2-Tier', fare: 'fareAc2' },
  { key: 'AC_1', label: 'AC 1-Tier', fare: 'fareAc1' },
  { key: 'CHAIR_CAR', label: 'Chair Car', fare: 'fareCc' },
]

export default function TrainDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [train, setTrain] = useState(null)
  const [selectedClass, setSelectedClass] = useState('SLEEPER')
  const [journeyDate, setJourneyDate] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/trains/${id}`)
      .then(({ data }) => setTrain(data))
      .catch((err) => setError(err.message))
  }, [id])

  const handleBook = () => {
    if (!journeyDate) {
      setError('Please choose a journey date')
      return
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/trains/${id}` } })
      return
    }
    navigate(`/book/${id}?classType=${selectedClass}&journeyDate=${journeyDate}`)
  }

  if (error && !train) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>
  if (!train) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container py-4">
      <Link to="/search" className="btn btn-sm btn-outline-secondary mb-3">← Back to search</Link>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <h3 className="mb-1">{train.trainName}</h3>
              <span className="badge bg-secondary me-2">{train.trainNumber}</span>
              <span className="badge bg-info text-dark">{train.trainType}</span>
            </div>
            <div className="text-end">
              <div className="text-muted small">Seats available</div>
              <div className={`fs-4 fw-bold ${train.availableSeats > 0 ? 'text-success' : 'text-danger'}`}>
                {train.availableSeats}
              </div>
            </div>
          </div>

          <hr />

          <div className="row text-center">
            <div className="col-md-3">
              <div className="text-muted small">Departure</div>
              <div className="fs-5 fw-bold">{train.departureTime}</div>
              <div>{train.source}</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Arrival</div>
              <div className="fs-5 fw-bold">{train.arrivalTime}</div>
              <div>{train.destination}</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Distance</div>
              <div className="fs-5 fw-bold">{train.distance} km</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Train type</div>
              <div className="fs-5 fw-bold">{train.trainType}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Select Class</h5>
              <div className="row g-2">
                {CLASSES.map((c) => (
                  <div className="col-md-6" key={c.key}>
                    <button
                      type="button"
                      className={`btn w-100 text-start ${selectedClass === c.key ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setSelectedClass(c.key)}
                    >
                      <div className="d-flex justify-content-between">
                        <span>{c.label}</span>
                        <span className="fw-bold">₹{train[c.fare]}</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Journey Date</h5>
              <input
                type="date"
                className="form-control mb-3"
                min={today}
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
              />
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button
                className="btn btn-warning w-100 fw-semibold"
                onClick={handleBook}
                disabled={train.availableSeats <= 0}
              >
                {train.availableSeats > 0 ? 'Proceed to Book' : 'Sold Out'}
              </button>
              {!isAuthenticated && (
                <p className="text-muted small mt-2 mb-0">You will be asked to sign in first.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
