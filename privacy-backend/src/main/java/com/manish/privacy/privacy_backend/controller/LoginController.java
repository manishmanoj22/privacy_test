package com.manish.privacy.privacy_backend.controller;

import com.manish.privacy.privacy_backend.config.JwtUtil;
import com.manish.privacy.privacy_backend.entity.LoginData;
import com.manish.privacy.privacy_backend.repository.LoginDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;

@CrossOrigin(origins = "*", allowCredentials = "true")
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

            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // Use HTTPS in production
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 1 day

            response.addCookie(cookie);
            return ResponseEntity.ok("Login successful");
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
