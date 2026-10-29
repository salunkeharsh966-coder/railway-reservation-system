/**
 * In-browser mock of the Spring Boot REST API.
 *
 * This file exists ONLY for the static demo. It mirrors, endpoint by endpoint,
 * the real backend in `railway-reservation-backend`:
 *
 *   @RestController @RequestMapping("/api/trains")  ->  ROUTES entry below
 *   @Service TrainService#searchTrains(...)         ->  handler `searchTrains`
 *   JpaRepository<Train, Long>                      ->  array .filter / .find
 *   GlobalExceptionHandler                          ->  fail(status, message)
 *
 * Every response shape, field name, status code and error message is copied
 * from the Java DTOs and services, so the React pages cannot tell the
 * difference. Data lives in localStorage instead of MySQL.
 */

const STORAGE_KEY = 'railway_demo_db_v1'

/* ------------------------------------------------------------------ seed ---
 * Copied from database/seed.sql. Journey dates are regenerated relative to
 * today so the demo never shows a stale "upcoming" trip.
 */
const iso = (d) => d.toISOString().slice(0, 10)
const daysFromNow = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return iso(d)
}

const seed = () => ({
  users: [
    { id: 1, name: 'Admin User', email: 'admin@railway.com', password: 'admin123', phone: '9800000001', role: 'ADMIN' },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', password: 'rahul123', phone: '9800000002', role: 'USER' },
    { id: 3, name: 'Priya Patil', email: 'priya@example.com', password: 'priya123', phone: '9800000003', role: 'USER' },
  ],
  trains: [
    { id: 1, trainNumber: '12123', trainName: 'Deccan Express', source: 'Mumbai', destination: 'Pune', departureTime: '06:40', arrivalTime: '10:05', distance: 192, trainType: 'Express', availableSeats: 120, fareSleeper: 245, fareAc3: 620, fareAc2: 880, fareAc1: 1480, fareCc: 410 },
    { id: 2, trainNumber: '11007', trainName: 'Deccan Queen', source: 'Mumbai', destination: 'Pune', departureTime: '17:10', arrivalTime: '20:25', distance: 192, trainType: 'Superfast', availableSeats: 96, fareSleeper: 265, fareAc3: 660, fareAc2: 940, fareAc1: 1560, fareCc: 430 },
    { id: 3, trainNumber: '12027', trainName: 'Shatabdi Express', source: 'Pune', destination: 'Mumbai', departureTime: '06:15', arrivalTime: '09:30', distance: 192, trainType: 'Superfast', availableSeats: 80, fareSleeper: 275, fareAc3: 690, fareAc2: 980, fareAc1: 1620, fareCc: 450 },
    { id: 4, trainNumber: '12951', trainName: 'Rajdhani Express', source: 'Mumbai', destination: 'Delhi', departureTime: '16:35', arrivalTime: '08:35', distance: 1384, trainType: 'Rajdhani', availableSeats: 72, fareSleeper: 780, fareAc3: 1980, fareAc2: 2760, fareAc1: 4620, fareCc: 0 },
    { id: 5, trainNumber: '12621', trainName: 'Tamil Nadu Express', source: 'Delhi', destination: 'Chennai', departureTime: '22:30', arrivalTime: '07:40', distance: 2175, trainType: 'Superfast', availableSeats: 88, fareSleeper: 890, fareAc3: 2240, fareAc2: 3120, fareAc1: 5240, fareCc: 0 },
    { id: 6, trainNumber: '12009', trainName: 'Shatabdi Express', source: 'Mumbai', destination: 'Ahmedabad', departureTime: '06:25', arrivalTime: '13:05', distance: 493, trainType: 'Superfast', availableSeats: 64, fareSleeper: 520, fareAc3: 1320, fareAc2: 1840, fareAc1: 3080, fareCc: 860 },
    { id: 7, trainNumber: '12841', trainName: 'Coromandel Express', source: 'Kolkata', destination: 'Chennai', departureTime: '14:50', arrivalTime: '17:00', distance: 1662, trainType: 'Superfast', availableSeats: 92, fareSleeper: 720, fareAc3: 1820, fareAc2: 2540, fareAc1: 4260, fareCc: 0 },
    { id: 8, trainNumber: '12626', trainName: 'Kerala Express', source: 'Delhi', destination: 'Trivandrum', departureTime: '11:25', arrivalTime: '13:15', distance: 3054, trainType: 'Superfast', availableSeats: 76, fareSleeper: 1120, fareAc3: 2820, fareAc2: 3940, fareAc1: 6620, fareCc: 0 },
    { id: 9, trainNumber: '12230', trainName: 'Lucknow Mail', source: 'Delhi', destination: 'Lucknow', departureTime: '22:00', arrivalTime: '06:55', distance: 512, trainType: 'Mail', availableSeats: 110, fareSleeper: 430, fareAc3: 1090, fareAc2: 1520, fareAc1: 2540, fareCc: 720 },
    { id: 10, trainNumber: '12002', trainName: 'Bhopal Shatabdi', source: 'Delhi', destination: 'Bhopal', departureTime: '06:00', arrivalTime: '14:05', distance: 702, trainType: 'Superfast', availableSeats: 68, fareSleeper: 610, fareAc3: 1540, fareAc2: 2160, fareAc1: 3620, fareCc: 1010 },
    { id: 11, trainNumber: '12301', trainName: 'Howrah Rajdhani', source: 'Kolkata', destination: 'Delhi', departureTime: '16:50', arrivalTime: '10:00', distance: 1451, trainType: 'Rajdhani', availableSeats: 60, fareSleeper: 810, fareAc3: 2050, fareAc2: 2880, fareAc1: 4800, fareCc: 0 },
    { id: 12, trainNumber: '12615', trainName: 'Grand Trunk Express', source: 'Chennai', destination: 'Delhi', departureTime: '19:15', arrivalTime: '06:30', distance: 2182, trainType: 'Superfast', availableSeats: 84, fareSleeper: 900, fareAc3: 2260, fareAc2: 3150, fareAc1: 5280, fareCc: 0 },
  ],
  bookings: [
    {
      id: 1, pnr: 'PNR8B3N5T1WZ', userId: 2, trainId: 4, journeyDate: daysFromNow(34),
      classType: 'AC_3', totalPassengers: 1, totalAmount: 1980, bookingStatus: 'CONFIRMED',
      bookingDate: '2026-10-20T10:15:00',
      passengers: [{ id: 1, name: 'Rahul Sharma', age: 28, gender: 'Male', seatPreference: 'Lower', seatNumber: 'B1' }],
      payment: { id: 1, bookingId: 1, paymentId: 'PAY1000000000001', amount: 1980, paymentMethod: 'UPI', paymentStatus: 'SUCCESS', paymentDate: '2026-10-20T10:16:00' },
    },
    {
      id: 2, pnr: 'PNR4K7X2M9QA', userId: 2, trainId: 1, journeyDate: daysFromNow(17),
      classType: 'SLEEPER', totalPassengers: 2, totalAmount: 490, bookingStatus: 'CONFIRMED',
      bookingDate: '2026-10-18T18:40:00',
      passengers: [
        { id: 2, name: 'Rahul Sharma', age: 28, gender: 'Male', seatPreference: 'Lower', seatNumber: 'S1' },
        { id: 3, name: 'Priya Patil', age: 26, gender: 'Female', seatPreference: 'Window', seatNumber: 'S2' },
      ],
      payment: { id: 2, bookingId: 2, paymentId: 'PAY1000000000002', amount: 490, paymentMethod: 'Card', paymentStatus: 'SUCCESS', paymentDate: '2026-10-18T18:41:00' },
    },
    {
      id: 3, pnr: 'PNR6H9J4L2YC', userId: 3, trainId: 3, journeyDate: daysFromNow(22),
      classType: 'AC_2', totalPassengers: 3, totalAmount: 2940, bookingStatus: 'CONFIRMED',
      bookingDate: '2026-10-22T09:05:00',
      passengers: [
        { id: 4, name: 'Priya Patil', age: 26, gender: 'Female', seatPreference: 'Lower', seatNumber: 'A1' },
        { id: 5, name: 'Anil Patil', age: 54, gender: 'Male', seatPreference: 'Upper', seatNumber: 'A2' },
        { id: 6, name: 'Sunita Patil', age: 50, gender: 'Female', seatPreference: 'Middle', seatNumber: 'A3' },
      ],
      payment: { id: 3, bookingId: 3, paymentId: 'PAY1000000000003', amount: 2940, paymentMethod: 'NetBanking', paymentStatus: 'SUCCESS', paymentDate: '2026-10-22T09:06:00' },
    },
    {
      id: 4, pnr: 'PNR2D5F8G3VB', userId: 3, trainId: 6, journeyDate: daysFromNow(30),
      classType: 'CHAIR_CAR', totalPassengers: 2, totalAmount: 1720, bookingStatus: 'CANCELLED',
      bookingDate: '2026-10-15T14:20:00',
      passengers: [
        { id: 7, name: 'Priya Patil', age: 26, gender: 'Female', seatPreference: 'Window', seatNumber: 'C1' },
        { id: 8, name: 'Rohit Deshmukh', age: 29, gender: 'Male', seatPreference: 'Aisle', seatNumber: 'C2' },
      ],
      payment: { id: 4, bookingId: 4, paymentId: 'PAY1000000000004', amount: 1720, paymentMethod: 'UPI', paymentStatus: 'SUCCESS', paymentDate: '2026-10-15T14:21:00' },
    },
  ],
  nextIds: { user: 4, train: 13, booking: 5, passenger: 9, payment: 5 },
})

