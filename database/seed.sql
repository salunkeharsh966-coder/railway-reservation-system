-- ============================================================
-- Railway Reservation and Train Management System
-- Seed data (idempotent - safe to re-run)
-- ============================================================

USE railway_reservation;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE passengers;
TRUNCATE TABLE bookings;
TRUNCATE TABLE trains;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Users  (demo passwords are plain text for this academic build)
-- ------------------------------------------------------------
INSERT INTO users (id, name, email, password, phone, role) VALUES
    (1, 'Admin User',   'admin@railway.com',  'admin123',  '9800000001', 'ADMIN'),
    (2, 'Rahul Sharma', 'rahul@example.com',  'rahul123',  '9800000002', 'USER'),
    (3, 'Priya Patil',  'priya@example.com',  'priya123',  '9800000003', 'USER');

-- ------------------------------------------------------------
-- Trains
-- ------------------------------------------------------------
INSERT INTO trains
    (id, train_number, train_name, source, destination, departure_time, arrival_time,
     distance, train_type, available_seats, fare_sleeper, fare_ac3, fare_ac2, fare_ac1, fare_cc)
VALUES
    (1, '12123', 'Deccan Express',      'Mumbai',   'Pune',      '06:40', '10:05', 192,  'Express',    120, 245.00,  620.00,  880.00, 1480.00, 410.00),
    (2, '11007', 'Deccan Queen',        'Mumbai',   'Pune',      '17:10', '20:25', 192,  'Superfast',   96, 265.00,  660.00,  940.00, 1560.00, 430.00),
    (3, '12027', 'Shatabdi Express',    'Pune',     'Mumbai',    '06:15', '09:30', 192,  'Superfast',   80, 275.00,  690.00,  980.00, 1620.00, 450.00),
    (4, '12951', 'Rajdhani Express',    'Mumbai',   'Delhi',     '16:35', '08:35', 1384, 'Rajdhani',    72, 780.00, 1980.00, 2760.00, 4620.00, 0.00),
    (5, '12621', 'Tamil Nadu Express',  'Delhi',    'Chennai',   '22:30', '07:40', 2175, 'Superfast',   88, 890.00, 2240.00, 3120.00, 5240.00, 0.00),
    (6, '12009', 'Shatabdi Express',    'Mumbai',   'Ahmedabad', '06:25', '13:05', 493,  'Superfast',   64, 520.00, 1320.00, 1840.00, 3080.00, 860.00),
    (7, '12841', 'Coromandel Express',  'Kolkata',  'Chennai',   '14:50', '17:00', 1662, 'Superfast',   92, 720.00, 1820.00, 2540.00, 4260.00, 0.00),
    (8, '12626', 'Kerala Express',      'Delhi',    'Trivandrum','11:25', '13:15', 3054, 'Superfast',   76, 1120.00, 2820.00, 3940.00, 6620.00, 0.00),
    (9, '12230', 'Lucknow Mail',        'Delhi',    'Lucknow',   '22:00', '06:55', 512,  'Mail',        110, 430.00, 1090.00, 1520.00, 2540.00, 720.00),
    (10,'12002', 'Bhopal Shatabdi',     'Delhi',    'Bhopal',    '06:00', '14:05', 702,  'Superfast',   68, 610.00, 1540.00, 2160.00, 3620.00, 1010.00),
    (11,'12137', 'Punjab Mail',         'Mumbai',   'Amritsar',  '19:35', '05:20', 1926, 'Mail',        84, 830.00, 2090.00, 2910.00, 4880.00, 0.00),
    (12,'12615', 'Grand Trunk Express', 'Chennai',  'Delhi',     '19:15', '06:30', 2175, 'Express',     90, 870.00, 2190.00, 3050.00, 5120.00, 0.00);

-- ------------------------------------------------------------
-- Bookings
-- ------------------------------------------------------------
INSERT INTO bookings
    (id, pnr, user_id, train_id, journey_date, class_type, total_passengers,
     total_amount, booking_status, booking_date)
VALUES
    (1, 'PNR4K7X2M9QA', 2, 1, '2026-11-15', 'SLEEPER', 2, 490.00,  'CONFIRMED', '2026-10-01 10:15:00'),
    (2, 'PNR8B3N5T1WZ', 2, 4, '2026-12-02', 'AC_3',    1, 1980.00, 'CONFIRMED', '2026-10-02 14:40:00'),
    (3, 'PNR6H9J4L2YC', 3, 3, '2026-11-20', 'AC_2',    3, 2940.00, 'CONFIRMED', '2026-10-03 09:05:00'),
    (4, 'PNR2D5F8G3VB', 3, 6, '2026-11-28', 'CHAIR_CAR', 2, 1720.00, 'CANCELLED', '2026-10-04 18:20:00');

-- ------------------------------------------------------------
-- Passengers
-- ------------------------------------------------------------
INSERT INTO passengers (id, booking_id, name, age, gender, seat_preference, seat_number) VALUES
    (1, 1, 'Rahul Sharma', 34, 'Male',   'Lower',  'S1'),
    (2, 1, 'Anita Sharma', 31, 'Female', 'Upper',  'S2'),
    (3, 2, 'Rahul Sharma', 34, 'Male',   'Lower',  'B1'),
    (4, 3, 'Priya Patil',  28, 'Female', 'Lower',  'A1'),
    (5, 3, 'Suresh Patil', 55, 'Male',   'Upper',  'A2'),
    (6, 3, 'Meena Patil',  52, 'Female', 'Middle', 'A3'),
    (7, 4, 'Priya Patil',  28, 'Female', 'Window', 'C1'),
    (8, 4, 'Rohit Patil',  24, 'Male',   'Aisle',  'C2');

-- ------------------------------------------------------------
-- Payments
-- ------------------------------------------------------------
INSERT INTO payments (id, booking_id, payment_id, amount, payment_method, payment_status, payment_date) VALUES
    (1, 1, 'PAY1727776500123', 490.00,  'UPI',           'SUCCESS', '2026-10-01 10:16:00'),
    (2, 2, 'PAY1727870400456', 1980.00, 'Credit Card',   'SUCCESS', '2026-10-02 14:41:00'),
    (3, 3, 'PAY1727946300789', 2940.00, 'Net Banking',   'SUCCESS', '2026-10-03 09:06:00'),
    (4, 4, 'PAY1728056400102', 1720.00, 'Debit Card',    'REFUNDED','2026-10-04 18:21:00');
