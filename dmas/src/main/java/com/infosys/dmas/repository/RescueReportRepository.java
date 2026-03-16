package com.infosys.dmas.repository;

import com.infosys.dmas.model.RescueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RescueReportRepository extends JpaRepository<RescueReport, Long> {

    // Fetch the timeline for a specific SOS request, sorted by latest first
    List<RescueReport> findByHelpRequestIdOrderByTimestampDesc(Long requestId);
}