package com.agility.timetracking.controller;

import com.agility.timetracking.model.TimeEntry;
import com.agility.timetracking.service.TimeEntryService;
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
@RequestMapping("/api/timetracking")
public class TimeEntryController {

    private final TimeEntryService timeEntryService;

    public TimeEntryController(TimeEntryService timeEntryService) {
        this.timeEntryService = timeEntryService;
    }

    @GetMapping
    public List<TimeEntry> getAll() {
        return timeEntryService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeEntry> getById(@PathVariable String id) {
        return timeEntryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<TimeEntry> getByUserId(@PathVariable Long userId) {
        return timeEntryService.findByUserId(userId);
    }

    @GetMapping("/task/{taskId}")
    public List<TimeEntry> getByTaskId(@PathVariable Long taskId) {
        return timeEntryService.findByTaskId(taskId);
    }

    @PostMapping
    public TimeEntry create(@RequestBody TimeEntry timeEntry) {
        return timeEntryService.create(timeEntry);
    }

    @PutMapping("/{id}")
    public TimeEntry update(@PathVariable String id, @RequestBody TimeEntry timeEntry) {
        return timeEntryService.update(id, timeEntry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        timeEntryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
