package com.property.rent.DTOs.BrokerDTO;

import com.property.rent.Entities.Broker;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class BrokerResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String agencyName;
    private BigDecimal rating;

    public static BrokerResponse fromEntity(Broker broker) {
        return BrokerResponse.builder()
                .id(broker.getId())
                .email(broker.getUser().getEmail())
                .firstName(broker.getUser().getFirstName())
                .lastName(broker.getUser().getLastName())
                .phone(broker.getPhone())
                .agencyName(broker.getAgencyName())
                .rating(broker.getRating())
                .build();
    }
}