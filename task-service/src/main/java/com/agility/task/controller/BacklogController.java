package com.agility.task.controller;

import com.agility.task.model.BacklogItem;
import com.agility.task.service.BacklogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/backlog")
public class BacklogController {

    private final BacklogService backlogService;

    public BacklogController(BacklogService backlogService) {
        this.backlogService = backlogService;
    }

    @GetMapping("/project/{projectId}")
    public List<BacklogItem> getBacklogByProjectId(@PathVariable Long projectId) {
        return backlogService.findByProjectId(projectId);
    }

    @PostMapping
    public BacklogItem addToBacklog(@RequestBody BacklogItem item) {
        return backlogService.addToBacklog(item);
    }

    @PutMapping("/{id}/reorder")
    public ResponseEntity<BacklogItem> reorder(@PathVariable Long id, @RequestParam Integer position) {
        return ResponseEntity.ok(backlogService.reorder(id, position));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromBacklog(@PathVariable Long id) {
        backlogService.removeFromBacklog(id);
        return ResponseEntity.noContent().build();
    }
}
