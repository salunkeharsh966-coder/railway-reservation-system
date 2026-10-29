# 🚆 RailYatra — Railway Reservation and Train Management System

A complete full-stack railway reservation system built as an academic project. It demonstrates a
real end-to-end flow: a **React** single-page frontend talking to a **Spring Boot REST API** backed
by **MySQL/MariaDB** through **JPA/Hibernate**.

> **Branding note:** this project uses its own "RailYatra" branding. It is IRCTC-*inspired* in
> functionality only and copies no IRCTC branding, logos or assets.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend markup & styling | HTML5, CSS3, Bootstrap 5 |
| Frontend framework | React 18 (Vite) |
| Language (frontend) | JavaScript ES6+ |
| Backend language | Java 17 |
| Backend framework | Spring Boot 3.2 (Web, Data JPA, Validation) |
| Database | MySQL 8 / MariaDB 10.11 |
| Database language | SQL |
| API style | REST (JSON) |
| ORM | Hibernate / Spring Data JPA |
| API testing | Postman (collection described below) |
| Version control | Git + GitHub |
| Deployment | Railway (backend + MySQL), static host for frontend |

---

## 2. Project Structure

```
railway-reservation-system/
├── railway-reservation-backend/        # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/railway/
│       │   ├── RailwayReservationApplication.java
│       │   ├── config/          WebConfig.java (CORS)
│       │   ├── controller/      Auth, Train, Booking, Passenger, Payment, Admin
│       │   ├── dto/             Request/response objects
│       │   ├── entity/          User, Train, Booking, Passenger, Payment + enums
│       │   ├── exception/       GlobalExceptionHandler, custom exceptions
│       │   ├── repository/      Spring Data JPA repositories
│       │   └── service/         Business logic (@Transactional)
│       └── resources/application.properties
├── railway-reservation-frontend/       # React + Vite SPA
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/   Navbar, Footer, TrainCard, ProtectedRoute
│       ├── context/      AuthContext.jsx
│       ├── pages/        Home, Login, Register, SearchTrain, TrainDetails,
│       │                 PassengerDetails, BookingConfirmation, MyBookings,
│       │                 Ticket, Profile, AdminDashboard, ManageTrains,
│       │                 ManageBookings
│       ├── services/     api.js (axios instance)
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── database/
│   ├── schema.sql        # Tables, keys, indexes, foreign keys
│   └── seed.sql          # Idempotent demo data
├── demo-static/            # Browser-only demo (no Java/MySQL needed)
│   ├── src/services/mockApi.js    # In-browser mock of the REST API
│   ├── src/services/api.js        # Swap point (was axios)
│   └── README.md                  # What was changed and why
├── Procfile              # Railway process definition
├── railway.json          # Railway build/deploy config
├── Dockerfile            # Optional container build
└── README.md
```

---

## 2.1 `demo-static/` — browser-only demo

A hosted, clickable version of this project that needs **no Java, no Maven and no
MySQL**. It is the same React app with exactly one layer replaced: the HTTP
client. `src/services/mockApi.js` mirrors the Spring Boot endpoints, DTO field
names, status codes and error messages, and stores data in `localStorage`.

```bash
cd demo-static
npm install
npm run dev      # http://localhost:5174
```

Demo logins are the same as section 5, and both are one-click buttons on the
login page. See `demo-static/README.md` for what was changed and the known
limitations of the demo. The full-stack project in this folder is unaffected.

---

## 3. Prerequisites

| Tool | Version |
|---|---|
| JDK | 17 or newer |
| Maven | 3.8+ |
| Node.js | 18+ (20 recommended) |
| MySQL | 8.x **or** MariaDB 10.5+ |

---

## 4. Setup & Run (local)

### 4.1 Create the database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

This creates the `railway_reservation` database, all five tables, and loads demo data.

### 4.2 Configure the backend

The defaults in `railway-reservation-backend/src/main/resources/application.properties` assume
`root` / `root` on `localhost:3306`. Override with environment variables if yours differ:

