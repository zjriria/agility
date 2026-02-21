package com.agility.project.controller;

import com.agility.project.model.Sprint;
import com.agility.project.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SprintController {

    private final SprintService sprintService;

    @GetMapping("/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.getSprintById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sprint> updateSprint(@PathVariable Long id, @RequestBody Sprint sprint) {
        return ResponseEntity.ok(sprintService.updateSprint(id, sprint));
    }
}
