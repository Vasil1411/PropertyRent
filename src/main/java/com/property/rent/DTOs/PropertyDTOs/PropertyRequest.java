package com.property.rent.DTOs.PropertyDTOs;

import com.property.rent.Entities.Property;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Set;

@Data
public class PropertyRequest {

    @NotBlank(message = "Заглавието е задължително")
    @Size(max = 200, message = "Заглавието не може да надвишава 200 символа")
    private String title;

    private String description;

    @NotNull(message = "Типът на имота е задължителен")
    private Property.PropertyType propertyType;

    @NotNull(message = "Типът на сделката е задължителен")
    private Property.DealType dealType;

    @NotNull(message = "Статусът е задължителен")
    private Property.PropertyStatus status;

    @NotNull(message = "Цената е задължителна")
    @Positive(message = "Цената трябва да бъде положително число")
    private BigDecimal price;

    @NotNull(message = "Квадратурата е задължителна")
    @Positive(message = "Квадратурата трябва да бъде положителна")
    private BigDecimal areaSqm;

    private Integer floor;
    private Integer totalFloors;
    private Integer roomsCount;

    @NotBlank(message = "Градът е задължителен")
    private String city;

    private String neighborhood;
    private String address;

    private Set<Long> amenityIds;
}