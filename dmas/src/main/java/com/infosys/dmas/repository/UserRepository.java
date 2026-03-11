package com.infosys.dmas.repository;

import com.infosys.dmas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    //Find user by role for responder
    List<User> findByRole(String role);

    Optional<User> findByEmail(String email);
    // Finds active responders in a specific zone
    @Query("SELECT u FROM User u WHERE u.role = 'responder' AND u.location = :location")
    List<User> findRespondersByLocation(@Param("location") String location);

    @Query("SELECT u FROM User u WHERE u.role = 'responder'")
    List<User> findAllResponders();
}
