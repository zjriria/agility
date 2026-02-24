package com.agility.project.controller;

import com.agility.project.model.Sprint;
import com.agility.project.service.SprintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @GetMapping
    public List<Sprint> getAll() {
        return sprintService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sprint> getById(@PathVariable Long id) {
        return sprintService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public List<Sprint> getByProjectId(@PathVariable Long projectId) {
        return sprintService.findByProjectId(projectId);
    }

    @PostMapping
    public Sprint create(@RequestBody Sprint sprint) {
        return sprintService.save(sprint);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sprint> update(@PathVariable Long id, @RequestBody Sprint sprint) {
        return sprintService.findById(id)
                .map(existing -> ResponseEntity.ok(sprintService.update(id, sprint)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return sprintService.findById(id)
                .map(existing -> {
                    sprintService.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
