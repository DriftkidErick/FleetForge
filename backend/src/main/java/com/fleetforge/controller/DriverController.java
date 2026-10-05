package com.fleetforge.controller;

import com.fleetforge.entity.Driver;
import com.fleetforge.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    //Constuctor
    public DriverController(DriverService driverService){
        this.driverService = driverService;
    }

    @GetMapping
    public List<Driver>getAllDrivers(){
        return driverService.getAllDrivers();
    }

    @GetMapping("/{id}")
    public Driver getDriverById(@PathVariable Long id){
        return driverService.getDriverById(id);
    }

    @PostMapping
    public Driver createDriver(@Valid @RequestBody Driver driver){
        return driverService.createDriver(driver);
    }

    @PutMapping("/{id}")
    public Driver updatesDriver(@PathVariable Long id, @Valid @RequestBody Driver driver){
        return driverService.updateDriver(id, driver);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>deleteDriver(@PathVariable Long id){
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }


}
