package com.fleetforge.service;

import com.fleetforge.entity.Vehicle;
import com.fleetforge.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    //Constructor
    public VehicleService(VehicleRepository vehicleRepository){
        this.vehicleRepository = vehicleRepository;
    }

    //List to pull all the cars
    public List<Vehicle>getAllVehicles(){
        return vehicleRepository.findAll();
    }

    //Get by One vehicle ID
    public Vehicle getVehicleById(Long id){
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException
                        (HttpStatus.NOT_FOUND, "Vehicle not found!"));
    }

    //Create a vehicle
    public Vehicle createVehicle(Vehicle vehicle){
        return vehicleRepository.save(vehicle);
    }

    //Update the vehicle
    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle){
        Vehicle vehicle = getVehicleById(id);

        vehicle.setVin(updatedVehicle.getVin());
        vehicle.setRegNum(updatedVehicle.getRegNum());
        vehicle.setYear(updatedVehicle.getYear());
        vehicle.setMake(updatedVehicle.getMake());
        vehicle.setModel(updatedVehicle.getModel());
        vehicle.setMileage(updatedVehicle.getMileage());
        vehicle.setStatus((updatedVehicle.getStatus()));

        return vehicleRepository.save(vehicle);
    }

    //Delete Vehicle

    public void deleteVehicle(Long id){
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    public Vehicle updateVehicleStatus(Long id, String status) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setStatus(status);
        return vehicleRepository.save(vehicle);
    }
}
