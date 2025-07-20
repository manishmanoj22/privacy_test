package com.manish.privacy.privacy_backend.service;

import com.manish.privacy.privacy_backend.entity.LoginData;
import com.manish.privacy.privacy_backend.repository.LoginDataRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private LoginDataRepository loginDataRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        LoginData user = loginDataRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword()) // hashed password stored in DB
                .authorities(Collections.emptyList()) // or add roles here if applicable
                .build();
    }
}
