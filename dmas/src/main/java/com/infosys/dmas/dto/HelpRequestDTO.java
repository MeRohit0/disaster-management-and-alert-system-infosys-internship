package com.infosys.dmas.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HelpRequestDTO {
    private Long id;
    private Long citizenId;
    private String citizenName;
    private String description;
    private String location;
    private String type;
    private Double latitude;
    private Double longitude;
    private String status;
    private LocalDateTime createdAt;

    // Assigned responder info (if any)
    private Long responderId;
    private String responderName;
}