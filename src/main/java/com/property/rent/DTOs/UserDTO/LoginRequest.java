package com.property.rent.DTOs.UserDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Имейлът е задължителен")
    @Email(message = "Невалиден формат на имейл")
    private String email;

    @NotBlank(message = "Паролата е задължителна")
    private String password;
}
