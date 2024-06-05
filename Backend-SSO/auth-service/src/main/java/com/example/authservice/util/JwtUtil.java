package com.example.authservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private String SECRET_KEY = "4Kap5t6pKRXgQp848BPbnaDKjU1SyrWFTUoVcNzB4Mk=";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token, SECRET_KEY);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, String secretKey) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseClaimsJws(token);

        return claimsJws.getBody();
    }

    private Boolean isTokenExpired(String token, Key key) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Generate key from secret key
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return createToken(claims, userDetails.getUsername(), key);
    }

    private String createToken(Map<String, Object> claims, String subject, Key key) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        // Generate key from secret key
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token, key));
    }
}
