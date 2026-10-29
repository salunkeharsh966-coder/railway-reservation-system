# Railway Reservation System

Spring Boot (Java 17) + MySQL backend, React (Vite) + Bootstrap frontend.

## Run locally
**Backend** (needs Java 17, Maven, MySQL running):
```
cd backend
export DB_USER=root DB_PASSWORD=yourpassword
mvn spring-boot:run
```
The DB `railway` is created automatically. On first start it seeds stations (TNA, KYN, LNL, TGN, PUNE), train 11029, and an admin: `admin@rail.com` / `Admin@123` (change it).

**Frontend** (needs Node 18+):
```
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173.

## Payments
With `RAZORPAY_KEY_ID` empty, the backend runs in **dev mode** (fake order, no real payment) so you can test the full flow. For Razorpay test mode set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` on the backend; the frontend then opens Razorpay Checkout and the backend verifies the HMAC signature.

## Deploy
Backend: Render (Docker, root `backend/`) with env vars from `backend/.env.example` + managed MySQL; set `CORS_ORIGIN` to your Vercel URL. Frontend: Vercel (root `frontend/`), set `VITE_API_BASE_URL=https://<backend>/api`. See DEPLOYMENT_CHECKLIST.md in your pack.

## Key design
- Seats are reserved per journey segment: a seat is free for [from,to) if no active reservation overlaps (`fromOrder < to AND toOrder > from`).
- Booking locks the train row (`PESSIMISTIC_WRITE`) so concurrent bookings are serialized.
- Holds expire after 10 min (scheduler every minute). Booking is CONFIRMED only after server-side payment verification; verify is idempotent.
- Cancel releases seats and records a refund (90%) as `REFUND_PENDING`.

## Not done yet / known gaps
Not compiled or run in my environment (no network). Missing vs. the full spec: Razorpay refund API call, admin edit/delete & user/payment/report pages, profile/change-password, flyway migrations (uses `ddl-auto=update`), rate limiting, automated tests, Postman collection, seat-picking UI (seats are auto-allocated).
