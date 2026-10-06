package com.fleetforge.config;

import com.fleetforge.entity.User;
import com.fleetforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    // Creates the initial fleet manager when the application starts
    @Bean
    public CommandLineRunner createFleetManager(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_NAME:Fleet Manager}") String name,
            @Value("${ADMIN_EMAIL}") String email,
            @Value("${ADMIN_PASSWORD}") String password) {

        return args -> {
            if (userRepository.findByEmail(email).isEmpty()) {
                User user = new User();

                user.setName(name);
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(password));

                userRepository.save(user);
            }
        };
    }
}