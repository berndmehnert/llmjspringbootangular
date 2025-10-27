package com.service.llm_microservice.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.service.llm_microservice.service.JwtService;

@RestController
public class JwtController {

    @Autowired
    private JwtService jwtService;

    // Renaming for clarity and changing the implementation
    @PostMapping("/api/auth/login") // NEW PATH
    public ResponseEntity<?> login() {
        String sessionId = UUID.randomUUID().toString();
        String token = jwtService.generateToken(sessionId);

        // Build the secure, HttpOnly cookie
        ResponseCookie cookie = ResponseCookie.from("chat_token", token)
                .httpOnly(true)    // Crucial: Prevents JavaScript access
                .secure(true)      // Crucial: Sent only over HTTPS
                .path("/")         // The cookie is available for all paths
                .maxAge(60 * 60)   // 1 hour expiration, same as JWT
                .sameSite("Strict") // Helps prevent CSRF attacks
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("{\"status\": \"session_started\"}");
    }

    @PostMapping("/api/auth/logout") // NEW ENDPOINT
    public ResponseEntity<?> logout() {
        // Build a cookie that instantly expires to clear it from the browser
        ResponseCookie cookie = ResponseCookie.from("chat_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // Set max age to 0 to delete
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("{\"status\": \"logged_out\"}");
    }

    // NEW lightweight endpoint for the client to verify session on startup
    @GetMapping("/api/auth/verify")
    public ResponseEntity<?> verifyAuth() {
        // This endpoint is protected by our filter. If the request reaches here,
        // it means the cookie was valid. We just need to return a 200 OK.
        return ResponseEntity.ok().body("{\"status\": \"authenticated\"}");
    }

}