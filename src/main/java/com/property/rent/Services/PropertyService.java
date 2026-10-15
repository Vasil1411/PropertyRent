package com.property.rent.Services;

import com.property.rent.DTOs.PropertyDTOs.*;
import com.property.rent.DTOs.BrokerDTO.BrokerResponse;
import com.property.rent.Entities.Broker;
import com.property.rent.Entities.Property;
import com.property.rent.Entities.PropertyImage;
import com.property.rent.Repositories.BrokerRepository;
import com.property.rent.Repositories.PropertyRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final BrokerRepository brokerRepository;
    private final Cloudinary cloudinary;

    // Метод за мапване от Entity към DTO Response
    public PropertyResponse mapToResponse(Property property) {
        BrokerResponse brokerDto = null;
        if (property.getBroker() != null) {
            brokerDto = BrokerResponse.builder()
                    .id(property.getBroker().getId())
                    .firstName(property.getBroker().getUser().getFirstName())
                    .lastName(property.getBroker().getUser().getLastName())
                    .email(property.getBroker().getUser().getEmail())
                    .phone(property.getBroker().getPhone())
                    .agencyName(property.getBroker().getAgencyName())
                    .build();
        }

        List<PropertyImageResponse> imageDtos = null;
        if (property.getImages() != null) {
            imageDtos = property.getImages().stream()
                    .map(img -> PropertyImageResponse.builder()
                            .id(img.getId())
                            .imageUrl(img.getImageUrl())
                            .build())
                    .collect(Collectors.toList());
        }

        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .amenitiesText(property.getAmenitiesText())
                .propertyType(property.getPropertyType())
                .dealType(property.getDealType())
                .status(property.getStatus())
                .price(property.getPrice())
                .areaSqm(property.getAreaSqm())
                .floor(property.getFloor())
                .totalFloors(property.getTotalFloors())
                .roomsCount(property.getRoomsCount())
                .city(property.getCity())
                .neighborhood(property.getNeighborhood())
                .address(property.getAddress())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .broker(brokerDto)
                .images(imageDtos)
                .build();
    }

    @Transactional
    public PropertyResponse createProperty(String userEmail, PropertyRequest request, List<MultipartFile> images) {
        Broker broker = brokerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Брокерският профил не е намерен за този потребител"));

        Property property = Property.builder()
                .broker(broker)
                .title(request.getTitle())
                .description(request.getDescription())
                .amenitiesText(request.getAmenitiesText()) // Поправено от setAmenitiesText на amenitiesText за Builder-а
                .propertyType(request.getPropertyType())
                .dealType(request.getDealType())
                .status(request.getStatus())
                .price(request.getPrice())
                .areaSqm(request.getAreaSqm())
                .floor(request.getFloor())
                .totalFloors(request.getTotalFloors())
                .roomsCount(request.getRoomsCount())
                .city(request.getCity())
                .neighborhood(request.getNeighborhood())
                .address(request.getAddress())
                .build();

        if (images != null && !images.isEmpty()) {
            boolean isFirst = true;
            int order = 1;
            for (MultipartFile file : images) {
                try {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    String imageUrl = uploadResult.get("url").toString();
                    String publicId = uploadResult.get("public_id").toString();

                    PropertyImage propertyImage = PropertyImage.builder()
                            .property(property)
                            .imageUrl(imageUrl)
                            .isPrimary(isFirst)
                            .publicId(publicId)
                            .displayOrder(order++)
                            .build();

                    property.getImages().add(propertyImage);
                    isFirst = false;
                } catch (IOException e) {
                    throw new RuntimeException("Грешка при качване на снимка в Cloudinary", e);
                }
            }
        }

        Property savedProperty = propertyRepository.save(property);
        return mapToResponse(savedProperty);
    }

    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PropertyResponse getPropertyResponseById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Имот с ID " + id + " не е намерен"));
        return mapToResponse(property);
    }

    @Transactional
    public void deleteProperty(Long id, String userEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Имот с ID " + id + " не е намерен"));

        if (!property.getBroker().getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Нямате права да изтриете този имот");
        }

        // 1. Изтриваме физическите файлове от Cloudinary
        if (property.getImages() != null && !property.getImages().isEmpty()) {
            for (PropertyImage img : property.getImages()) {
                if (img.getPublicId() != null) {
                    try {
                        cloudinary.uploader().destroy(img.getPublicId(), ObjectUtils.emptyMap());
                    } catch (IOException e) {
                        throw new RuntimeException("Грешка при изтриване на снимка от Cloudinary", e);
                    }
                }
            }
        }

        // 2. Изтриваме имота от базата (PostgreSQL каскадно ще изтрие записите в property_images)
        propertyRepository.delete(property);
    }

    @Transactional
    public PropertyResponse updateProperty(Long id, String userEmail, PropertyRequest request, List<MultipartFile> newImages) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Имот с ID " + id + " не е намерен"));

        if (!property.getBroker().getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Нямате права да редактирате този имот");
        }

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setAmenitiesText(request.getAmenitiesText()); // Обновяване на удобствата
        property.setPropertyType(request.getPropertyType());
        property.setDealType(request.getDealType());
        property.setStatus(request.getStatus());
        property.setPrice(request.getPrice());
        property.setAreaSqm(request.getAreaSqm());
        property.setFloor(request.getFloor());
        property.setTotalFloors(request.getTotalFloors());
        property.setRoomsCount(request.getRoomsCount());
        property.setCity(request.getCity());
        property.setNeighborhood(request.getNeighborhood());
        property.setAddress(request.getAddress());

        if (newImages != null && !newImages.isEmpty()) {
            int currentOrder = property.getImages().size() + 1;
            for (MultipartFile file : newImages) {
                try {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    String imageUrl = uploadResult.get("url").toString();

                    PropertyImage propertyImage = PropertyImage.builder()
                            .property(property)
                            .imageUrl(imageUrl)
                            .isPrimary(property.getImages().isEmpty())
                            .displayOrder(currentOrder++)
                            .build();

                    property.getImages().add(propertyImage);
                } catch (IOException e) {
                    throw new RuntimeException("Грешка при качване на нова снимка в Cloudinary", e);
                }
            }
        }

        Property updatedProperty = propertyRepository.save(property);
        return mapToResponse(updatedProperty);
    }

    public List<PropertyResponse> searchProperties(String city, Property.DealType dealType, BigDecimal minPrice, BigDecimal maxPrice, Integer roomsCount) {
        List<Property> properties = propertyRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (city != null && !city.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%"));
            }
            if (dealType != null) {
                predicates.add(cb.equal(root.get("dealType"), dealType));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (roomsCount != null) {
                predicates.add(cb.equal(root.get("roomsCount"), roomsCount));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });

        return properties.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}