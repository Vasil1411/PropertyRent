package com.property.rent.Repositories;

import com.property.rent.Entities.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    // Търсене на удобство по име (напр. "Климатик")
    Optional<Amenity> findByName(String name);
}