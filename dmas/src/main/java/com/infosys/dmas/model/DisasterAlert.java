package com.infosys.dmas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "disaster_alerts")
@Data
public class DisasterAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String identifier;

    // Field for alert.setType() - Categorization (Flood, Cyclone, etc.)
    private String type;

    // Field for alert.setEvent() - Specific event (Heavy Rain, Heatwave)
    private String event;

    private String severity;   // Moderate, Severe, Extreme
    private String urgency;    // Expected, Immediate
    private String certainty;  // Likely, Observed

    @Column(length = 2000)
    private String headline;

    @Column(length = 5000)
    private String description; // The detailed text from the RSS/XML

    @Column(length = 5000)
    private String instruction; // Actionable safety advice

    // Field for alert.setArea() - General location string
    private String area;

    // Field for detailed CAP area description
    @Column(length = 1000)
    private String areaDesc;

    private LocalDateTime sentTime;
    private LocalDateTime expiresAt;

    private boolean isVerified = false;
}