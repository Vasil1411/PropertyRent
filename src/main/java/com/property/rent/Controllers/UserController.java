package com.property.rent.Controllers;

import com.property.rent.DTOs.UserDTO.UserRegistrationResponse;
import com.property.rent.DTOs.UserDTO.UserRegistrationRequest;
import com.property.rent.Services.UserService;
import com.property.rent.DTOs.UserDTO.LoginResponse;
import com.property.rent.DTOs.UserDTO.LoginRequest;
import com.property.rent.DTOs.UserDTO.UserUpdateRequest;
import com.property.rent.DTOs.UserDTO.UserProfileResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor

public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        UserRegistrationResponse response = userService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    // 1. GET PROFILE BY ID (Достъпен за всеки автентикиран потребител или админ)
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {
        UserProfileResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    // 2. GET ALL PROFILES (Достъпен САМО за администратори)
    @GetMapping("/all")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // 3. UPDATE PROFILE BY ID (Редакция на профил)
    @PutMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        UserProfileResponse updatedUser = userService.updateUserById(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    // 4. DELETE PROFILE BY ID (Изтриване на профил)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
