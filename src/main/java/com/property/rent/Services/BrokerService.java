package com.property.rent.Services;

import com.property.rent.DTOs.BrokerDTO.BrokerProfileRequest;
import com.property.rent.Entities.Broker;
import com.property.rent.Entities.User;
import com.property.rent.Repositories.BrokerRepository;
import com.property.rent.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


@Service
@RequiredArgsConstructor
public class BrokerService {

    private final BrokerRepository brokerRepository;
    private final UserRepository userRepository;

    @Transactional
    public Broker createBrokerProfile(String userEmail, BrokerProfileRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Потребителят не е намерен"));

        // Проверяваме дали вече има брокерски профил
        if (brokerRepository.existsByUserId(user.getId())) {
            throw new IllegalStateException("Този потребител вече има регистриран брокерски профил.");
        }

        // Променяме ролята на потребителя на ROLE_BROKER автоматично
        user.setRole(User.Role.ROLE_BROKER);
        userRepository.save(user);

        // Създаваме брокерския профил, като взимаме имената директно от потребителя
        Broker broker = Broker.builder()
                .user(user)
                .phone(request.getPhone())
                .agencyName(request.getAgencyName())
                .build();

        return brokerRepository.save(broker);
    }

    public Broker getBrokerById(Long id) {
        return brokerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Брокер с ID " + id + " не е намерен"));
    }

    // 2. Взимане на всички брокери
    public List<Broker> getAllBrokers() {
        return brokerRepository.findAll();
    }

    // 3. Редакция на брокерски профил
    @Transactional
    public Broker updateBrokerProfile(Long id, BrokerProfileRequest request) {
        Broker broker = getBrokerById(id);

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            broker.setPhone(request.getPhone());
        }
        if (request.getAgencyName() != null) {
            broker.setAgencyName(request.getAgencyName());
        }

        return brokerRepository.save(broker);
    }

    // 4. Изтриване на брокерски профил
    @Transactional
    public void deleteBroker(Long id) {
        Broker broker = getBrokerById(id);

        // Връщаме ролята на потребителя обратно на обикновен USER (по желание)
        User user = broker.getUser();
        user.setRole(User.Role.ROLE_USER);
        userRepository.save(user);

        brokerRepository.delete(broker);
    }


}