```bash
export DB_URL="jdbc:mysql://localhost:3306/railway_reservation?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export SERVER_PORT=8080
```

### 4.3 Start the backend

```bash
cd railway-reservation-backend
mvn spring-boot:run
# or build a jar and run it:
mvn clean package -DskipTests
java -jar target/railway-reservation-backend-1.0.0.jar
```

The API starts on **http://localhost:8080**.

### 4.4 Start the frontend

```bash
cd railway-reservation-frontend
npm install
npm run dev
```

The app opens on **http://localhost:5173**. The Vite dev server proxies `/api` to the backend, so
no CORS configuration is needed in development.

---

## 5. Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@railway.com` | `admin123` |
| User | `rahul@example.com` | `rahul123` |
| User | `priya@example.com` | `priya123` |

> Passwords are stored in plain text for this academic build. See *Known Limitations*.

---

## 6. REST API Reference

| Module | Method & Endpoint | Description |
|---|---|---|
| Auth | `POST /api/auth/register` | Register a new user |
| Auth | `POST /api/auth/login` | Log in |
| Auth | `GET /api/auth/profile/{id}` | Get profile |
| Auth | `PUT /api/auth/profile/{id}` | Update profile |
| Trains | `GET /api/trains` | List all trains |
| Trains | `GET /api/trains/{id}` | Train details |
| Trains | `GET /api/trains/search?source=..&destination=..` | Search trains |
| Trains | `GET /api/trains/stations` | Distinct source/destination lists |
| Trains | `POST /api/trains` | Add train (admin) |
| Trains | `PUT /api/trains/{id}` | Update train (admin) |
| Trains | `DELETE /api/trains/{id}` | Delete train (admin) |
| Booking | `POST /api/bookings` | Create a booking (generates PNR) |
| Booking | `GET /api/bookings/my?userId=..` | A user's bookings |
| Booking | `GET /api/bookings/{id}` | Booking / ticket details |
| Booking | `GET /api/bookings/pnr/{pnr}` | Look up by PNR |
| Booking | `PUT /api/bookings/{id}/cancel` | Cancel a booking |
| Passenger | `GET /api/passengers/{bookingId}` | Passengers of a booking |
| Payment | `POST /api/payments` | Demo payment |
| Payment | `GET /api/payments/{bookingId}` | Payment of a booking |
| Admin | `GET /api/admin/dashboard` | Dashboard statistics |
| Admin | `GET /api/admin/users` | List users |
| Admin | `DELETE /api/admin/users/{id}` | Delete a user |
| Admin | `GET /api/admin/bookings` | All bookings |

### Sample requests

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","phone":"9800000009"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@example.com","password":"rahul123"}'

# Search trains
curl "http://localhost:8080/api/trains/search?source=Mumbai&destination=Pune"

# Create a booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"userId":2,"trainId":1,"journeyDate":"2026-12-01","classType":"SLEEPER",
       "passengers":[{"name":"Rahul Sharma","age":34,"gender":"Male","seatPreference":"Lower"}]}'

# Cancel a booking
curl -X PUT http://localhost:8080/api/bookings/1/cancel

# Admin dashboard
curl http://localhost:8080/api/admin/dashboard
```

---

## 7. Database Schema

| Table | Key columns |
|---|---|
| `users` | id, name, email (unique), password, phone, role, created_at |
| `trains` | id, train_number (unique), train_name, source, destination, departure_time, arrival_time, distance, train_type, available_seats, fare_sleeper, fare_ac3, fare_ac2, fare_ac1, fare_cc |
| `bookings` | id, pnr (unique), user_id → users, train_id → trains, journey_date, class_type, total_passengers, total_amount, booking_status, booking_date |
| `passengers` | id, booking_id → bookings, name, age, gender, seat_preference, seat_number |
| `payments` | id, booking_id → bookings (unique), payment_id (unique), amount, payment_method, payment_status, payment_date |

**Relationships**

- `USER → BOOKING` — one user has many bookings
- `BOOKING → PASSENGER` — one booking has many passengers
- `TRAIN → BOOKING` — one train has many bookings
- `BOOKING → PAYMENT` — one booking has one payment

---

## 8. User Flow

```
Home → Login / Register → Search Train → Search Results → Train Details
     → Select Class → Passenger Details → Booking Review → Demo Payment
     → Booking Success → PNR Generated → View Ticket → Print / Download
     → Cancel Ticket
