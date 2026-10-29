import { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api
      .get(`/auth/profile/${user.userId}`)
      .then(({ data }) => setForm({ name: data.name, email: data.email, phone: data.phone || '', password: '' }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user.userId])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      const { data } = await api.put(`/auth/profile/${user.userId}`, payload)
      login({ ...user, name: data.name, email: data.email })
      setMessage('Profile updated successfully.')
      setForm({ ...form, password: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="mb-1">My Profile</h3>
              <p className="text-muted">
                Role: <span className="badge bg-primary">{user.role}</span>
              </p>

              {error && <div className="alert alert-danger py-2">{error}</div>}
              {message && <div className="alert alert-success py-2">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full name</label>
                  <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input className="form-control" name="phone" value={form.phone} onChange={handleChange} maxLength={15} />
                </div>
                <div className="mb-3">
                  <label className="form-label">New password (leave blank to keep current)</label>
                  <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} minLength={6} />
                </div>
                <button className="btn btn-primary w-100" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
