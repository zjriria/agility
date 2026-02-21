package com.agility.project.service;

import com.agility.project.model.Sprint;
import com.agility.project.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SprintService {

    private final SprintRepository sprintRepository;

    public Sprint createSprint(Long projectId, Sprint sprint) {
        sprint.setProjectId(projectId);
        List<Sprint> existing = sprintRepository.findByProjectId(projectId);
        sprint.setNumber(existing.size() + 1);
        return sprintRepository.save(sprint);
    }

    public List<Sprint> getSprintsByProject(Long projectId) {
        return sprintRepository.findByProjectIdOrderByNumberAsc(projectId);
    }

    public Sprint getSprintById(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));
    }

    public Sprint updateSprint(Long id, Sprint updatedSprint) {
        Sprint sprint = getSprintById(id);
        sprint.setGoal(updatedSprint.getGoal());
        sprint.setStartDate(updatedSprint.getStartDate());
        sprint.setEndDate(updatedSprint.getEndDate());
        sprint.setDurationWeeks(updatedSprint.getDurationWeeks());
        sprint.setStatus(updatedSprint.getStatus());
        return sprintRepository.save(sprint);
    }
}
