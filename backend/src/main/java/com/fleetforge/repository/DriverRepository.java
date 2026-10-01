package com.fleetforge.repository;

import com.fleetforge.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long>{
}
