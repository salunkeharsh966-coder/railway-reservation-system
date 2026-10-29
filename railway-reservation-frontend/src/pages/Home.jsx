import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="container py-4">
      <div className="hero p-5 mb-4 shadow-sm">
        <h1 className="display-5 fw-bold">Book Your Journey with RailYatra</h1>
        <p className="lead mb-4">
          Search trains across India, check live seat availability, book tickets in a few
          clicks and manage all your journeys in one place.
        </p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-warning btn-lg fw-semibold" to="/search">
            🔍 Search Trains
          </Link>
          {!isAuthenticated && (
            <Link className="btn btn-outline-light btn-lg" to="/register">
              Create an Account
            </Link>
          )}
          {isAuthenticated && (
            <Link className="btn btn-outline-light btn-lg" to="/my-bookings">
              My Bookings
            </Link>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="alert alert-info">
          Welcome back, <strong>{user?.name}</strong>! Ready to plan your next trip?
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="fs-1">🔍</div>
              <h5 className="card-title">Search &amp; Compare</h5>
              <p className="card-text text-muted">
                Enter your source, destination and travel date to see every matching train
                with timings, distance and fares for all classes.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="fs-1">🎫</div>
              <h5 className="card-title">Book in Seconds</h5>
              <p className="card-text text-muted">
                Pick your class, add passenger details, review the fare and confirm with a
                demo payment. Your PNR is generated instantly.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="fs-1">📋</div>
              <h5 className="card-title">Manage Tickets</h5>
              <p className="card-text text-muted">
                View all your bookings, print or download your ticket, and cancel a journey
                when your plans change.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4 className="mb-3">Popular Routes</h4>
          <div className="row g-3">
            {[
              ['Mumbai', 'Pune'],
              ['Mumbai', 'Delhi'],
              ['Delhi', 'Chennai'],
              ['Mumbai', 'Ahmedabad'],
              ['Kolkata', 'Chennai'],
              ['Delhi', 'Lucknow'],
            ].map(([from, to]) => (
              <div className="col-md-4 col-sm-6" key={`${from}-${to}`}>
                <Link
                  className="btn btn-outline-primary w-100"
                  to={`/search?source=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`}
                >
                  {from} → {to}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
