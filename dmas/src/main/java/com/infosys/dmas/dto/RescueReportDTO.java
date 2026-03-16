package com.infosys.dmas.dto;

import lombok.Data;

@Data
public class RescueReportDTO {
    private Long helpRequestId;
    private Long responderId;
    private String currentStatus;
    private String updateNote;
}