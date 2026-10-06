package com.fleetforge.service;

import com.fleetforge.entity.Maintenance;
import com.fleetforge.entity.MaintenanceType;
import com.fleetforge.entity.Vehicle;
import com.fleetforge.repository.MaintenanceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleService vehicleService;
    private final MaintenanceTypeService maintenanceTypeService;

    //Constructor
    public MaintenanceService(
            MaintenanceRepository maintenanceRepository,
            VehicleService vehicleService,
            MaintenanceTypeService maintenanceTypeService) {

        this.maintenanceRepository = maintenanceRepository;
        this.vehicleService = vehicleService;
        this.maintenanceTypeService = maintenanceTypeService;
    }

    //Grab list of the maintenance
    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    //grab by ID
    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Maintenance record not found!"
                ));
    }

    //Create it
    public Maintenance createMaintenance(Maintenance maintenance) {
        Vehicle vehicle = vehicleService.getVehicleById(
                maintenance.getVehicle().getId()
        );

        MaintenanceType maintenanceType =
                maintenanceTypeService.getMaintenanceTypeById(
                        maintenance.getMaintenanceType().getId()
                );

        maintenance.setVehicle(vehicle);
        maintenance.setMaintenanceType(maintenanceType);

        return maintenanceRepository.save(maintenance);
    }

    //Update maintenance
    public Maintenance updateMaintenance(
            Long id,
            Maintenance updatedMaintenance) {

        Maintenance maintenance = getMaintenanceById(id);

        Vehicle vehicle = vehicleService.getVehicleById(
                updatedMaintenance.getVehicle().getId()
        );

        MaintenanceType maintenanceType =
                maintenanceTypeService.getMaintenanceTypeById(
                        updatedMaintenance.getMaintenanceType().getId()
                );

        maintenance.setVehicle(vehicle);
        maintenance.setMaintenanceType(maintenanceType);
        maintenance.setDueDate(updatedMaintenance.getDueDate());
        maintenance.setDueMileage(updatedMaintenance.getDueMileage());
        maintenance.setCompletionDate(
                updatedMaintenance.getCompletionDate()
        );
        maintenance.setCompletionMileage(
                updatedMaintenance.getCompletionMileage()
        );
        maintenance.setCost(updatedMaintenance.getCost());
        maintenance.setStatus(updatedMaintenance.getStatus());
        maintenance.setNotes(updatedMaintenance.getNotes());

        return maintenanceRepository.save(maintenance);
    }

    //Delete maintenance
    public void deleteMaintenance(Long id) {
        Maintenance maintenance = getMaintenanceById(id);
        maintenanceRepository.delete(maintenance);
    }
}