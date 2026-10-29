export default function Footer() {
  return (
    <footer className="footer-railway py-4 mt-5 no-print">
      <div className="container">
        <div className="row gy-3">
          <div className="col-md-6">
            <h6 className="text-white fw-bold">🚆 RailYatra</h6>
            <p className="mb-0 small">
              Railway Reservation and Train Management System — a full-stack academic project
              built with React, Spring Boot and MySQL.
            </p>
          </div>
          <div className="col-md-3">
            <h6 className="text-white fw-bold">Quick Links</h6>
            <ul className="list-unstyled small mb-0">
              <li><a href="/">Home</a></li>
              <li><a href="/search">Search Trains</a></li>
              <li><a href="/my-bookings">My Bookings</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-white fw-bold">Note</h6>
            <p className="small mb-0">
              Payments are simulated for demonstration. No real transaction is processed.
            </p>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center small mb-0">
          © {new Date().getFullYear()} RailYatra — Academic Project. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
