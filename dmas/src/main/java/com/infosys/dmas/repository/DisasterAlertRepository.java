package com.infosys.dmas.repository;

import com.infosys.dmas.model.DisasterAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DisasterAlertRepository extends JpaRepository<DisasterAlert, Long> {

    Optional<DisasterAlert> findByIdentifier(String identifier);

    // Filter by Type (e.g., Flood, Cyclone)
    List<DisasterAlert> findByTypeIgnoreCase(String type);

    // Filter by Severity (e.g., Extreme, Severe)
    List<DisasterAlert> findBySeverityIgnoreCase(String severity);

    // Search by Location (e.g., contains "Haryana")
    List<DisasterAlert> findByAreaDescContainingIgnoreCase(String area);

    // For the Admin Dashboard: Get all unverified alerts
    List<DisasterAlert> findByIsVerifiedFalse();
}