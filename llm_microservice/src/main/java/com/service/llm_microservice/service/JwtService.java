package com.service.llm_microservice.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtService {
    private final String SECRET_KEY;

    JwtService(@Value("${jwt.secret.key}") String secretKey) {
        this.SECRET_KEY = secretKey;
    }

    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    public String extractUsername(String token) {
        return parseToken(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return parseToken(token).getExpiration().before(new Date());
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token) {
        return !isTokenExpired(token) && parseToken(token) != null;
    }

     public String generateToken() {
        return Jwts.builder()
                .setSubject("privateChat")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
}
