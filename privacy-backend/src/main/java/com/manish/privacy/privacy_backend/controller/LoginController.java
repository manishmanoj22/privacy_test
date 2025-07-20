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
        if (loginDataRepository.existsByEmail(message.getEmail())) {
            return ResponseEntity.status(409).body("Email already registered.");
        }

        message.setPassword(passwordEncoder.encode(message.getPassword()));
        return ResponseEntity.ok(loginDataRepository.save(message));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody LoginData loginData, HttpServletResponse response) {
        Optional<LoginData> userOpt = loginDataRepository.findByEmail(loginData.getEmail());

        if (userOpt.isPresent() && passwordEncoder.matches(loginData.getPassword(), userOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                    loginData.getEmail(), "", java.util.Collections.emptyList()));

            Cookie cookie = new Cookie("jwt", token); // name must match what frontend checks
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // Use HTTPS in production
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 1 day

            response.addCookie(cookie);
            return ResponseEntity.ok("Login successful");
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    try {
                        Claims claims = Jwts.parser()
                                .setSigningKey("your-secret-key") // Match secret from JwtUtil
                                .parseClaimsJws(token)
                                .getBody();

                        String email = claims.getSubject();
                        return ResponseEntity.ok("Authenticated as " + email);
                    } catch (Exception e) {
                        return ResponseEntity.status(401).body("Invalid token");
                    }
                }
            }
        }

        return ResponseEntity.status(401).body("No token found");
    }
}
