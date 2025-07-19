package com.manish.privacy.privacy_backend.repository;

import com.manish.privacy.privacy_backend.entity.LoginData;
import org.springframework.data.jpa.repository.JpaRepository;


public interface LoginDataRepository extends JpaRepository<LoginData, Long> {
    boolean existsByEmail(String email);
    boolean existsByEmailAndPassword(String email, String password);
}