package com.infosys.dmas.controller;

import com.infosys.dmas.dto.RescueReportDTO;
import com.infosys.dmas.model.RescueReport;
import com.infosys.dmas.repository.HelpRequestRepository;
import com.infosys.dmas.repository.RescueReportRepository;
import com.infosys.dmas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173") // Ensure this matches your Vite/React port
public class RescueReportController {

    @Autowired
    private RescueReportRepository rescueReportRepository;

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Get the progress timeline for a specific request
    @GetMapping("/timeline/{requestId}")
    public ResponseEntity<List<RescueReport>> getTimeline(@PathVariable Long requestId) {
        return ResponseEntity.ok(rescueReportRepository.findByHelpRequestIdOrderByTimestampDesc(requestId));
    }

    // 2. Responder submits a new progress update
    @PostMapping("/add")
    public ResponseEntity<?> addProgressUpdate(@RequestBody RescueReportDTO dto) {
        // 1. Fetch the HelpRequest entity
        var helpRequest = helpRequestRepository.findById(dto.getHelpRequestId())
                .orElseThrow(() -> new RuntimeException("Help Request ID " + dto.getHelpRequestId() + " not found"));

        // 2. Fetch the Responder (User) entity
        var responder = userRepository.findById(dto.getResponderId())
                .orElseThrow(() -> new RuntimeException("Responder ID " + dto.getResponderId() + " not found"));

        // 3. Create and map the Report entity
        RescueReport report = new RescueReport();
        report.setHelpRequest(helpRequest); // This fixes the Hibernate null error
        report.setResponder(responder);
        report.setCurrentStatus(dto.getCurrentStatus());
        report.setUpdateNote(dto.getUpdateNote());
        report.setTimestamp(java.time.LocalDateTime.now());

        // 4. Save and return
        RescueReport savedReport = rescueReportRepository.save(report);
        return ResponseEntity.ok(savedReport);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')") // Only Admins should see the full list
    public ResponseEntity<List<RescueReport>> getAllReports() {
        return ResponseEntity.ok(rescueReportRepository.findAll());
    }
}