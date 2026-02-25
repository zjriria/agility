package com.agility.task.controller;

import com.agility.task.model.Task;
import com.agility.task.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getAll() {
        return taskService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        return taskService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getByProjectId(@PathVariable Long projectId) {
        return taskService.findByProjectId(projectId);
    }

    @GetMapping("/sprint/{sprintId}")
    public List<Task> getBySprintId(@PathVariable Long sprintId) {
        return taskService.findBySprintId(sprintId);
    }

    @GetMapping("/assignee/{assigneeId}")
    public List<Task> getByAssigneeId(@PathVariable Long assigneeId) {
        return taskService.findByAssigneeId(assigneeId);
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        return taskService.create(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task taskDetails) {
        return ResponseEntity.ok(taskService.update(id, taskDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
