package com.property.rent.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "brokers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Broker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(name = "agency_name", length = 150)
    private String agencyName;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;
}