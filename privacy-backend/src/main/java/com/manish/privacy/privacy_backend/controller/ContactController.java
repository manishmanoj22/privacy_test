package com.manish.privacy.privacy_backend.controller;

import com.manish.privacy.privacy_backend.entity.ContactMessage;
import com.manish.privacy.privacy_backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")  // Allow React frontend to call backend
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ContactMessage saveMessage(@RequestBody ContactMessage message) {
        return contactMessageRepository.save(message);
    }

    @GetMapping
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }
}