package com.infosys.dmas.controller;

import com.infosys.dmas.model.User;
import com.infosys.dmas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/responder")
@CrossOrigin(origins = "http://localhost:5173")
public class ResponderController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('RESPONDER')")
    public User getResponderStats(Authentication authentication) {
        // Get the logged-in responder's details
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Responder not found"));
    }
}