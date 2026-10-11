package com.property.rent.DTOs.BrokerDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class BrokerProfileRequest {

    @NotBlank(message = "Телефонният номер е задължителен")
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Невалиден телефонен номер")
    private String phone;

    private String agencyName;
}
