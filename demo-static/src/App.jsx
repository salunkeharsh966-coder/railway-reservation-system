import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import DemoBanner from './components/DemoBanner.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import SearchTrain from './pages/SearchTrain.jsx'
import TrainDetails from './pages/TrainDetails.jsx'
import PassengerDetails from './pages/PassengerDetails.jsx'
import BookingConfirmation from './pages/BookingConfirmation.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Ticket from './pages/Ticket.jsx'
import Profile from './pages/Profile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ManageTrains from './pages/ManageTrains.jsx'
import ManageBookings from './pages/ManageBookings.jsx'

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <DemoBanner />
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchTrain />} />
          <Route path="/trains/:id" element={<TrainDetails />} />
          <Route
            path="/book/:trainId"
            element={
              <ProtectedRoute>
                <PassengerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-confirmation/:bookingId"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket/:bookingId"
            element={
              <ProtectedRoute>
                <Ticket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trains"
            element={
              <ProtectedRoute adminOnly>
                <ManageTrains />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly>
                <ManageBookings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
