package com.fleetforge.entity;

//Pulls the entity folder
import jakarta.persistence.Entity;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
//Ensure the not blank or not null to varibles with annotation
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

//Imports time
import java.time.LocalDate;

@Entity
public class Assignment extends BaseEntity{

    @NotNull(message = "Vehicle is required!")
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @NotNull(message = "Driver is required!")
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @NotNull(message = "Start date is required!")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotBlank(message = "Status is required!")
    private String status;

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
