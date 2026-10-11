package com.property.rent.Controllers;

import com.property.rent.DTOs.BrokerDTO.BrokerProfileRequest;
import com.property.rent.Entities.Broker;
import com.property.rent.Services.BrokerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.property.rent.DTOs.BrokerDTO.BrokerResponse;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/broker")
@RequiredArgsConstructor
public class BrokerController {

    private final BrokerService brokerService;

    // Ендпоинт за стрякане от логнат потребител, който иска да стане брокер
    @PostMapping("/register-profile")
    public ResponseEntity<String> registerBrokerProfile(
            Authentication authentication,
            @Valid @RequestBody BrokerProfileRequest request) {

        String email = authentication.getName(); // Взимаме имейла от JWT токена
        brokerService.createBrokerProfile(email, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Брокерският профил беше създаден успешно, а ролята ви е обновена!");
    }

    @GetMapping("/all")
    public ResponseEntity<List<BrokerResponse>> getAllBrokers() {
        List<BrokerResponse> brokers = brokerService.getAllBrokers().stream()
                .map(BrokerResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(brokers);
    }

    // GET /api/broker/{id} - Детайли за конкретен брокер по ID
    @GetMapping("/{id}")
    public ResponseEntity<BrokerResponse> getBrokerById(@PathVariable Long id) {
        Broker broker = brokerService.getBrokerById(id);
        return ResponseEntity.ok(BrokerResponse.fromEntity(broker));
    }

    // PUT /api/broker/{id} - Редакция на брокерски данни
    @PutMapping("/{id}")
    public ResponseEntity<BrokerResponse> updateBroker(
            @PathVariable Long id,
            @Valid @RequestBody BrokerProfileRequest request) {
        Broker updatedBroker = brokerService.updateBrokerProfile(id, request);
        return ResponseEntity.ok(BrokerResponse.fromEntity(updatedBroker));
    }

    // DELETE /api/broker/{id} - Изтриване на брокерски профил
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBroker(@PathVariable Long id) {
        brokerService.deleteBroker(id);
        return ResponseEntity.noContent().build();
    }
}