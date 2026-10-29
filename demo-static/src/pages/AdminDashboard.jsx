import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([api.get('/admin/dashboard'), api.get('/admin/users')])
      .then(([s, u]) => {
        setStats(s.data)
        setUsers(u.data)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? Their bookings will remain but lose the owner link.')) return
    try {
      await api.delete(`/admin/users/${id}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, color: 'bg-primary' },
    { label: 'Total Trains', value: stats?.totalTrains, color: 'bg-info' },
    { label: 'Total Bookings', value: stats?.totalBookings, color: 'bg-secondary' },
    { label: 'Confirmed', value: stats?.confirmedBookings, color: 'bg-success' },
    { label: 'Cancelled', value: stats?.cancelledBookings, color: 'bg-danger' },
    { label: 'Revenue (₹)', value: stats?.totalRevenue, color: 'bg-warning' },
  ]

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Admin Dashboard</h2>
        <div className="d-flex gap-2">
          <Link className="btn btn-sm btn-outline-primary" to="/admin/trains">Manage Trains</Link>
          <Link className="btn btn-sm btn-outline-primary" to="/admin/bookings">Manage Bookings</Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-md-4 col-lg-2" key={c.label}>
            <div className={`card stat-card ${c.color} shadow-sm`}>
              <div className="card-body">
                <div className="small">{c.label}</div>
                <div className="stat-value">{c.value ?? '—'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-3">Registered Users</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th></th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td><span className={`badge ${u.role === 'ADMIN' ? 'bg-dark' : 'bg-primary'}`}>{u.role}</span></td>
                    <td className="text-end">
                      {u.role !== 'ADMIN' && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
