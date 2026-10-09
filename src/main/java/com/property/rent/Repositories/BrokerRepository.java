package com.property.rent.Repositories;

import com.property.rent.Entities.Broker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrokerRepository extends JpaRepository<Broker, Long> {


    Optional<Broker> findByUserId(Long userId);


    List<Broker> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);


    List<Broker> findByAgencyNameContainingIgnoreCase(String agencyName);
}