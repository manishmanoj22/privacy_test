package com.manish.privacy.privacy_backend.controller;


import com.manish.privacy.privacy_backend.entity.LoginData;

import com.manish.privacy.privacy_backend.repository.LoginDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")  // Allow React frontend to call backend
@RestController
@RequestMapping("/api/login")


public class LoginController {

    @Autowired
private LoginDataRepository loginDataRepository;

    @PostMapping
    public LoginData saveMessage(@RequestBody LoginData message) {
        return loginDataRepository.save(message);
    }
}


