package com.infosys.dmas.dto;

import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
public class AnalyticsSummaryDTO {
    private long totalRequests;
    private long activeAlerts;
    private String avgResponseTime;
    private double successRate;

    // For the charts
    private List<Map<String, Object>> monthlyStats;
    private List<Map<String, Object>> categoryStats;
}