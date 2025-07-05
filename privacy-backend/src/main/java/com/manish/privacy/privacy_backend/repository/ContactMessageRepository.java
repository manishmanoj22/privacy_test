package com.manish.privacy.privacy_backend.repository;

import com.manish.privacy.privacy_backend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}