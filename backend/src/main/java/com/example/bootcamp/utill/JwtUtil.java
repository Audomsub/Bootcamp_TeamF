package com.example.bootcamp.utill;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private  final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private final int expirationMs = 3600000;

    public String generateToken(String email , String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role" , role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true; // ถ้า Parse ผ่าน แปลว่า Valid
        } catch (Exception error) {
            return false; // ถ้า Error แปลว่า Invalid
        }
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }
}
