package com.agility.timetracking.controller;

import com.agility.timetracking.model.CapacityReport;
import com.agility.timetracking.service.CapacityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/capacity")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CapacityController {

    private final CapacityService capacityService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<CapacityReport> getUserCapacity(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Double weeklyCapacityHours) {
        return ResponseEntity.ok(capacityService.getUserCapacity(userId, startDate, endDate, weeklyCapacityHours));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<CapacityReport>> getTeamCapacity(
            @PathVariable Long teamId,
            @RequestParam List<Long> userIds,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(capacityService.getTeamCapacity(userIds, startDate, endDate));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<CapacityReport>> getAlerts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(capacityService.getAlerts(startDate, endDate));
    }
}
