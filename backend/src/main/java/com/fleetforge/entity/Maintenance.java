package com.fleetforge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Maintenance extends BaseEntity {

    @NotNull(message = "Vehicle is required!")
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @NotNull(message = "Maintenance type is required!")
    @ManyToOne
    @JoinColumn(name = "maintenance_type_id")
    private MaintenanceType maintenanceType;

    //Used to set the due date for the next service
    private LocalDate dueDate;

    //Enforce the mileage is positive
    @PositiveOrZero(message = "Due mileage cannot be negative!")
    private Integer dueMileage;

    private LocalDate completiionDate;

    @PositiveOrZero(message = "Completion mileage cannot be negative!")
    private Integer completionMileage;

    @PositiveOrZero(message = "Cost cannot be negative!")
    private BigDecimal cost;

    @NotBlank(message = "Status is required!")
    private String status;

    @Column(length = 1000)
    private String notes;

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public MaintenanceType getMaintenanceType() {
        return maintenanceType;
    }

    public void setMaintenanceType(MaintenanceType maintenanceType) {
        this.maintenanceType = maintenanceType;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getDueMileage() {
        return dueMileage;
    }

    public void setDueMileage(Integer dueMileage) {
        this.dueMileage = dueMileage;
    }

    public LocalDate getCompletionDate() {
        return completiionDate;
    }

    public void setCompletionDate(LocalDate completiionDate) {
        this.completiionDate = completiionDate;
    }

    public Integer getCompletionMileage() {
        return completionMileage;
    }

    public void setCompletionMileage(Integer completionMileage) {
        this.completionMileage = completionMileage;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