/* ------------------------------------------------------------- persistence ---
 * JpaRepository equivalent. Guarded so a corrupt/absent value can never poison
 * the store (JSON.stringify(undefined) would write the literal "undefined").
 */
let db = null

function load() {
  if (db) return db
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.trains) && parsed.nextIds) {
        db = parsed
        return db
      }
    }
  } catch {
    /* fall through to a fresh seed */
  }
  db = seed()
  persist()
  return db
}

function persist() {
  if (!db || typeof db !== 'object') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    /* storage full or blocked - demo keeps working in memory */
  }
}

export function resetDemoData() {
  db = seed()
  persist()
}

/* ------------------------------------------------------------------ errors ---
 * Mirrors GlobalExceptionHandler: { message, timestamp, status }.
 */
class ApiError extends Error {
  constructor(status, message, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

const fail = (status, message, errors) => {
  throw new ApiError(status, message, errors)
}

/* ----------------------------------------------------------------- helpers ---
 * Mirrors the DTO mappers in the Java services.
 */
const toUserResponse = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role })

const toTrainResponse = (t) => ({
  id: t.id,
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

const toPassengerResponse = (p) => ({
  id: p.id,
  name: p.name,
  age: p.age,
  gender: p.gender,
  seatPreference: p.seatPreference,
  seatNumber: p.seatNumber,
})

const toPaymentResponse = (p) =>
  p
    ? {
        id: p.id,
        bookingId: p.bookingId,
        paymentId: p.paymentId,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        paymentStatus: p.paymentStatus,
        paymentDate: p.paymentDate,
      }
    : null

function toBookingResponse(b) {
  const d = load()
  const train = d.trains.find((t) => t.id === b.trainId)
  const user = d.users.find((u) => u.id === b.userId)
  return {
    id: b.id,
    pnr: b.pnr,
    userId: b.userId,
    userName: user ? user.name : null,
    trainId: b.trainId,
    trainNumber: train ? train.trainNumber : null,
    trainName: train ? train.trainName : null,
    source: train ? train.source : null,
    destination: train ? train.destination : null,
    departureTime: train ? train.departureTime : null,
    arrivalTime: train ? train.arrivalTime : null,
    journeyDate: b.journeyDate,
    classType: b.classType,
    totalPassengers: b.totalPassengers,
    totalAmount: b.totalAmount,
    bookingStatus: b.bookingStatus,
    bookingDate: b.bookingDate,
    passengers: (b.passengers || []).map(toPassengerResponse),
    payment: toPaymentResponse(b.payment),
  }
}

const FARE_FIELD = {
  SLEEPER: 'fareSleeper',
  AC_3: 'fareAc3',
  AC_2: 'fareAc2',
  AC_1: 'fareAc1',
  CHAIR_CAR: 'fareCc',
}

const SEAT_PREFIX = { SLEEPER: 'S', AC_3: 'B', AC_2: 'A', AC_1: 'H', CHAIR_CAR: 'C' }

const PNR_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
function generatePnr(d) {
  for (let attempt = 0; attempt < 40; attempt++) {
    let pnr = ''
    for (let i = 0; i < 10; i++) pnr += PNR_CHARS[Math.floor(Math.random() * PNR_CHARS.length)]
    if (!d.bookings.some((b) => b.pnr === pnr)) return pnr
  }
  fail(400, 'Could not generate a unique PNR, please try again')
}

const nowIso = () => new Date().toISOString().slice(0, 19)

/* ---------------------------------------------------------------- handlers ---
 * One function per controller method.
 */

// AuthController#login -> UserService#login
function login(body) {
  const d = load()
  const email = String(body.email || '').trim().toLowerCase()
  const user = d.users.find((u) => u.email === email)
  if (!user || user.password !== body.password) fail(400, 'Invalid email or password')
  return { message: 'Login successful', userId: user.id, name: user.name, email: user.email, role: user.role }
}

// AuthController#register -> UserService#register
function register(body) {
  const d = load()
  const errors = {}
  if (!body.name || !String(body.name).trim()) errors.name = 'Name is required'
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) errors.email = 'Enter a valid email address'
  if (!body.password || String(body.password).length < 6) errors.password = 'Password must be at least 6 characters'
  if (Object.keys(errors).length) fail(400, 'Validation failed', errors)

  const email = String(body.email).trim().toLowerCase()
  if (d.users.some((u) => u.email === email)) fail(400, 'An account with this email already exists')

  const user = {
    id: d.nextIds.user++,
    name: String(body.name).trim(),
    email,
    password: body.password,
    phone: body.phone || null,
    role: 'USER',
  }
  d.users.push(user)
  persist()
  return { message: 'Registration successful', userId: user.id, name: user.name, email: user.email, role: user.role }
}

// AuthController#getProfile
function getProfile(id) {
  const d = load()
  const user = d.users.find((u) => u.id === Number(id))
  if (!user) fail(404, `User not found with id ${id}`)
  return toUserResponse(user)
}

// AuthController#updateProfile
function updateProfile(id, body) {
  const d = load()
  const user = d.users.find((u) => u.id === Number(id))
  if (!user) fail(404, `User not found with id ${id}`)
  const email = String(body.email || '').trim().toLowerCase()
  if (email !== user.email && d.users.some((u) => u.email === email)) {
    fail(400, 'An account with this email already exists')
  }
  user.name = String(body.name || user.name).trim()
  user.email = email || user.email
  user.phone = body.phone || user.phone
  if (body.password && String(body.password).trim()) user.password = body.password
  persist()
  return toUserResponse(user)
}

// TrainController#getAllTrains
function getAllTrains() {
  return load().trains.map(toTrainResponse)
}

// TrainController#getTrainById
function getTrainById(id) {
  const train = load().trains.find((t) => t.id === Number(id))
  if (!train) fail(404, `Train not found with id ${id}`)
  return toTrainResponse(train)
}

// TrainController#searchTrains -> TrainRepository#searchTrains (case-insensitive LIKE)
function searchTrains(params) {
  const source = String(params.source || '').toLowerCase()
  const destination = String(params.destination || '').toLowerCase()
  return load()
    .trains.filter(
      (t) => t.source.toLowerCase().includes(source) && t.destination.toLowerCase().includes(destination),
    )
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
    .map(toTrainResponse)
}

// TrainController#stations
function stations() {
  const d = load()
  return {
    sources: [...new Set(d.trains.map((t) => t.source))].sort(),
    destinations: [...new Set(d.trains.map((t) => t.destination))].sort(),
  }
}

// TrainController#createTrain -> TrainService#createTrain
function createTrain(body) {
  const d = load()
  const number = String(body.trainNumber || '').trim()
  if (d.trains.some((t) => t.trainNumber === number)) {
    fail(400, `A train with number ${number} already exists`)
  }
  const train = {
    id: d.nextIds.train++,
    trainNumber: number,
    trainName: String(body.trainName || '').trim(),
    source: String(body.source || '').trim(),
    destination: String(body.destination || '').trim(),
    departureTime: body.departureTime,
    arrivalTime: body.arrivalTime,
    distance: Number(body.distance) || 0,
    trainType: body.trainType || 'Express',
    availableSeats: Number(body.availableSeats) || 0,
    fareSleeper: Number(body.fareSleeper) || 0,
    fareAc3: Number(body.fareAc3) || 0,
    fareAc2: Number(body.fareAc2) || 0,
    fareAc1: Number(body.fareAc1) || 0,
    fareCc: Number(body.fareCc) || 0,
  }
  d.trains.push(train)
  persist()
  return toTrainResponse(train)
}

// TrainController#updateTrain
function updateTrain(id, body) {
  const d = load()
  const train = d.trains.find((t) => t.id === Number(id))
  if (!train) fail(404, `Train not found with id ${id}`)
  const number = String(body.trainNumber || '').trim()
  if (d.trains.some((t) => t.trainNumber === number && t.id !== train.id)) {
    fail(400, `A train with number ${number} already exists`)
  }
  Object.assign(train, {
    trainNumber: number,
    trainName: String(body.trainName || '').trim(),
    source: String(body.source || '').trim(),
    destination: String(body.destination || '').trim(),
    departureTime: body.departureTime,
    arrivalTime: body.arrivalTime,
    distance: Number(body.distance) || 0,
    trainType: body.trainType || train.trainType,
    availableSeats: Number(body.availableSeats) || 0,
    fareSleeper: Number(body.fareSleeper) || 0,
    fareAc3: Number(body.fareAc3) || 0,
    fareAc2: Number(body.fareAc2) || 0,
    fareAc1: Number(body.fareAc1) || 0,
    fareCc: Number(body.fareCc) || 0,
  })
  persist()
  return toTrainResponse(train)
}

// TrainController#deleteTrain
function deleteTrain(id) {
  const d = load()
  const idx = d.trains.findIndex((t) => t.id === Number(id))
  if (idx === -1) fail(404, `Train not found with id ${id}`)
  if (d.bookings.some((b) => b.trainId === Number(id))) {
    fail(400, 'This train has bookings and cannot be deleted')
  }
  d.trains.splice(idx, 1)
  persist()
  return { message: 'Train deleted successfully' }
}

// BookingController#createBooking -> BookingService#createBooking
function createBooking(body) {
  const d = load()
  const user = d.users.find((u) => u.id === Number(body.userId))
  if (!user) fail(404, `User not found with id ${body.userId}`)
  const train = d.trains.find((t) => t.id === Number(body.trainId))
  if (!train) fail(404, `Train not found with id ${body.trainId}`)

  const classType = String(body.classType || '').trim().toUpperCase()
  if (!FARE_FIELD[classType]) fail(400, `Invalid class type: ${body.classType}`)

  const pax = body.passengers || []
  if (!pax.length) fail(400, 'At least one passenger is required')
  if (train.availableSeats < pax.length) {
    fail(400, `Only ${train.availableSeats} seat(s) available on this train`)
  }

  const fare = Number(train[FARE_FIELD[classType]]) || 0
  const total = fare * pax.length
  const prefix = SEAT_PREFIX[classType]

  const booking = {
    id: d.nextIds.booking++,
    pnr: generatePnr(d),
    userId: user.id,
    trainId: train.id,
    journeyDate: body.journeyDate,
    classType,
    totalPassengers: pax.length,
    totalAmount: total,
    bookingStatus: 'CONFIRMED',
    bookingDate: nowIso(),
    passengers: pax.map((p, i) => ({
      id: d.nextIds.passenger++,
      name: String(p.name || '').trim(),
      age: Number(p.age),
      gender: p.gender,
      seatPreference: p.seatPreference,
      seatNumber: `${prefix}${i + 1}`,
    })),
    payment: null,
  }

  train.availableSeats -= pax.length
  d.bookings.push(booking)
  persist()
  return toBookingResponse(booking)
}

// BookingController#myBookings
function myBookings(params) {
  const d = load()
  const userId = Number(params.userId)
  if (!d.users.some((u) => u.id === userId)) fail(404, `User not found with id ${params.userId}`)
  return d.bookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => String(b.bookingDate).localeCompare(String(a.bookingDate)))
    .map(toBookingResponse)
}

