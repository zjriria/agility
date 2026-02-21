package com.agility.project.controller;

import com.agility.project.model.Project;
import com.agility.project.model.Sprint;
import com.agility.project.service.ProjectService;
import com.agility.project.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;
    private final SprintService sprintService;

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        return ResponseEntity.ok(projectService.updateProject(id, project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/sprints")
    public ResponseEntity<Sprint> createSprint(@PathVariable Long id, @RequestBody Sprint sprint) {
        return ResponseEntity.ok(sprintService.createSprint(id, sprint));
    }

    @GetMapping("/{id}/sprints")
    public ResponseEntity<List<Sprint>> getSprintsByProject(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.getSprintsByProject(id));
    }
}
