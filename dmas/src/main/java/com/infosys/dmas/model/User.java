package com.infosys.dmas.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user") // Maps this class to the 'user' table in SQL
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;

    @Column(nullable = false)
    private String role; // Roles: admin, responder, citizen

    @Column(nullable = false)
    private String location; // To send alerts relevant to their area

    // --- CONSTRUCTORS ---
    public User() {} // Required by Spring Boot

    public User(String name, String password, String email, String role, String location) {
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = role;
        this.location = location;
    }

    // GETTERS & SETTERS 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getname() { return name; }
    public void setname(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}