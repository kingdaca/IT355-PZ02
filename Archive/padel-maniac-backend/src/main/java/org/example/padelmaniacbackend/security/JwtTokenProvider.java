package org.example.padelmaniacbackend.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret; // Uzmi iz application.properties

    private final Long jwtExp = 604800000L; // 7 dana

    private Key getSigningKey() {
        return new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKeySpec key = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key).build();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateToken(String username, String role, Long userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", Collections.singletonList(role))
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExp))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token) {
        try {
            // Proveri da li se token može parsirati i da nije istekao
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public List<String> extractRoles(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object rolesObj = claims.get("roles");

            List<String> roles = new ArrayList<>();

            if (rolesObj instanceof List) {
                List<?> roleList = (List<?>) rolesObj;
                for (Object role : roleList) {
                    if (role != null) {
                        roles.add(role.toString().toUpperCase()); // konvertuj u uppercase
                    }
                }
            }

            // Ako nema rola u tokenu, vrati default
            if (roles.isEmpty()) {
                roles.add("PLAYER");
            }

            return roles;
        } catch (Exception e) {
            List<String> defaultRoles = new ArrayList<>();
            defaultRoles.add("PLAYER");
            return defaultRoles;
        }
    }
    public String extractSingleRole(String token) {
        List<String> roles = extractRoles(token);
        return roles.get(0);
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}