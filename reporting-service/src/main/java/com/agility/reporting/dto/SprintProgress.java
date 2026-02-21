package com.agility.reporting.dto;

public class SprintProgress {

    private Long sprintId;
    private String sprintName;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer inProgressTasks;
    private Integer todoTasks;
    private Double progressPercentage;

    public SprintProgress() {
    }

    public SprintProgress(Long sprintId, String sprintName, Integer totalTasks,
                          Integer completedTasks, Integer inProgressTasks,
                          Integer todoTasks, Double progressPercentage) {
        this.sprintId = sprintId;
        this.sprintName = sprintName;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.todoTasks = todoTasks;
        this.progressPercentage = progressPercentage;
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

    public Integer getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Integer getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Integer completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Integer getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(Integer inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public Integer getTodoTasks() {
        return todoTasks;
    }

    public void setTodoTasks(Integer todoTasks) {
        this.todoTasks = todoTasks;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
}
