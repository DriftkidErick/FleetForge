package com.fleetforge.service;

import com.fleetforge.entity.MaintenanceType;
import com.fleetforge.repository.MaintenanceTypeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MaintenanceTypeService {

    private final MaintenanceTypeRepository maintenanceTypeRepository;

    //Constructor
    public MaintenanceTypeService(
            MaintenanceTypeRepository maintenanceTypeRepository) {

        this.maintenanceTypeRepository = maintenanceTypeRepository;
    }

    //Gets all the maintenance types
    public List<MaintenanceType> getAllMaintenanceTypes() {
        return maintenanceTypeRepository.findAll();
    }

    //Gets the typed by the ID
    public MaintenanceType getMaintenanceTypeById(Long id) {
        return maintenanceTypeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Maintenance type not found!"
                ));
    }

    //Create the type
    public MaintenanceType createMaintenanceType(
            MaintenanceType maintenanceType) {

        return maintenanceTypeRepository.save(maintenanceType);
    }

    //Delete the type
    public void deleteMaintenanceType(Long id) {
        MaintenanceType maintenanceType = getMaintenanceTypeById(id);
        maintenanceTypeRepository.delete(maintenanceType);
    }
}