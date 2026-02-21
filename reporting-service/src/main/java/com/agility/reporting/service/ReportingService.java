package com.agility.reporting.service;

import com.agility.reporting.model.BurndownData;
import com.agility.reporting.model.SprintReport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportingService {

    private final WebClient.Builder webClientBuilder;

    public SprintReport getSprintReport(Long sprintId) {
        SprintReport report = new SprintReport();
        report.setSprintId(sprintId);
        report.setTotalTasks(0);
        report.setCompletedTasks(0);
        report.setInProgressTasks(0);
        report.setTodoTasks(0);
        report.setCompletionRate(0.0);
        report.setTotalEstimation(0.0);
        report.setCompletedEstimation(0.0);
        report.setTasksByType(new HashMap<>());
        report.setTasksByPriority(new HashMap<>());
        return report;
    }

    public BurndownData getBurndownData(Long sprintId) {
        BurndownData data = new BurndownData();
        data.setSprintId(sprintId);
        data.setSprintStartDate(LocalDate.now().minusDays(14));
        data.setSprintEndDate(LocalDate.now());
        data.setTotalStoryPoints(50.0);

        List<BurndownData.BurndownPoint> ideal = new ArrayList<>();
        List<BurndownData.BurndownPoint> actual = new ArrayList<>();

        LocalDate start = data.getSprintStartDate();
        LocalDate end = data.getSprintEndDate();
        long totalDays = start.until(end).getDays();
        double dailyBurn = data.getTotalStoryPoints() / totalDays;

        double remaining = data.getTotalStoryPoints();
        double actualRemaining = data.getTotalStoryPoints();
        Random random = new Random(sprintId);

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            ideal.add(new BurndownData.BurndownPoint(date, remaining));
            actualRemaining -= dailyBurn * (0.5 + random.nextDouble());
            actual.add(new BurndownData.BurndownPoint(date, Math.max(0, actualRemaining)));
            remaining -= dailyBurn;
        }

        data.setIdealBurndown(ideal);
        data.setActualBurndown(actual);
        return data;
    }

    public List<Map<String, Object>> getVelocity(Long projectId) {
        List<Map<String, Object>> velocity = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            Map<String, Object> sprintVelocity = new HashMap<>();
            sprintVelocity.put("sprintNumber", i);
            sprintVelocity.put("projectId", projectId);
            sprintVelocity.put("completedPoints", 0);
            sprintVelocity.put("plannedPoints", 0);
            velocity.add(sprintVelocity);
        }
        return velocity;
    }

    public List<Map<String, Object>> getCapacityReport(Long projectId) {
        List<Map<String, Object>> capacity = new ArrayList<>();
        Map<String, Object> report = new HashMap<>();
        report.put("projectId", projectId);
        report.put("totalAvailableHours", 0.0);
        report.put("totalLoggedHours", 0.0);
        report.put("loadRate", 0.0);
        capacity.add(report);
        return capacity;
    }

    public byte[] exportReport(Long sprintId, String format) {
        String content = String.format("Sprint Report for Sprint %d (format: %s)\n" +
                "Generated on: %s\n", sprintId, format, LocalDate.now());
        return content.getBytes();
    }
}
