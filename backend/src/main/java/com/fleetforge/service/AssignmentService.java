package com.fleetforge.service;

import com.fleetforge.entity.Assignment;
import com.fleetforge.entity.Driver;
import com.fleetforge.entity.Vehicle;
import com.fleetforge.repository.AssignmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final VehicleService vehicleService;
    private final DriverService driverService;

    //Constructor
    public AssignmentService(
            AssignmentRepository assignmentRepository,
            VehicleService vehicleService,
            DriverService driverService) {

        this.assignmentRepository = assignmentRepository;
        this.vehicleService = vehicleService;
        this.driverService = driverService;
    }

    //Grab the list of all the assignments
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    //Get the assignment by the ID
    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assignment not found!"
                ));
    }

    //Create assignment
    public Assignment createAssignment(Assignment assignment) {

        Vehicle vehicle = vehicleService.getVehicleById(
                assignment.getVehicle().getId()
        );

        Driver driver = driverService.getDriverById(
                assignment.getDriver().getId()
        );

        //If the vehicle is not available
        if (!"Available".equalsIgnoreCase(vehicle.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vehicle is not available!"
            );
        }

        //If the driver is not available
        if (!"Available".equalsIgnoreCase(driver.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Driver is not available!"
            );
        }

        //Sets the vehicle to assinged
        vehicle = vehicleService.updateVehicleStatus(
                vehicle.getId(),
                "Assigned"
        );

        //Sets the driver to assigned
        driver = driverService.updateDriverStatus(
                driver.getId(),
                "Assigned"
        );

        assignment.setVehicle(vehicle);
        assignment.setDriver(driver);
        assignment.setStatus("Active");

        return assignmentRepository.save(assignment);
    }

    //Update the assignment
    public Assignment updateAssignment(
            Long id,
            Assignment updatedAssignment) {

        Assignment assignment = getAssignmentById(id);

        Vehicle vehicle = vehicleService.getVehicleById(
                updatedAssignment.getVehicle().getId()
        );

        Driver driver = driverService.getDriverById(
                updatedAssignment.getDriver().getId()
        );

        assignment.setVehicle(vehicle);
        assignment.setDriver(driver);
        assignment.setStartDate(updatedAssignment.getStartDate());
        assignment.setEndDate(updatedAssignment.getEndDate());
        assignment.setStatus(updatedAssignment.getStatus());

        if ("Completed".equalsIgnoreCase(assignment.getStatus())) {
            vehicle = vehicleService.updateVehicleStatus(
                    vehicle.getId(),
                    "Available"
            );

            driver = driverService.updateDriverStatus(
                    driver.getId(),
                    "Available"
            );
        } else if ("Active".equalsIgnoreCase(assignment.getStatus())) {
            vehicle = vehicleService.updateVehicleStatus(
                    vehicle.getId(),
                    "Assigned"
            );

            driver = driverService.updateDriverStatus(
                    driver.getId(),
                    "Assigned"
            );
        }

        assignment.setVehicle(vehicle);
        assignment.setDriver(driver);

        return assignmentRepository.save(assignment);
    }

    //Delete the assignment
    public void deleteAssignment(Long id) {
        Assignment assignment = getAssignmentById(id);

        //Sets the Vehicle and Driver to available when the assignment is deleted
        if ("Active".equalsIgnoreCase(assignment.getStatus())) {
            vehicleService.updateVehicleStatus(
                    assignment.getVehicle().getId(),
                    "Available"
            );

            driverService.updateDriverStatus(
                    assignment.getDriver().getId(),
                    "Available"
            );
        }

        assignmentRepository.delete(assignment);
    }
}





