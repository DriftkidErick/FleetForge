package com.fleetforge.service;

import com.fleetforge.entity.Maintenance;
import com.fleetforge.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;

@Service
public class MaintenanceCSVService {

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceCSVService(
            MaintenanceRepository maintenanceRepository) {

        this.maintenanceRepository = maintenanceRepository;
    }

    // Creates a CSV report from the maintenance records
    public String createCsv() {
        StringBuilder csv = new StringBuilder();

        csv.append(
                "ID,Vehicle,Maintenance Type,Due Date," +
                        "Completion Date,Cost,Status,Notes\n"
        );

        for (Maintenance maintenance : maintenanceRepository.findAll()) {
            csv.append(maintenance.getId()).append(",");
            csv.append(maintenance.getVehicle().getRegNum()).append(",");
            csv.append(maintenance.getMaintenanceType().getName()).append(",");
            csv.append(maintenance.getDueDate()).append(",");
            csv.append(
                    maintenance.getCompletionDate() == null
                            ? ""
                            : maintenance.getCompletionDate()
            ).append(",");

            csv.append(
                    maintenance.getCost() == null
                            ? ""
                            : maintenance.getCost()
            ).append(",");
            csv.append(maintenance.getStatus()).append(",");
            csv.append(maintenance.getNotes()).append("\n");
        }

        return csv.toString();
    }
}