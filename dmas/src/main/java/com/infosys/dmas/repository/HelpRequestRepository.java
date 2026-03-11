package com.infosys.dmas.repository;

import com.infosys.dmas.model.HelpRequest;
import com.infosys.dmas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {

    // Find all requests that haven't been picked up by a responder yet
    List<HelpRequest> findByStatus(String status);

    // Find requests assigned to a specific responder
    List<HelpRequest> findByAssignedResponder(User responder);

    // Find requests by a specific citizen (for their history)
    List<HelpRequest> findByCitizen(User citizen);

    List<HelpRequest> findByAssignedResponderId(Long responderId);

    List<HelpRequest> findByStatusOrderByCreatedAtDesc(String status);
}