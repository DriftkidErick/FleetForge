package com.fleetforge.repository;

import com.fleetforge.entity.MaintenanceType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceTypeRepository extends JpaRepository<MaintenanceType, Long>{
}
