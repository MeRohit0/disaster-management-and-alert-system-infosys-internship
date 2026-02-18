package com.infosys.dmas.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "alerts")
public class Alert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String disaster_id;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false, unique = true)
    private int createdBy;

    @Column(name = "phone_number")
    private LocalDateTime phoneNumber;

    @Column(nullable = false)
    private String role; // Roles: admin, responder, citizen

    @Column(nullable = false)
    private String location; // To send alerts relevant to their area

}
