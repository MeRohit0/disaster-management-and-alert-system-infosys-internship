package com.infosys.dmas.service;

import com.infosys.dmas.dto.HelpRequestDTO;
import com.infosys.dmas.dto.UserDTO;
import com.infosys.dmas.model.HelpRequest;
import com.infosys.dmas.model.RescueReport;
import com.infosys.dmas.model.User;
import com.infosys.dmas.repository.HelpRequestRepository;
import com.infosys.dmas.repository.RescueReportRepository;
import com.infosys.dmas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HelpRequestService {

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RescueReportRepository rescueReportRepository;

    // 1. Create a new request (The SOS)
    public HelpRequest createRequest(HelpRequest request) {
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        return helpRequestRepository.save(request);
    }

    // 2. Get all pending requests for the Admin Dashboard
    public List<HelpRequest> getPendingRequests() {
        return helpRequestRepository.findByStatus("PENDING");
    }

    // 3. Assign a Responder to a Request
    @Transactional
    public HelpRequest assignResponder(Long requestId, Long responderId) {
        HelpRequest request = helpRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User responder = userRepository.findById(responderId)
                .orElseThrow(() -> new RuntimeException("Responder not found"));

        request.setAssignedResponder(responder);
        request.setStatus("ASSIGNED");

        return helpRequestRepository.save(request);
    }

    @Transactional
    public HelpRequest acknowledgeRequest(Long requestId) {
        HelpRequest request = helpRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("ACKNOWLEDGED"); // This tracks that the responder is now acting
        return helpRequestRepository.save(request);
    }

    // 4. Complete a request (When help has arrived)
    @Transactional
    public HelpRequest resolveRequest(Long requestId) {
        HelpRequest request = helpRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("RESOLVED");
        request.setResolvedAt(LocalDateTime.now());

        return helpRequestRepository.save(request);
    }

    // 5. get all available responders (When help has arrived)
    public List<User> suggestResponders(Long requestId) {
        HelpRequest request = helpRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        String zone = request.getLocation(); // e.g., "Sonipat"

        List<User> localResponders = userRepository.findRespondersByLocation(zone);

        // If no one is in that specific zone, suggest all responders
        if (localResponders.isEmpty()) {
            return userRepository.findAllResponders();
        }

        return localResponders;
    }

    // 6. get responder list
    public List<HelpRequest> getRequestsByResponder(Long responderId) {
        return helpRequestRepository.findByAssignedResponderId(responderId);
    }

    @Transactional
    public HelpRequest createSOS(HelpRequestDTO dto) {
        HelpRequest request = new HelpRequest();

        // 1. Fetch the Citizen from DB
        User citizen = userRepository.findById(dto.getCitizenId())
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        // 2. Map fields from DTO to Entity
        request.setCitizen(citizen);
        request.setDescription(dto.getDescription());
        request.setLocation(dto.getLocation());
        request.setType(dto.getType()); // IMPORTANT: Map the new type
        request.setLatitude(dto.getLatitude());
        request.setLongitude(dto.getLongitude());
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());

        return helpRequestRepository.save(request);
    }
    public HelpRequestDTO convertToDTO(HelpRequest entity) {
        HelpRequestDTO dto = new HelpRequestDTO();
        dto.setId(entity.getId());
        dto.setCitizenId(entity.getCitizen().getId());
        dto.setCitizenName(entity.getCitizen().getName());
        dto.setDescription(entity.getDescription());
        dto.setLocation(entity.getLocation());
        dto.setType(entity.getType()); // IMPORTANT: Map back for the Admin UI
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getAssignedResponder() != null) {
            dto.setResponderId(entity.getAssignedResponder().getId());
            dto.setResponderName(entity.getAssignedResponder().getName());
        }

        return dto;
    }

    // Fetch all users with ROLE_RESPONDER to show in the Admin dropdown
    public List<UserDTO> getAvailableResponders() {
        return userRepository.findByRole("ROLE_RESPONDER").stream()
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setRole(user.getRole());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public HelpRequest updateStatus(Long requestId, String status) {
        HelpRequest request = helpRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return helpRequestRepository.save(request);
    }

    public List<HelpRequest> getResolvedHistory() {
        return helpRequestRepository.findByStatusOrderByCreatedAtDesc("RESOLVED");
    }

    @Transactional
    public void finalizeRescue(Long requestId, String summary, String severity) {
        HelpRequest request = helpRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // 1. Update Request Status
        request.setStatus("RESOLVED");
        request.setResolvedAt(LocalDateTime.now());
        helpRequestRepository.save(request);

        // 2. Create the Detailed Report
        RescueReport report = new RescueReport();
        report.setHelpRequest(request);
        report.setResponder(request.getAssignedResponder());

        rescueReportRepository.save(report);
    }
    public List<HelpRequest> getAllRequests() {
        // This fetches all SOS calls, typically sorted by newest first
        return helpRequestRepository.findAll();
    }
}