package com.property.rent.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "broker_id", nullable = false)
    private Broker broker;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false, length = 50)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "deal_type", nullable = false, length = 20)
    private DealType dealType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PropertyStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "area_sqm", nullable = false, precision = 8, scale = 2)
    private BigDecimal areaSqm;

    private Integer floor;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column(name = "rooms_count")
    private Integer roomsCount;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 100)
    private String neighborhood;

    @Column(length = 255)
    private String address;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PropertyImage> images = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "property_amenities",
            joinColumns = @JoinColumn(name = "property_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @Builder.Default
    private Set<Amenity> amenities = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum PropertyType {
        APARTMENT, HOUSE, OFFICE, GARAGE, LAND, COMMERCIAL
    }

    public enum DealType {
        RENT, SALE
    }

    public enum PropertyStatus {
        ACTIVE, RESERVED, RENTED, SOLD, INACTIVE
    }
}