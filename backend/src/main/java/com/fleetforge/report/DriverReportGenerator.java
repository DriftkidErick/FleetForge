package com.fleetforge.report;

import com.fleetforge.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DriverReportGenerator implements ReportGenerator {

    private final DriverRepository driverRepository;

    //Constructor
    public DriverReportGenerator(
            DriverRepository driverRepository) {

        this.driverRepository = driverRepository;
    }

    @Override
    public Map<String, Object> generateReport() {
        Map<String, Object> report = new LinkedHashMap<>();

        report.put("title", "FleetForge Driver Report");
        report.put("generatedAt", LocalDateTime.now());
        report.put("rows", driverRepository.findAll());

        return report;
    }
}