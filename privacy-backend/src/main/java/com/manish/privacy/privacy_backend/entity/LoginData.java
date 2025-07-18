package com.manish.privacy.privacy_backend.entity;
import jakarta.persistence.*;

@Entity
public class LoginData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;

    public LoginData() {}

    // Getters

    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }

    // Setters

    public void setEmail(String email) {
        this.email = email;
    }
    public void setPassword(String message) {
        this.password = password;
    }
}
