package com.agility.reporting.controller;

import com.agility.reporting.model.BurndownData;
import com.agility.reporting.model.SprintReport;
import com.agility.reporting.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportingService reportingService;

    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<SprintReport> getSprintReport(@PathVariable Long sprintId) {
        return ResponseEntity.ok(reportingService.getSprintReport(sprintId));
    }

    @GetMapping("/burndown/{sprintId}")
    public ResponseEntity<BurndownData> getBurndownData(@PathVariable Long sprintId) {
        return ResponseEntity.ok(reportingService.getBurndownData(sprintId));
    }

    @GetMapping("/velocity/{projectId}")
    public ResponseEntity<List<Map<String, Object>>> getVelocity(@PathVariable Long projectId) {
        return ResponseEntity.ok(reportingService.getVelocity(projectId));
    }

    @GetMapping("/capacity/{projectId}")
    public ResponseEntity<List<Map<String, Object>>> getCapacityReport(@PathVariable Long projectId) {
        return ResponseEntity.ok(reportingService.getCapacityReport(projectId));
    }

    @GetMapping("/export/{sprintId}")
    public ResponseEntity<byte[]> exportReport(
            @PathVariable Long sprintId,
            @RequestParam(defaultValue = "pdf") String format) {
        byte[] data = reportingService.exportReport(sprintId, format);
        String contentType = "excel".equalsIgnoreCase(format)
                ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : "application/pdf";
        String filename = "sprint-report-" + sprintId + ("excel".equalsIgnoreCase(format) ? ".xlsx" : ".pdf");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }
}
