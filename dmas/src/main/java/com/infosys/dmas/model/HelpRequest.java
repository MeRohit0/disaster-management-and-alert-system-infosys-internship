package com.infosys.dmas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "help_requests")
@Data
public class HelpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The Citizen asking for help (Linked to User table)
    @ManyToOne
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    // The Responder assigned to help (Can be null initially)
    @ManyToOne
    @JoinColumn(name = "responder_id")
    private User assignedResponder;

    private String description;
    private String location; // Detailed address or Zone

    private String type; // This will store MEDICAL, FIRE, ACCIDENT, etc.

    // For map plotting later
    private Double latitude;
    private Double longitude;

    // Status: PENDING, ASSIGNED, RESOLVED, CANCELLED
    private String status = "PENDING";

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    @OneToMany(mappedBy = "helpRequest", cascade = CascadeType.ALL)
    private List<RescueReport> progressReports;
}