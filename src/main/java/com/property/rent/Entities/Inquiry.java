package com.property.rent.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inquiries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "client_first_name", nullable = false, length = 100)
    private String clientFirstName;

    @Column(name = "client_last_name", nullable = false, length = 100)
    private String clientLastName;

    @Column(name = "client_email", nullable = false, length = 150)
    private String clientEmail;

    @Column(name = "client_phone", nullable = false, length = 30)
    private String clientPhone;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InquiryStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = InquiryStatus.NEW;
        }
    }

    public enum InquiryStatus {
        NEW, READ, CONTACTED, ARCHIVED
    }
}