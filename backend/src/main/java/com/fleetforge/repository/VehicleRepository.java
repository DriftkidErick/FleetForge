package com.fleetforge.repository;

import com.fleetforge.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

//These allow for the search function to work
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>{

    //SQL query to pull from with either VIN, Registration number, Make, Model
    @Query("""
        SELECT v FROM Vehicle v
        WHERE LOWER(v.vin) LIKE LOWER(CONCAT('%', :term, '%'))
        OR LOWER(v.regNum) LIKE LOWER(CONCAT('%', :term, '%'))
        OR LOWER(v.make) LIKE LOWER(CONCAT('%', :term, '%'))
        OR LOWER(v.model) LIKE LOWER(CONCAT('%', :term, '%'))
        """)
    List<Vehicle> searchVehicles(@Param("term") String term);
}
