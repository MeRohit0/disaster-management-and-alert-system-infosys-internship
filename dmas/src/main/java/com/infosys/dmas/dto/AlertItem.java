package com.infosys.dmas.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AlertItem {
    private String title;       // e.g., "Moderate Rain - Haryana"
    private String description; // The full alert text
    private String link;        // Detailed link on Sachet
    private String pubDate;     // Date published
    private String guid;       // The unique identifier from NDMA
}