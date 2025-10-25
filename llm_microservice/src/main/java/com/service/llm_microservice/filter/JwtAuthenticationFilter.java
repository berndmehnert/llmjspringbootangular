package com.service.llm_microservice.filter;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.service.llm_microservice.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtService jwtService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        // Skip JWT validation for excluded paths
        String path = request.getRequestURI();
        if (path.equals("/api/anonymous-token")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String token = extractToken(request);
        
        // Debug logging
        System.out.println("Path: " + path);
        System.out.println("Token present: " + (token != null));
        
        if (token != null && jwtService.validateToken(token)) {
            String sessionId = jwtService.extractSessionId(token);
            
            // IMPORTANT: Set authentication in SecurityContext
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(sessionId, null, new ArrayList<>());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            System.out.println("Authentication set for session: " + sessionId);
        } else {
            System.out.println("Token validation failed or token is null");
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        System.out.println("Authorization header: " + bearerToken); // Debug
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        // Check query parameter as fallback (for SSE if needed)
        String queryToken = request.getParameter("token");
        if (queryToken != null) {
            System.out.println("Token from query param: " + queryToken);
            return queryToken;
        }
        
        return null;
    }
}