package com.property.rent.Services;


import com.property.rent.DTOs.UserDTO.UserRegistrationRequest;
import com.property.rent.DTOs.UserDTO.UserRegistrationResponse;
import com.property.rent.Repositories.UserRepository;
import com.property.rent.Entities.User;
import com.property.rent.Services.JWTService;
import com.property.rent.DTOs.UserDTO.LoginRequest;
import com.property.rent.DTOs.UserDTO.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    @Transactional
    public UserRegistrationResponse registerUser(UserRegistrationRequest request) {
        // 1. Проверка дали имейлът съществува
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Потребител с този имейл вече съществува: " + request.getEmail());
        }

        // 2. Хеширане на паролата
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 3. Определяне на роля (ако не е подадена, слагаме ROLE_USER)
        User.Role userRole = request.getRole() != null ? request.getRole() : User.Role.ROLE_USER;

        // 4. Създаване на Entity
        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(encodedPassword)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(userRole)
                .build();

        // 5. Запис в базата
        User savedUser = userRepository.save(newUser);

        // 6. Връщане на безопасно Response DTO
        return UserRegistrationResponse.fromEntity(savedUser);
    }


    public LoginResponse login(LoginRequest request) {
        // 1. Намираме потребителя по имейл
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Грешен имейл или парола"));

        // 2. Сверяваме паролата с хеша в базата
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Грешен имейл или парола");
        }

        // 3. Създаваме Spring Security UserDetails обект (или ползваме самия user, ако имплементира UserDetails)
        // За простота тук ще генерираме токена директно през JwtService с имейла като subject:
        org.springframework.security.core.userdetails.UserDetails principal =
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPasswordHash())
                        .authorities(user.getRole().name())
                        .build();

        String token = jwtService.generateToken(principal);

        // 4. Връщаме токена и основни данни
        return new LoginResponse(token, user.getEmail(), user.getRole().name());
    }
}



