package com.property.rent.DTOs.PropertyDTOs;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyImageResponse {
    private Long id;
    private String imageUrl;
}
