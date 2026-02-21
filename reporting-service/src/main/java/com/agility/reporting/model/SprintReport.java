package com.agility.reporting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SprintReport {

    private Long sprintId;
    private String sprintGoal;
    private Integer sprintNumber;
    private int totalTasks;
    private int completedTasks;
    private int inProgressTasks;
    private int todoTasks;
    private double completionRate;
    private double totalEstimation;
    private double completedEstimation;
    private Map<String, Long> tasksByType;
    private Map<String, Long> tasksByPriority;
    private List<Long> teamMemberIds;
}
