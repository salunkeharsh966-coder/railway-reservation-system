import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const CLASS_LABELS = {
  SLEEPER: 'Sleeper',
  AC_3: 'AC 3-Tier',
  AC_2: 'AC 2-Tier',
  AC_1: 'AC 1-Tier',
  CHAIR_CAR: 'Chair Car',
}

const FARE_FIELD = {
  SLEEPER: 'fareSleeper',
  AC_3: 'fareAc3',
  AC_2: 'fareAc2',
  AC_1: 'fareAc1',
  CHAIR_CAR: 'fareCc',
}

const emptyPassenger = () => ({ name: '', age: '', gender: 'Male', seatPreference: 'Lower' })

export default function PassengerDetails() {
  const { trainId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const classType = searchParams.get('classType') || 'SLEEPER'
  const journeyDate = searchParams.get('journeyDate') || ''

  const [train, setTrain] = useState(null)
  const [passengers, setPassengers] = useState([emptyPassenger()])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/trains/${trainId}`).then(({ data }) => setTrain(data)).catch((e) => setError(e.message))
  }, [trainId])

  const updatePassenger = (index, field, value) => {
    const next = [...passengers]
    next[index] = { ...next[index], [field]: value }
    setPassengers(next)
  }

  const addPassenger = () => setPassengers([...passengers, emptyPassenger()])

  const removePassenger = (index) => {
    if (passengers.length === 1) return
    setPassengers(passengers.filter((_, i) => i !== index))
  }

  const fare = train ? Number(train[FARE_FIELD[classType]] || 0) : 0
  const total = fare * passengers.length

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        userId: user.userId,
        trainId: Number(trainId),
        journeyDate,
        classType,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: Number(p.age),
          gender: p.gender,
          seatPreference: p.seatPreference,
        })),
      }
      const { data } = await api.post('/bookings', payload)
      navigate(`/booking-confirmation/${data.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!train) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>

  return (
    <div className="container py-4">
      <h2 className="mb-3">Passenger Details</h2>

      <div className="alert alert-secondary">
        <strong>{train.trainName}</strong> ({train.trainNumber}) · {train.source} → {train.destination} ·{' '}
        {journeyDate} · {CLASS_LABELS[classType]}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {passengers.map((p, i) => (
          <div className="card shadow-sm border-0 mb-3" key={i}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Passenger {i + 1}</h6>
                {passengers.length > 1 && (
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removePassenger(i)}>
                    Remove
                  </button>
                )}
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Full name</label>
                  <input
                    className="form-control"
                    value={p.name}
                    onChange={(e) => updatePassenger(i, 'name', e.target.value)}
                    required
                    placeholder="Passenger name"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    max={120}
                    value={p.age}
                    onChange={(e) => updatePassenger(i, 'age', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={p.gender}
                    onChange={(e) => updatePassenger(i, 'gender', e.target.value)}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Seat preference</label>
                  <select
                    className="form-select"
                    value={p.seatPreference}
                    onChange={(e) => updatePassenger(i, 'seatPreference', e.target.value)}
                  >
                    <option>Lower</option>
                    <option>Middle</option>
                    <option>Upper</option>
                    <option>Window</option>
                    <option>Aisle</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-outline-primary mb-4" onClick={addPassenger}>
          + Add another passenger
        </button>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5>Fare Summary</h5>
            <div className="d-flex justify-content-between">
              <span>Fare per passenger ({CLASS_LABELS[classType]})</span>
              <span>₹{fare.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Passengers</span>
              <span>{passengers.length}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total Amount</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>
            <button className="btn btn-warning w-100 mt-3 fw-semibold" type="submit" disabled={submitting}>
              {submitting ? 'Creating booking…' : 'Review & Confirm Booking'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
