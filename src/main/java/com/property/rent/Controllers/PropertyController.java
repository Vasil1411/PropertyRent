package com.property.rent.Controllers;

import com.property.rent.DTOs.PropertyDTOs.PropertyRequest;
import com.property.rent.DTOs.PropertyDTOs.PropertyResponse;
import com.property.rent.Services.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import com.property.rent.Entities.Property;
import java.math.BigDecimal;


@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    // Създаване на имот (Перфектно за React FormData)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<PropertyResponse> createProperty(
            Authentication authentication,
            @RequestPart("property") @Valid PropertyRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        String email = authentication.getName();
        PropertyResponse createdProperty = propertyService.createProperty(email, request, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProperty);
    }

    // Взимане на всички имоти (публичен достъп)
    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    // Взимане на имот по ID
    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyResponseById(id));
    }

    // Изтриване на имот
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        propertyService.deleteProperty(id, email);
        return ResponseEntity.noContent().build();
    }

    // Редакция на имот
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<PropertyResponse> updateProperty(
            Authentication authentication,
            @PathVariable Long id,
            @RequestPart("property") @Valid PropertyRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages) {

        String email = authentication.getName();
        PropertyResponse updatedProperty = propertyService.updateProperty(id, email, request, newImages);
        return ResponseEntity.ok(updatedProperty);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyResponse>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false)  Property.DealType dealType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer roomsCount) {

        List<PropertyResponse> properties = propertyService.searchProperties(city,dealType, minPrice, maxPrice, roomsCount);
        return ResponseEntity.ok(properties);
    }
}