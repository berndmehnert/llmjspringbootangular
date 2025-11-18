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

    @PostMapping("/api/auth/login") 
    public ResponseEntity<?> login() {
        String sessionId = UUID.randomUUID().toString();
        String token = jwtService.generateToken(sessionId);

        ResponseCookie cookie = ResponseCookie.from("chat_token", token)
                .httpOnly(true)  
                .secure(true)    
                .path("/")       
                .maxAge(60 * 60) 
                .sameSite("Strict") 
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("{\"status\": \"session_started\"}");
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("chat_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) 
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("{\"status\": \"logged_out\"}");
    }

    @GetMapping("/api/auth/verify")
    public ResponseEntity<?> verifyAuth() {
        return ResponseEntity.ok().body("{\"status\": \"authenticated\"}");
    }

}