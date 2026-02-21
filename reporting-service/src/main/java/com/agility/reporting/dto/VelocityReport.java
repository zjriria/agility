package com.agility.reporting.dto;

public class VelocityReport {

    private Long sprintId;
    private String sprintName;
    private Double completedStoryPoints;
    private Double committedStoryPoints;

    public VelocityReport() {
    }

    public VelocityReport(Long sprintId, String sprintName,
                          Double completedStoryPoints, Double committedStoryPoints) {
        this.sprintId = sprintId;
        this.sprintName = sprintName;
        this.completedStoryPoints = completedStoryPoints;
        this.committedStoryPoints = committedStoryPoints;
    }

    public Long getSprintId() {
        return sprintId;
    }

    public void setSprintId(Long sprintId) {
        this.sprintId = sprintId;
    }

    public String getSprintName() {
        return sprintName;
    }

    public void setSprintName(String sprintName) {
        this.sprintName = sprintName;
    }

    public Double getCompletedStoryPoints() {
        return completedStoryPoints;
    }

    public void setCompletedStoryPoints(Double completedStoryPoints) {
        this.completedStoryPoints = completedStoryPoints;
    }

    public Double getCommittedStoryPoints() {
        return committedStoryPoints;
    }

    public void setCommittedStoryPoints(Double committedStoryPoints) {
        this.committedStoryPoints = committedStoryPoints;
    }
}
