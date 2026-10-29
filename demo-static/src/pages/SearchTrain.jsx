import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api.js'
import TrainCard from '../components/TrainCard.jsx'

export default function SearchTrain() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    source: searchParams.get('source') || '',
    destination: searchParams.get('destination') || '',
    date: '',
    classType: '',
  })
  const [trains, setTrains] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stations, setStations] = useState({ sources: [], destinations: [] })

  useEffect(() => {
    api
      .get('/trains/stations')
      .then(({ data }) => setStations(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (form.source && form.destination) handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await api.get('/trains/search', {
        params: { source: form.source, destination: form.destination },
      })
      setTrains(data)
    } catch (err) {
      setError(err.message)
      setTrains([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Search Trains</h2>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={handleSearch}>
            <div className="col-md-3">
              <label className="form-label">From</label>
              <input
                className="form-control"
                name="source"
                list="sources"
                value={form.source}
                onChange={handleChange}
                required
                placeholder="e.g. Mumbai"
              />
              <datalist id="sources">
                {stations.sources?.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div className="col-md-3">
              <label className="form-label">To</label>
              <input
                className="form-control"
                name="destination"
                list="destinations"
                value={form.destination}
                onChange={handleChange}
                required
                placeholder="e.g. Pune"
              />
              <datalist id="destinations">
                {stations.destinations?.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Class</label>
              <select className="form-select" name="classType" value={form.classType} onChange={handleChange}>
                <option value="">Any</option>
                <option value="SLEEPER">Sleeper</option>
                <option value="AC_3">AC 3-Tier</option>
                <option value="AC_2">AC 2-Tier</option>
                <option value="AC_1">AC 1-Tier</option>
                <option value="CHAIR_CAR">Chair Car</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {!loading && searched && trains.length === 0 && !error && (
        <div className="alert alert-warning">
          No trains found for this route. Try a different source or destination.
        </div>
      )}

      {!loading && trains.length > 0 && (
        <>
          <p className="text-muted">{trains.length} train(s) found</p>
          {trains.map((t) => (
            <TrainCard key={t.id} train={t} />
          ))}
        </>
      )}
    </div>
  )
}
