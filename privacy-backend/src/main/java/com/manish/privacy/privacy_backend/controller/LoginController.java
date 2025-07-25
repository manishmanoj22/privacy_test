package com.manish.privacy.privacy_backend.controller;

import com.manish.privacy.privacy_backend.config.JwtUtil;
import com.manish.privacy.privacy_backend.entity.LoginData;
import com.manish.privacy.privacy_backend.repository.LoginDataRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private LoginDataRepository loginDataRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping
    public ResponseEntity<?> register(@RequestBody LoginData message) {
        System.out.println("[Register] Attempt to register email: " + message.getEmail());

        if (loginDataRepository.existsByEmail(message.getEmail())) {
            System.out.println("[Register] Email already exists: " + message.getEmail());
            return ResponseEntity.status(409).body("Email already registered.");
        }

        message.setPassword(passwordEncoder.encode(message.getPassword()));
        LoginData savedUser = loginDataRepository.save(message);

        System.out.println("[Register] User registered successfully: " + savedUser.getEmail());
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody LoginData loginData, HttpServletResponse response) {
        System.out.println("[Authenticate] Login attempt for email: " + loginData.getEmail());

        Optional<LoginData> userOpt = loginDataRepository.findByEmail(loginData.getEmail());

        if (userOpt.isPresent() && passwordEncoder.matches(loginData.getPassword(), userOpt.get().getPassword())) {
            System.out.println("[Authenticate] Password match for: " + loginData.getEmail());

            String token = jwtUtil.generateToken(
                    new org.springframework.security.core.userdetails.User(
                            loginData.getEmail(), "", java.util.Collections.emptyList()
                    )
            );

            String cookieString = String.format(
                    "jwt=%s; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=%d",
                    token, 24 * 60 * 60
            );
            response.setHeader("Set-Cookie", cookieString);

            System.out.println("[Authenticate] JWT token generated and cookie set.");
            return ResponseEntity.ok("Login successful");
        }

        System.out.println("[Authenticate] Invalid credentials for email: " + loginData.getEmail());
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
        System.out.println("[CheckAuth] Checking JWT in cookies...");

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    System.out.println("[CheckAuth] JWT found: " + token);

                    try {
                        Claims claims = io.jsonwebtoken.Jwts.parser()
                                .setSigningKey(jwtUtil.getSecretKey().getBytes())
                                .parseClaimsJws(token)
                                .getBody();

                        String email = claims.getSubject();
                        System.out.println("[CheckAuth] Token valid for user: " + email);
                        return ResponseEntity.ok("Authenticated as " + email);
                    } catch (Exception e) {
                        System.out.println("[CheckAuth] Invalid token: " + e.getMessage());
                        return ResponseEntity.status(401).body("Invalid token");
                    }
                }
            }
        }

        System.out.println("[CheckAuth] No JWT token found in cookies.");
        return ResponseEntity.status(401).body("No token found");
    }
}