```

---

## 9. Deployment (Railway)

### 9.1 Backend + database

1. Push the repository to GitHub.
2. On [Railway](https://railway.app), create a **New Project → Deploy from GitHub repo**.
3. Add a **MySQL** plugin to the project. Railway injects `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`,
   `MYSQLUSER` and `MYSQLPASSWORD`.
4. Set the backend service **Root Directory** to `railway-reservation-backend`.
5. Add these environment variables to the backend service:

   ```
   DB_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   DB_USERNAME=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   CORS_ORIGINS=https://your-frontend-domain
   ```

6. Railway detects the Maven project and builds it. The `Procfile` and `railway.json` in the repo
   tell it how to start the jar.
7. Load the schema once against the Railway database (Railway → MySQL → *Connect* → run
   `database/schema.sql` and `database/seed.sql`).

### 9.2 Frontend

Build the static bundle and host it anywhere (Railway static service, Netlify, Vercel, GitHub Pages):

```bash
cd railway-reservation-frontend
export VITE_API_BASE_URL=https://your-backend.up.railway.app/api
npm run build      # output in dist/
```

Set `VITE_API_BASE_URL` to the deployed backend's `/api` URL **before** building, and add the
frontend's origin to the backend's `CORS_ORIGINS`.

### 9.3 Docker (optional)

```bash
docker build -t railyatra-backend ./railway-reservation-backend
docker run -p 8080:8080 -e DB_URL=... -e DB_USERNAME=... -e DB_PASSWORD=... railyatra-backend
```

---

## 10. Testing with Postman

Import the endpoints from section 6 as a collection. Suggested order:

1. `POST /api/auth/register` → 201
2. `POST /api/auth/login` → 200
3. `GET /api/trains/search?source=Mumbai&destination=Pune` → 200 with results
4. `POST /api/bookings` → 201 with a PNR
5. `GET /api/bookings/my?userId=2` → 200
6. `PUT /api/bookings/{id}/cancel` → 200, status becomes `CANCELLED`
7. `GET /api/admin/dashboard` → 200 with statistics

---

## 11. Troubleshooting

| Problem | Fix |
|---|---|
| `Port 8080 was already in use` | Change `server.port` (or `SERVER_PORT`) and update the Vite proxy `target` in `vite.config.js` |
| `Access denied for user 'root'` | Set the correct `DB_USERNAME` / `DB_PASSWORD` |
| `Communications link failure` | Ensure MySQL/MariaDB is running and the port in `DB_URL` is correct |
| CORS error in the browser | Add the frontend origin to `CORS_ORIGINS` |
| `npm run dev` shows a blank page | Confirm the backend is running on the port the Vite proxy targets |

---

## 12. Known Limitations

- **Passwords are stored in plain text.** A production build must hash them (BCrypt) and issue a
  signed JWT instead of returning the user id to the client.
- **Authentication is header-based, not token-based.** The frontend sends `X-User-Id`; the backend
  does not yet enforce it on every route. Role checks are enforced in the UI, not the API.
- **Payments are simulated.** No real gateway is contacted; a payment id is generated locally.
- **Seat allocation is sequential**, not a real coach/berth map.
- **No email/SMS notifications** are sent on booking or cancellation.

---

## 13. Development Phases (as built)

| Phase | Scope | Status |
|---|---|---|
| Phase 1 — Basic | Register, login, add train, view trains, train search | ✅ |
| Phase 2 — Booking | Select train, passenger details, create booking, PNR, My Bookings | ✅ |
| Phase 3 — Advanced | Cancel booking, demo payment, admin dashboard, ticket printing, search/filter, validation | ✅ |

---

## 14. License

Released for academic and educational use.
