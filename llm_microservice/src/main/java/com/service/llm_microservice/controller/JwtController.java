package com.service.llm_microservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.service.llm_microservice.dto.SessionRequestDto;
import com.service.llm_microservice.service.JwtService;

@RestController
public class JwtController {
    @Autowired
    private JwtService jwtService;

    @PostMapping("/api/token")
    public ResponseEntity<String> generateToken(@RequestBody SessionRequestDto sessionRequest) {
        // Generate the token with session ID
        String token = jwtService.generateToken(sessionRequest.getSessionId());
        
        return ResponseEntity.ok(token);
    }
}
