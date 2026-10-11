package com.property.rent.DTOs.UserDTO;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @Size(min = 2, message = "Името трябва да бъде поне 2 символа")
    private String firstName;

    @Size(min = 2, message = "Фамилията трябва да бъде поне 2 символа")
    private String lastName;
}