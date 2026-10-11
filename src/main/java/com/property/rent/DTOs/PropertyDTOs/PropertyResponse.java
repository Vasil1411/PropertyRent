package com.property.rent.DTOs.PropertyDTOs;


import com.property.rent.DTOs.BrokerDTO.BrokerResponse;
import com.property.rent.Entities.Property;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private Property.PropertyType propertyType;
    private Property.DealType dealType;
    private Property.PropertyStatus status;
    private BigDecimal price;
    private BigDecimal areaSqm;
    private Integer floor;
    private Integer totalFloors;
    private Integer roomsCount;
    private String city;
    private String neighborhood;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private BrokerResponse broker;
    private List<PropertyImageResponse> images;
}
