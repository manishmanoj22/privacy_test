package com.manish.privacy.privacy_backend.controller;


import com.manish.privacy.privacy_backend.entity.LoginData;

import com.manish.privacy.privacy_backend.repository.LoginDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")  // Allow React frontend to call backend
@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private LoginDataRepository loginDataRepository;
    @PostMapping
    public ResponseEntity<?> saveMessage(@RequestBody LoginData message) {
        // Check if email already exists
        if (loginDataRepository.existsByEmail(message.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered.");
        }
        return ResponseEntity.ok(loginDataRepository.save(message));
    }


    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody LoginData loginData) {
        boolean exists = loginDataRepository.existsByEmailAndPassword(loginData.getEmail(), loginData.getPassword());

        if (exists) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}


