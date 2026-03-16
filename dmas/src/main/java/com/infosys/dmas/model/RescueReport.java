package com.infosys.dmas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "rescue_reports")
@Data
public class RescueReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many reports can belong to one HelpRequest
    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    @JsonIgnore
    private HelpRequest helpRequest;

    @ManyToOne
    @JoinColumn(name = "responder_id", nullable = false)
    private User responder;

    @Column(columnDefinition = "TEXT")
    private String updateNote; // What happened in this specific update?

    private String currentStatus; // e.g., EN_ROUTE, ON_SITE, RESOLVED

    private LocalDateTime timestamp = LocalDateTime.now();
}