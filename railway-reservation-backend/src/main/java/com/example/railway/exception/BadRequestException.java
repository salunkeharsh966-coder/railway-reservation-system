package com.example.railway.exception;

/** Thrown when a request is invalid or conflicts with existing data. Mapped to HTTP 400. */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
