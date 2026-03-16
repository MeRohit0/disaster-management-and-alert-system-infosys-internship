package com.infosys.dmas.controller;

import com.infosys.dmas.dto.HelpRequestDTO;
import com.infosys.dmas.dto.UserDTO;
import com.infosys.dmas.model.HelpRequest;
import com.infosys.dmas.model.User;
import com.infosys.dmas.service.HelpRequestService;
import com.infosys.dmas.util.HelpRequestMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/help")
public class HelpRequestController {

    @Autowired
    private HelpRequestService helpRequestService;

    @Autowired
    private HelpRequestMapper helpRequestMapper;

    // CITIZEN: Create SOS
    @PostMapping("/sos")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<HelpRequestDTO> createSOS(@RequestBody HelpRequestDTO dto) {
        // 1. Always call the method that handles the DTO and fetches the User
        HelpRequest savedRequest = helpRequestService.createSOS(dto);

        // 2. Convert it back to DTO to return to the frontend
        return ResponseEntity.ok(helpRequestService.convertToDTO(savedRequest));
    }

    // ADMIN: View all pending help calls
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HelpRequestDTO>> getPending() {
        List<HelpRequestDTO> dtos = helpRequestService.getPendingRequests()
                .stream()
                .map(helpRequestMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ADMIN: Assign a responder to a request
    @PutMapping("/{requestId}/assign/{responderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HelpRequestDTO> assign(@PathVariable Long requestId, @PathVariable Long responderId) {
        HelpRequest updated = helpRequestService.assignResponder(requestId, responderId);
        return ResponseEntity.ok(helpRequestMapper.toDTO(updated));
    }

    @GetMapping("/{requestId}/suggested-responders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getSuggestions(@PathVariable Long requestId) {
        List<User> responders = helpRequestService.suggestResponders(requestId);

        // Using a simple stream to convert User to a basic DTO (don't send passwords!)
        List<UserDTO> dtos = responders.stream().map(user -> {
            UserDTO d = new UserDTO();
            d.setId(user.getId());
            d.setName(user.getName());
            d.setLocation(user.getLocation());
            return d;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/responder/{responderId}")
    @PreAuthorize("hasRole('RESPONDER') or hasRole('ADMIN')")
    public ResponseEntity<List<HelpRequestDTO>> getResponderTasks(@PathVariable Long responderId) {
        List<HelpRequestDTO> tasks = helpRequestService.getRequestsByResponder(responderId)
                .stream()
                .map(helpRequestMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{requestId}/acknowledge")
    @PreAuthorize("hasRole('RESPONDER')")
    public ResponseEntity<HelpRequestDTO> acknowledge(@PathVariable Long requestId) {
        HelpRequest updated = helpRequestService.acknowledgeRequest(requestId);
        return ResponseEntity.ok(helpRequestMapper.toDTO(updated));
    }

    // Admin calls this to populate the "Select Responder" list
    @GetMapping("/responders")
    public ResponseEntity<List<UserDTO>> getResponders() {
        return ResponseEntity.ok(helpRequestService.getAvailableResponders());
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasRole('RESPONDER')")
    public ResponseEntity<HelpRequestDTO> updateStatus(@PathVariable Long requestId, @RequestBody Map<String, String> statusUpdate)
    {
        String newStatus = statusUpdate.get("status");
        HelpRequest updated = helpRequestService.updateStatus(requestId, newStatus);
        return ResponseEntity.ok(helpRequestMapper.toDTO(updated));
    }

    @GetMapping("/all")
    public ResponseEntity<List<HelpRequest>> getAllHelpRequests() {
        List<HelpRequest> requests = helpRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
}