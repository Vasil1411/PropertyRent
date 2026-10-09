package com.property.rent.DTOs.UserDTO;

import com.property.rent.Entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationRequest {

    @NotBlank(message = "Имейлът е задължителен")
    @Email(message = "Невалиден формат на имейл")
    private String email;

    @NotBlank(message = "Паролата е задължителна")
    @Size(min = 8, message = "Паролата трябва да бъде поне 6 символа")
    private String password;

    @NotBlank(message = "Името е задължително")
    @Size(min = 2, message = "Името трябва да бъде поне 2 символа")
    private String firstName;

    @NotBlank(message = "Фамилията е задължителна")
    @Size(min = 2, message = "Фамилията трябва да бъде поне 2 символа")
    private String lastName;

    // dafault value = user
    private User.Role role;
}