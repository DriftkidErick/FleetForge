package com.fleetforge.controller;

import com.fleetforge.service.MaintenanceCSVService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class MaintenanceCSVController {

    private final MaintenanceCSVService maintenanceCSVService;

    public MaintenanceCSVController(
            MaintenanceCSVService maintenanceCSVService) {

        this.maintenanceCSVService = maintenanceCSVService;
    }

    // Downloads the maintenance records as a CSV file
    @GetMapping("/maintenance/csv")
    public ResponseEntity<String> downloadMaintenanceCsv() {
        String csv = maintenanceCSVService.createCsv();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=maintenance-report.csv"
                )
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        "text/csv"
                )
                .body(csv);
    }
}