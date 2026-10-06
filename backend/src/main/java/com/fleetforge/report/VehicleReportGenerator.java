package com.fleetforge.report;

import com.fleetforge.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class VehicleReportGenerator implements ReportGenerator {

    private final VehicleRepository vehicleRepository;

    //Constructor
    public VehicleReportGenerator(
            VehicleRepository vehicleRepository) {

        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public Map<String, Object> generateReport() {
        Map<String, Object> report = new LinkedHashMap<>();

        report.put("title", "FleetForge Vehicle Report");
        report.put("generatedAt", LocalDateTime.now());
        report.put("rows", vehicleRepository.findAll());

        return report;
    }
}