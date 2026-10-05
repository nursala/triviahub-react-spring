package com.example.demo.controller;

import tools.jackson.databind.exc.InvalidFormatException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Global exception handler that converts application exceptions into a consistent JSON shape.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles validation errors.
     *
     * @param ex validation exception
     * @param request current HTTP request
     * @return structured JSON response with status 400
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
    }

    /**
     * Handles resource-not-found errors.
     *
     * @param ex missing resource exception
     * @param request current HTTP request
     * @return structured JSON response with status 404
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            NoSuchElementException ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    /**
     * Handles conflict errors such as duplicate titles.
     *
     * @param ex conflict exception
     * @param request current HTTP request
     * @return structured JSON response with status 409
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(
            IllegalStateException ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), request.getRequestURI());
    }

    /**
     * Handles malformed or invalid request bodies.
     * This covers both syntactically broken JSON and validation errors thrown from
     * model setters (e.g. Question.setOptions), since Jackson wraps any exception
     * raised while binding a setter into a JsonMappingException, which Spring then
     * rethrows as HttpMessageNotReadableException. The original validation exception
     * is recovered by walking the full exception cause chain.
     *
     * @param ex malformed request body exception
     * @param request current HTTP request
     * @return structured JSON response with status 400
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleMalformedRequest(
            HttpMessageNotReadableException ex,
            HttpServletRequest request
    ) {
        for (Throwable cause = ex.getCause(); cause != null; cause = cause.getCause()) {
            if (cause instanceof IllegalArgumentException) {
                return build(HttpStatus.BAD_REQUEST, cause.getMessage(), request.getRequestURI());
            }
            if (cause instanceof InvalidFormatException invalidFormat) {
                return build(HttpStatus.BAD_REQUEST,
                        "Invalid value '" + invalidFormat.getValue() + "' for the expected field type.",
                        request.getRequestURI());
            }
        }
        return build(HttpStatus.BAD_REQUEST, "Malformed JSON request body.", request.getRequestURI());
    }

    /**
     * Handles uncaught server-side errors.
     *
     * @param ex unexpected exception
     * @param request current HTTP request
     * @return structured JSON response with status 500
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(
            Exception ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request.getRequestURI());
    }

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message, String path) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", path);
        return ResponseEntity.status(status).body(body);
    }
}