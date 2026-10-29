-- ============================================================
-- Railway Reservation and Train Management System
-- Database schema (MySQL / MariaDB compatible)
-- ============================================================

CREATE DATABASE IF NOT EXISTS railway_reservation
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE railway_reservation;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- trains
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trains (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    train_number     VARCHAR(10)   NOT NULL,
    train_name       VARCHAR(120)  NOT NULL,
    source           VARCHAR(80)   NOT NULL,
    destination      VARCHAR(80)   NOT NULL,
    departure_time   VARCHAR(10)   NOT NULL,
    arrival_time     VARCHAR(10)   NOT NULL,
    distance         INT           NOT NULL,
    train_type       VARCHAR(40)   NOT NULL,
    available_seats  INT           NOT NULL DEFAULT 0,
    fare_sleeper     DECIMAL(10,2) NOT NULL,
    fare_ac3         DECIMAL(10,2) NOT NULL,
    fare_ac2         DECIMAL(10,2) NOT NULL,
    fare_ac1         DECIMAL(10,2) NOT NULL,
    fare_cc          DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_trains_number (train_number),
    KEY idx_trains_route (source, destination)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- bookings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    pnr               VARCHAR(20)   NOT NULL,
    user_id           BIGINT        NOT NULL,
    train_id          BIGINT        NOT NULL,
    journey_date      DATE          NOT NULL,
    class_type        VARCHAR(20)   NOT NULL,
    total_passengers  INT           NOT NULL,
    total_amount      DECIMAL(10,2) NOT NULL,
    booking_status    VARCHAR(20)   NOT NULL DEFAULT 'CONFIRMED',
    booking_date      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_bookings_pnr (pnr),
    KEY idx_bookings_user (user_id),
    KEY idx_bookings_train (train_id),
    CONSTRAINT fk_bookings_user  FOREIGN KEY (user_id)  REFERENCES users (id),
    CONSTRAINT fk_bookings_train FOREIGN KEY (train_id) REFERENCES trains (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- passengers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS passengers (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    booking_id       BIGINT       NOT NULL,
    name             VARCHAR(100) NOT NULL,
    age              INT          NOT NULL,
    gender           VARCHAR(10)  NOT NULL,
    seat_preference  VARCHAR(20),
    seat_number      VARCHAR(10),
    PRIMARY KEY (id),
    KEY idx_passengers_booking (booking_id),
    CONSTRAINT fk_passengers_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- payments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    booking_id      BIGINT        NOT NULL,
    payment_id      VARCHAR(40)   NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    payment_method  VARCHAR(30)   NOT NULL,
    payment_status  VARCHAR(20)   NOT NULL DEFAULT 'SUCCESS',
    payment_date    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_payments_booking (booking_id),
    UNIQUE KEY uk_payments_payment_id (payment_id),
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
