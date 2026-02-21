package com.agility.task.controller;

import com.agility.task.model.Task;
import com.agility.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/backlog")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BacklogController {

    private final TaskService taskService;

    @GetMapping("/{projectId}")
    public ResponseEntity<List<Task>> getBacklog(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getBacklog(projectId));
    }
}
