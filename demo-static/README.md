# RailYatra — Static Demo (browser only)

This folder is a **static demo** of the Railway Reservation and Train Management
System. It exists because the real project needs Java 17, Maven, Spring Boot and
MySQL running before you can click anything.

Here, everything runs in the browser.

## What was changed

**Exactly one layer — the HTTP client.**

| File | Role |
|---|---|
| `src/services/api.http.js` | The original, real axios client. Kept for reference. |
| `src/services/api.js` | Replaced with a thin wrapper over the mock. |
| `src/services/mockApi.js` | The in-browser mock of the Spring Boot API. |

No page, component, route, style or piece of state management was forked. The
demo is visually and behaviourally the same app.

## What the mock mirrors

`mockApi.js` copies, endpoint by endpoint, from the Java source:

- the exact URL paths and HTTP methods (`@RequestMapping` → the `ROUTES` table)
- the exact JSON field names from every DTO (`BookingResponse`, `TrainResponse`, …)
- the exact business rules and error messages (`GlobalExceptionHandler` → `fail(status, message)`)
- the exact status codes (201 on create, 400 on validation/duplicate, 404 on missing)
- the same side effects (seats decrement on booking, return on cancel)

Data lives in `localStorage` under `railway_demo_db_v1`, seeded from
`database/seed.sql`. Journey dates are regenerated relative to today so the demo
never shows a stale "upcoming" trip.

## Demo logins

| Role | Email | Password |
|---|---|---|
| User | `rahul@example.com` | `rahul123` |
| Admin | `admin@railway.com` | `admin123` |

Both are one-click buttons on the login page.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # static output in dist/
npm run preview  # serve the production build
```

Serve it over `http://`, never `file://` — browsers block `localStorage` on
`file://`, and the demo stores its whole database there.

## Honest limitations

- **There is no server and no database.** All data is synthetic seed data plus
  anything you create; it lives only in your browser and disappears if you clear
  storage. "Reset demo data" restores the original seed.
- **Authentication is not real security.** The real project already returns a
  user id instead of a signed token, and gates admin routes on the client role.
  The demo inherits that. It is a teaching project, not a production system.
- **Payments are simulated.** Nothing is charged.
- **Deleting a train or user that has bookings is blocked** in the demo to avoid
  orphan rows (the real backend would hit a foreign-key error instead).
- A driver reset (browser restart) wipes `localStorage`, which empties the demo
  database back to its seed.

## The real project

See `../railway-reservation-system/` — Spring Boot 3.2 + Spring Data JPA + MySQL,
React + Vite frontend. `README.md` there has the full setup instructions.