// BookingController#getBooking
function getBooking(id) {
  const b = load().bookings.find((x) => x.id === Number(id))
  if (!b) fail(404, `Booking not found with id ${id}`)
  return toBookingResponse(b)
}

// BookingController#getByPnr
function getBookingByPnr(pnr) {
  const b = load().bookings.find((x) => x.pnr === pnr)
  if (!b) fail(404, `No booking found with PNR ${pnr}`)
  return toBookingResponse(b)
}

// BookingController#cancelBooking -> BookingService#cancelBooking
function cancelBooking(id) {
  const d = load()
  const booking = d.bookings.find((b) => b.id === Number(id))
  if (!booking) fail(404, `Booking not found with id ${id}`)
  if (booking.bookingStatus === 'CANCELLED') fail(400, 'This booking is already cancelled')

  booking.bookingStatus = 'CANCELLED'
  const train = d.trains.find((t) => t.id === booking.trainId)
  if (train) train.availableSeats += booking.totalPassengers
  persist()
  return toBookingResponse(booking)
}

// PaymentController#createPayment -> PaymentService#createPayment
function createPayment(body) {
  const d = load()
  const booking = d.bookings.find((b) => b.id === Number(body.bookingId))
  if (!booking) fail(404, `Booking not found with id ${body.bookingId}`)
  if (booking.payment) fail(400, 'A payment already exists for this booking')

  const payment = {
    id: d.nextIds.payment++,
    bookingId: booking.id,
    paymentId: `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`,
    amount: booking.totalAmount,
    paymentMethod: body.paymentMethod || 'UPI',
    paymentStatus: 'SUCCESS',
    paymentDate: nowIso(),
  }
  booking.payment = payment
  persist()
  return toPaymentResponse(payment)
}

