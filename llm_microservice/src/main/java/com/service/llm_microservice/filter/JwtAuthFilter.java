package com.service.llm_microservice.filter;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import com.service.llm_microservice.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Try to find the 'chat_token' cookie
        Cookie jwtCookie = WebUtils.getCookie(request, "chat_token");

        if (jwtCookie == null) {
            // If no cookie, continue the filter chain without authenticating
            filterChain.doFilter(request, response);
            return;
        }

        String token = jwtCookie.getValue();
        
        // Use existing JwtService to validate the token
        if (jwtService.validateToken(token)) {
            String sessionId = jwtService.extractSessionId(token);
            
            UserDetails userDetails = new User(sessionId, "", Collections.emptyList());

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}