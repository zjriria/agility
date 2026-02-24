package com.agility.reporting.controller;

import com.agility.reporting.dto.BurndownPoint;
import com.agility.reporting.dto.SprintProgress;
import com.agility.reporting.dto.TeamWorkloadReport;
import com.agility.reporting.dto.VelocityReport;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @GetMapping("/sprint/{sprintId}/progress")
    public SprintProgress getSprintProgress(@PathVariable Long sprintId) {
        return new SprintProgress(sprintId, "Sprint " + sprintId, 20, 8, 5, 7, 40.0);
    }

    @GetMapping("/sprint/{sprintId}/burndown")
    public List<BurndownPoint> getBurndownChart(@PathVariable Long sprintId) {
        LocalDate start = LocalDate.now().minusDays(4);
        return List.of(
                new BurndownPoint(start, 50.0, 50.0),
                new BurndownPoint(start.plusDays(1), 45.0, 40.0),
                new BurndownPoint(start.plusDays(2), 35.0, 30.0),
                new BurndownPoint(start.plusDays(3), 28.0, 20.0),
                new BurndownPoint(start.plusDays(4), 18.0, 10.0)
        );
    }

    @GetMapping("/sprint/{sprintId}/velocity")
    public VelocityReport getVelocity(@PathVariable Long sprintId) {
        return new VelocityReport(sprintId, "Sprint " + sprintId, 34.0, 40.0);
    }

    @GetMapping("/team/{projectId}/workload")
    public List<TeamWorkloadReport> getTeamWorkload(@PathVariable Long projectId) {
        return List.of(
                new TeamWorkloadReport(1L, "alice", 32.0, 40.0, 80.0),
                new TeamWorkloadReport(2L, "bob", 28.0, 40.0, 70.0),
                new TeamWorkloadReport(3L, "charlie", 40.0, 40.0, 100.0)
        );
    }
}
