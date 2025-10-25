package com.service.llm_microservice.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.service.llm_microservice.service.JwtService;

@RestController
public class JwtController {

    @Autowired
    private JwtService jwtService;

    @PostMapping("/api/anonymous-token")
    public ResponseEntity<String> generateAnonymousToken() {
        String sessionId = UUID.randomUUID().toString();
        String token = jwtService.generateToken(sessionId);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(
            @RequestHeader("Authorization") String oldToken) {
        String sessionId = jwtService.extractSessionId(oldToken.replace("Bearer ", ""));
        String newToken = jwtService.generateToken(sessionId);

        return ResponseEntity.ok(newToken);
    }
}
