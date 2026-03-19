package com.example.bootcamp.security;

import com.example.bootcamp.utill.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtill;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                String email = jwtUtill.extractEmail(token);

                // เพิ่มตัวอย่างการตั้งค่า Context ใน JwtFilter (ภายใน try-catch)
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    String role = jwtUtill.extractRole(token);
                    java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role));
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    request.setAttribute("email", email);
                }

            } catch (Exception error) {
                // If token is invalid (e.g. expired), we don't set the security context.
                // We let the request continue to the filter chain. 
                // Spring Security will then decide if the path is permitted or not.
                System.out.println("JWT Filter Error: " + error.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}