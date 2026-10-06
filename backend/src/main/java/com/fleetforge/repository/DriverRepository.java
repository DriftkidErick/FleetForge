package com.fleetforge.repository;

import com.fleetforge.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

//Used to search for the Drivers
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long>{

    //SQL query thats used to pull the information from driver based on First name, Last name, email, phone numer
    @Query("""
        SELECT d FROM Driver d
        WHERE LOWER(d.firstName) LIKE LOWER(CONCAT('%', :term, '%'))
        OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :term, '%'))
        OR LOWER(d.email) LIKE LOWER(CONCAT('%', :term, '%'))
        OR LOWER(d.phoneNum) LIKE LOWER(CONCAT('%', :term, '%'))
        """)
    List<Driver> searchDrivers(@Param("term") String term);
}
