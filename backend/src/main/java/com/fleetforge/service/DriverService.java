package com.fleetforge.service;

import com.fleetforge.entity.Driver;
import com.fleetforge.repository.DriverRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DriverService {

    private final  DriverRepository driverRepository;

    //Constructor
    public DriverService(DriverRepository driverRepository){
        this.driverRepository = driverRepository;
    }

    //Return a list of all the drivers
    public List<Driver>getAllDrivers(){
        return driverRepository.findAll();
    }

    //Get a driver by their Id
    public Driver getDriverById(Long id){
        return driverRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException
                        (HttpStatus.NOT_FOUND,"Driver not found!"));
    }

    //Create a driver
    public Driver createDriver(Driver driver){
        return driverRepository.save(driver);
    }

    //Update Driver
    public Driver updateDriver(Long id, Driver updatedDriver){
        Driver driver = getDriverById(id);

        driver.setFirstName(updatedDriver.getFirstName());
        driver.setLastName(updatedDriver.getLastName());
        driver.setEmail(updatedDriver.getEmail());
        driver.setPhoneNum(updatedDriver.getPhoneNum());
        driver.setStatus(updatedDriver.getStatus());

        return driverRepository.save(driver);
    }

    //Delete Driver
    public void deleteDriver(Long id){
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }

    //updates the drivers status
    public Driver updateDriverStatus(Long id, String status) {
        Driver driver = getDriverById(id);
        driver.setStatus(status);
        return driverRepository.save(driver);
    }

    //Search Function for the drivers
    public List<Driver> searchDrivers(String term) {
        if (term == null || term.isBlank()) {
            return driverRepository.findAll();
        }

        return driverRepository.searchDrivers(term.trim());
    }

}
