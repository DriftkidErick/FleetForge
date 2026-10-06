package com.fleetforge.controller;

import com.fleetforge.entity.MaintenanceType;
import com.fleetforge.service.MaintenanceTypeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-types")
public class MaintenanceTypeController {

    private final MaintenanceTypeService maintenanceTypeService;

    public MaintenanceTypeController(
            MaintenanceTypeService maintenanceTypeService) {

        this.maintenanceTypeService = maintenanceTypeService;
    }

    @GetMapping
    public List<MaintenanceType> getAllMaintenanceTypes() {
        return maintenanceTypeService.getAllMaintenanceTypes();
    }

    @GetMapping("/{id}")
    public MaintenanceType getMaintenanceTypeById(
            @PathVariable Long id) {

        return maintenanceTypeService.getMaintenanceTypeById(id);
    }

    @PostMapping
    public MaintenanceType createMaintenanceType(
            @Valid @RequestBody MaintenanceType maintenanceType) {

        return maintenanceTypeService.createMaintenanceType(maintenanceType);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenanceType(
            @PathVariable Long id) {

        maintenanceTypeService.deleteMaintenanceType(id);
        return ResponseEntity.noContent().build();
    }
}