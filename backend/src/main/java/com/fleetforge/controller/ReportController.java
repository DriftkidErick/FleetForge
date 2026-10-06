package com.fleetforge.controller;

import com.fleetforge.report.DriverReportGenerator;
import com.fleetforge.report.ReportGenerator;
import com.fleetforge.report.VehicleReportGenerator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final VehicleReportGenerator vehicleReportGenerator;
    private final DriverReportGenerator driverReportGenerator;

    //Constructor
    public ReportController(
            VehicleReportGenerator vehicleReportGenerator,
            DriverReportGenerator driverReportGenerator) {

        this.vehicleReportGenerator = vehicleReportGenerator;
        this.driverReportGenerator = driverReportGenerator;
    }


    @GetMapping("/vehicles")
    public Map<String, Object> generateVehicleReport() {
        return generateReport(vehicleReportGenerator);
    }

    @GetMapping("/drivers")
    public Map<String, Object> generateDriverReport() {
        return generateReport(driverReportGenerator);
    }

    private Map<String, Object> generateReport(
            ReportGenerator reportGenerator) {

        return reportGenerator.generateReport();
    }
}