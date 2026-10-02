package com.fleetforge.repository;

import com.fleetforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

//
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{

    //Wont pass a null value
    Optional<User> findByEmail(String email);
}
