package com.infosys.dmas.controller;

import com.infosys.dmas.service.DisasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.dmas.model.DisasterAlert;
import com.infosys.dmas.repository.DisasterAlertRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/disasters")
@CrossOrigin(origins = "http://localhost:5173")
public class DisasterController {

    @Autowired
    private DisasterAlertRepository alertRepository;

    @Autowired
    DisasterService disasterService;

    // 1. Get ALL alerts (for Admin dashboard)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DisasterAlert> getAllAlerts() {
        return alertRepository.findAll();
    }

    // 2. Get only VERIFIED alerts (for Citizen dashboard)
    @GetMapping("/live")
    public List<DisasterAlert> getLiveAlerts() {
        // Only show alerts that the Admin has approved
        return alertRepository.findAll().stream()
                .filter(DisasterAlert::isVerified)
                .toList();
    }

    // 3. Admin: Verify and Update Alert
    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public DisasterAlert verifyAndEditAlert(@PathVariable Long id, @RequestBody DisasterAlert updatedData) {
        DisasterAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));

        // Admin edits
        alert.setType(updatedData.getType());
        alert.setSeverity(updatedData.getSeverity());
        alert.setHeadline(updatedData.getHeadline()); // Allow editing the title
        alert.setInstruction(updatedData.getInstruction()); // Add custom local advice

        // Finalizing
        alert.setVerified(true);

        return alertRepository.save(alert);
    }

    // to check the endpoint manually -for testing purposes remove
    @GetMapping("/test-sync")
    @PreAuthorize("hasRole('ADMIN')")
    public String manualSync() {
        disasterService.syncWithSachet(); // Call the service method directly
        return "Sync triggered! Check console/DB.";
    }
}