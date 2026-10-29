import { Link } from 'react-router-dom'

const CLASS_LABELS = {
  SLEEPER: 'Sleeper',
  AC_3: 'AC 3-Tier',
  AC_2: 'AC 2-Tier',
  AC_1: 'AC 1-Tier',
  CHAIR_CAR: 'Chair Car',
}

/** A single train result card used on the search results page. */
export default function TrainCard({ train }) {
  return (
    <div className="card card-train mb-3">
      <div className="card-body">
        <div className="row align-items-center g-3">
          <div className="col-md-4">
            <h5 className="mb-1">{train.trainName}</h5>
            <span className="badge bg-secondary me-2">{train.trainNumber}</span>
            <span className="badge bg-info text-dark">{train.trainType}</span>
          </div>

          <div className="col-md-4">
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-bold">{train.departureTime}</div>
                <small className="text-muted">{train.source}</small>
              </div>
              <div className="text-center text-muted small px-2">
                <div>→</div>
                <div>{train.distance} km</div>
              </div>
              <div className="text-end">
                <div className="fw-bold">{train.arrivalTime}</div>
                <small className="text-muted">{train.destination}</small>
              </div>
            </div>
          </div>

          <div className="col-md-4 text-md-end">
            <div className="mb-1">
              <small className="text-muted">From</small>{' '}
              <span className="fw-bold text-primary">₹{train.fareSleeper}</span>
            </div>
            <div className="mb-2">
              <small className="text-muted">Seats available:</small>{' '}
              <span className={train.availableSeats > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                {train.availableSeats}
              </span>
            </div>
            <Link className="btn btn-primary btn-sm" to={`/trains/${train.id}`}>
              View &amp; Book
            </Link>
          </div>
        </div>

        <div className="mt-2 small text-muted">
          {Object.entries(CLASS_LABELS).map(([key, label]) => (
            <span key={key} className="me-3">
              {label}: ₹{train[`fare${key === 'SLEEPER' ? 'Sleeper' : key === 'AC_3' ? 'Ac3' : key === 'AC_2' ? 'Ac2' : key === 'AC_1' ? 'Ac1' : 'Cc'}`]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