// PaymentController#getPayment
function getPayment(bookingId) {
  const b = load().bookings.find((x) => x.id === Number(bookingId))
  if (!b) fail(404, `Booking not found with id ${bookingId}`)
  if (!b.payment) fail(404, `No payment found for booking ${bookingId}`)
  return toPaymentResponse(b.payment)
}

// AdminController#dashboard -> BookingService#getDashboardStats
function dashboard() {
  const d = load()
  const confirmed = d.bookings.filter((b) => b.bookingStatus === 'CONFIRMED')
  return {
    totalUsers: d.users.length,
    totalTrains: d.trains.length,
    totalBookings: d.bookings.length,
    confirmedBookings: confirmed.length,
    cancelledBookings: d.bookings.filter((b) => b.bookingStatus === 'CANCELLED').length,
    totalRevenue: confirmed.reduce((sum, b) => sum + Number(b.totalAmount), 0),
  }
}

// AdminController#getAllUsers
function getAllUsers() {
  return load().users.map(toUserResponse)
}

// AdminController#deleteUser
function deleteUser(id) {
  const d = load()
  const idx = d.users.findIndex((u) => u.id === Number(id))
  if (idx === -1) fail(404, `User not found with id ${id}`)
  if (d.users[idx].role === 'ADMIN') fail(400, 'The admin account cannot be deleted')
  if (d.bookings.some((b) => b.userId === Number(id))) {
    fail(400, 'This user has bookings and cannot be deleted')
  }
  d.users.splice(idx, 1)
  persist()
  return { message: 'User deleted successfully' }
}

