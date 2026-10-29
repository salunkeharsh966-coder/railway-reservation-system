import { useEffect, useState } from 'react'
import api from '../services/api.js'

const emptyForm = {
  trainNumber: '',
  trainName: '',
  source: '',
  destination: '',
  departureTime: '',
  arrivalTime: '',
  distance: '',
  trainType: 'Express',
  availableSeats: '',
  fareSleeper: '',
  fareAc3: '',
  fareAc2: '',
  fareAc1: '',
  fareCc: '',
}

export default function ManageTrains() {
  const [trains, setTrains] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/trains').then(({ data }) => setTrains(data)).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    const payload = {
      ...form,
      distance: Number(form.distance),
      availableSeats: Number(form.availableSeats),
      fareSleeper: Number(form.fareSleeper),
      fareAc3: Number(form.fareAc3),
      fareAc2: Number(form.fareAc2),
      fareAc1: Number(form.fareAc1),
      fareCc: Number(form.fareCc),
    }
    try {
      if (editingId) {
        await api.put(`/trains/${editingId}`, payload)
        setMessage('Train updated successfully.')
      } else {
        await api.post('/trains', payload)
        setMessage('Train added successfully.')
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (t) => {
    setEditingId(t.id)
    setForm({
      trainNumber: t.trainNumber,
      trainName: t.trainName,
      source: t.source,
      destination: t.destination,
      departureTime: t.departureTime,
      arrivalTime: t.arrivalTime,
      distance: t.distance,
      trainType: t.trainType,
      availableSeats: t.availableSeats,
      fareSleeper: t.fareSleeper,
      fareAc3: t.fareAc3,
      fareAc2: t.fareAc2,
      fareAc1: t.fareAc1,
      fareCc: t.fareCc,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this train? This cannot be undone.')) return
    setError('')
    setMessage('')
    try {
      await api.delete(`/trains/${id}`)
      setMessage('Train deleted successfully.')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Manage Trains</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-3">{editingId ? `Edit Train #${editingId}` : 'Add New Train'}</h5>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-2">
              <label className="form-label">Number</label>
              <input className="form-control" name="trainNumber" value={form.trainNumber} onChange={handleChange} required maxLength={10} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Name</label>
              <input className="form-control" name="trainName" value={form.trainName} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Source</label>
              <input className="form-control" name="source" value={form.source} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Destination</label>
              <input className="form-control" name="destination" value={form.destination} onChange={handleChange} required />
            </div>
            <div className="col-md-2">
              <label className="form-label">Departure</label>
              <input className="form-control" name="departureTime" value={form.departureTime} onChange={handleChange} required placeholder="HH:MM" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Arrival</label>
              <input className="form-control" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} required placeholder="HH:MM" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Distance (km)</label>
              <input type="number" className="form-control" name="distance" value={form.distance} onChange={handleChange} required min={1} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Type</label>
              <select className="form-select" name="trainType" value={form.trainType} onChange={handleChange}>
                <option>Express</option>
                <option>Superfast</option>
                <option>Rajdhani</option>
                <option>Mail</option>
                <option>Passenger</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Seats</label>
              <input type="number" className="form-control" name="availableSeats" value={form.availableSeats} onChange={handleChange} required min={0} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Sleeper ₹</label>
              <input type="number" step="0.01" className="form-control" name="fareSleeper" value={form.fareSleeper} onChange={handleChange} required min={0.01} />
            </div>
            <div className="col-md-2">
              <label className="form-label">AC3 ₹</label>
              <input type="number" step="0.01" className="form-control" name="fareAc3" value={form.fareAc3} onChange={handleChange} required min={0.01} />
            </div>
            <div className="col-md-2">
              <label className="form-label">AC2 ₹</label>
              <input type="number" step="0.01" className="form-control" name="fareAc2" value={form.fareAc2} onChange={handleChange} required min={0.01} />
            </div>
            <div className="col-md-2">
              <label className="form-label">AC1 ₹</label>
              <input type="number" step="0.01" className="form-control" name="fareAc1" value={form.fareAc1} onChange={handleChange} required min={0.01} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Chair Car ₹</label>
              <input type="number" step="0.01" className="form-control" name="fareCc" value={form.fareCc} onChange={handleChange} required min={0.01} />
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" type="submit">{editingId ? 'Update Train' : 'Add Train'}</button>
              {editingId && <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-3">All Trains ({trains.length})</h5>
          {loading ? (
            <div className="text-center py-3"><div className="spinner-border text-primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>No.</th><th>Name</th><th>Route</th><th>Dep</th><th>Arr</th><th>Type</th><th>Seats</th><th>From ₹</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((t) => (
                    <tr key={t.id}>
                      <td>{t.trainNumber}</td>
                      <td>{t.trainName}</td>
                      <td>{t.source} → {t.destination}</td>
                      <td>{t.departureTime}</td>
                      <td>{t.arrivalTime}</td>
                      <td>{t.trainType}</td>
                      <td>{t.availableSeats}</td>
                      <td>₹{t.fareSleeper}</td>
                      <td className="text-end text-nowrap">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(t)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
