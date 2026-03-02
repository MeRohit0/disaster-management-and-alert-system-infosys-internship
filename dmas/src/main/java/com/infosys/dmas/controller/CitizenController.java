package com.infosys.dmas.controller;

import com.infosys.dmas.model.User;
import com.infosys.dmas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/citizen")
@CrossOrigin(origins = "http://localhost:5173")
public class CitizenController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/status")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> getCitizenDashboard(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // In a real scenario, we would check the 'disasters' table
        // against the user's location here.
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("name", user.getName());
        dashboardData.put("location", user.getLocation());
        dashboardData.put("isSafe", true); // Default for Milestone 1 FE
        dashboardData.put("activeAlerts", 0);

        return ResponseEntity.ok(dashboardData);
    }
}
