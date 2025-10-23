package com.service.llm_microservice.service;

import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtService {
    private final String SECRET_KEY = "MjIFucwsDtXtBrSlMXNk89kjqh1EBEWX0QOiij8zhmDTYdZecK"; // Todo: Move to env variable!
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
