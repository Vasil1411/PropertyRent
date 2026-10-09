package com.property.rent.Repositories;

import com.property.rent.Entities.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {


    List<Property> findByBrokerId(Long brokerId);


    List<Property> findByCityAndStatus(String city, Property.PropertyStatus status);


    List<Property> findByDealType(Property.DealType dealType);
}
