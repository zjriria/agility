package com.agility.timetracking.controller;

import com.agility.timetracking.model.CapacityAlert;
import com.agility.timetracking.service.CapacityService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timetracking/capacity")
public class CapacityController {

    private final CapacityService capacityService;

    public CapacityController(CapacityService capacityService) {
        this.capacityService = capacityService;
    }

    @GetMapping("/individual")
    public Double calculateIndividualCapacity(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return capacityService.calculateIndividualCapacity(userId, startDate, endDate);
    }

    @GetMapping("/load-rate")
    public Double calculateLoadRate(
            @RequestParam Long userId,
            @RequestParam Double weeklyCapacityHours,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return capacityService.calculateLoadRate(userId, weeklyCapacityHours, startDate, endDate);
    }

    @PostMapping("/check-alerts")
    public ResponseEntity<CapacityAlert> checkLoadAlerts(
            @RequestParam Long userId,
            @RequestParam Long sprintId,
            @RequestParam Double weeklyCapacityHours,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        CapacityAlert alert = capacityService.checkLoadAlerts(userId, sprintId, weeklyCapacityHours, startDate, endDate);
        if (alert == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/alerts/user/{userId}")
    public List<CapacityAlert> getAlertsByUserId(@PathVariable Long userId) {
        return capacityService.getAlertsByUserId(userId);
    }

    @GetMapping("/alerts/sprint/{sprintId}")
    public List<CapacityAlert> getAlertsBySprintId(@PathVariable Long sprintId) {
        return capacityService.getAlertsBySprintId(sprintId);
    }
}
