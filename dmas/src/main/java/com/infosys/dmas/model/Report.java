package com.infosys.dmas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String location; 

    @Column(nullable = false)
    private String severity;

    @Column(nullable = false)
    private LocalDateTime timestamp; // Changed to LocalDateTime for better logic
    
    @Column(nullable = false)
    private String status; // e.g., "PENDING", "RESOLVED", "DISPATCHED"

    // Default constructor (Required by JPA)
    public Report() {}

    // Parameterized constructor (Fixed the missing parameter from your snippet)
    public Report(String type, String location, String severity, String status) {
        this.type = type;
        this.location = location;
        this.severity = severity;
        this.status = status;
        this.timestamp = LocalDateTime.now(); // Automatically sets the time when report is created
    }

    // --- GETTERS & SETTERS (Do not skip these!) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}