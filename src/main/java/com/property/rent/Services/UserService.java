package com.property.rent.Services;

import com.property.rent.DTOs.UserDTO.UserRegistrationRequest;
import com.property.rent.DTOs.UserDTO.UserRegistrationResponse;
import com.property.rent.Repositories.UserRepository;
import com.property.rent.Entities.User;
import com.property.rent.Services.JWTService;
import com.property.rent.DTOs.UserDTO.LoginRequest;
import com.property.rent.DTOs.UserDTO.LoginResponse;
import com.property.rent.DTOs.UserDTO.UserUpdateRequest;
import com.property.rent.DTOs.UserDTO.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    @Transactional
    public UserRegistrationResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Потребител с този имейл вече съществува: " + request.getEmail());
        }


        String encodedPassword = passwordEncoder.encode(request.getPassword());


        User.Role userRole = request.getRole() != null ? request.getRole() : User.Role.ROLE_USER;


        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(encodedPassword)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(userRole)
                .build();


        User savedUser = userRepository.save(newUser);


        return UserRegistrationResponse.fromEntity(savedUser);
    }


    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Грешен имейл или парола"));


        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Грешен имейл или парола");
        }


        org.springframework.security.core.userdetails.UserDetails principal =
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPasswordHash())
                        .authorities(user.getRole().name())
                        .build();

        String token = jwtService.generateToken(principal);


        return new LoginResponse(token, user.getEmail(), user.getRole().name());
    }

    // 1. GET USER BY ID (Взима потребител по неговото ID)
    public UserProfileResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Потребителят с ID " + id + " не е намерен"));
        return mapToResponse(user);
    }



    // 2. GET ALL USERS (За администратори - връща списък с всички)
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserProfileResponse updateUserById(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Потребителят с ID " + id + " не е намерен"));

        updateUserFields(user, request);
        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    // 4. DELETE USER (Изтриване по ID)
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Потребителят с ID " + id + " не съществува");
        }
        userRepository.deleteById(id);
    }

    // Помощен метод за мапиране от Entity към Response DTO
    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }

    private void updateUserFields(User user, UserUpdateRequest request) {
        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }
    }
}