// AdminController#getAllBookings
function getAllBookings() {
  return load()
    .bookings.slice()
    .sort((a, b) => String(b.bookingDate).localeCompare(String(a.bookingDate)))
    .map(toBookingResponse)
}

/* ------------------------------------------------------------------ router ---
 * [method, pathRegex, handler] - the @RequestMapping table.
 */
const ROUTES = [
  ['POST', /^\/auth\/login$/, (m, b) => login(b)],
  ['POST', /^\/auth\/register$/, (m, b) => register(b)],
  ['GET', /^\/auth\/profile\/(\d+)$/, (m) => getProfile(m[1])],
  ['PUT', /^\/auth\/profile\/(\d+)$/, (m, b) => updateProfile(m[1], b)],

  ['GET', /^\/trains$/, () => getAllTrains()],
  ['GET', /^\/trains\/search$/, (m, b, p) => searchTrains(p)],
  ['GET', /^\/trains\/stations$/, () => stations()],
  ['GET', /^\/trains\/(\d+)$/, (m) => getTrainById(m[1])],
  ['POST', /^\/trains$/, (m, b) => createTrain(b)],
  ['PUT', /^\/trains\/(\d+)$/, (m, b) => updateTrain(m[1], b)],
  ['DELETE', /^\/trains\/(\d+)$/, (m) => deleteTrain(m[1])],

  ['POST', /^\/bookings$/, (m, b) => createBooking(b)],
  ['GET', /^\/bookings\/my$/, (m, b, p) => myBookings(p)],
  ['GET', /^\/bookings\/pnr\/([A-Za-z0-9]+)$/, (m) => getBookingByPnr(m[1])],
  ['GET', /^\/bookings\/(\d+)$/, (m) => getBooking(m[1])],
  ['PUT', /^\/bookings\/(\d+)\/cancel$/, (m) => cancelBooking(m[1])],

  ['POST', /^\/payments$/, (m, b) => createPayment(b)],
  ['GET', /^\/payments\/(\d+)$/, (m) => getPayment(m[1])],

  ['GET', /^\/admin\/dashboard$/, () => dashboard()],
  ['GET', /^\/admin\/users$/, () => getAllUsers()],
  ['DELETE', /^\/admin\/users\/(\d+)$/, (m) => deleteUser(m[1])],
  ['GET', /^\/admin\/bookings$/, () => getAllBookings()],
]

/**
 * Drop-in replacement for an axios instance.
 * Returns `{ data }` on success and rejects with an Error carrying `.message`,
 * exactly like the axios interceptors in api.http.js.
 */
export async function request(method, url, { params, data } = {}) {
  // Simulate a little network latency so loading states are visible.
  await new Promise((r) => setTimeout(r, 120))

  const path = String(url).replace(/^\/api/, '').split('?')[0]
  const body = typeof data === 'string' ? JSON.parse(data) : data || {}

  for (const [m, re, handler] of ROUTES) {
    if (m !== method.toUpperCase()) continue
    const match = path.match(re)
    if (!match) continue
    try {
      return { data: handler(match, body, params || {}) }
    } catch (err) {
      if (err instanceof ApiError) {
        const e = new Error(err.message)
        e.response = { status: err.status, data: { message: err.message, errors: err.errors, status: err.status } }
        throw e
      }
      throw err
    }
  }

  const e = new Error(`No mock route for ${method} ${path}`)
  e.response = { status: 404, data: { message: e.message, status: 404 } }
  throw e
}

export default { request }
