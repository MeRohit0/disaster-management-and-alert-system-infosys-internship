package com.infosys.dmas.util;

import com.infosys.dmas.dto.HelpRequestDTO;
import com.infosys.dmas.model.HelpRequest;
import com.infosys.dmas.model.User;
import com.infosys.dmas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class HelpRequestMapper {

    @Autowired
    private UserRepository userRepository;

    /**
     * Entity -> DTO
     * Used when sending data TO the Frontend (React).
     */
    public HelpRequestDTO toDTO(HelpRequest entity) {
        if (entity == null) return null;

        HelpRequestDTO dto = new HelpRequestDTO();
        dto.setId(entity.getId());
        dto.setDescription(entity.getDescription());
        dto.setLocation(entity.getLocation()); // Matches 'location' in your User model
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());

        // Map Citizen (The one who created the SOS)
        if (entity.getCitizen() != null) {
            dto.setCitizenId(entity.getCitizen().getId());
            dto.setCitizenName(entity.getCitizen().getName());
        }

        // Map Responder (The one assigned to help)
        if (entity.getAssignedResponder() != null) {
            dto.setResponderId(entity.getAssignedResponder().getId());
            dto.setResponderName(entity.getAssignedResponder().getName());
        }

        return dto;
    }

    /**
     * DTO -> Entity
     * Used when receiving data FROM the Frontend (React).
     */
    public HelpRequest toEntity(HelpRequestDTO dto) {
        if (dto == null) return null;

        HelpRequest entity = new HelpRequest();
        entity.setDescription(dto.getDescription());
        entity.setLocation(dto.getLocation());
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());

        // Find the actual Citizen from DB using the ID provided by the Frontend
        if (dto.getCitizenId() != null) {
            userRepository.findById(dto.getCitizenId())
                    .ifPresent(entity::setCitizen);
        }

        return entity;
    }
}