package com.agility.project.service;

import com.agility.project.model.Sprint;
import com.agility.project.model.SprintStatus;
import com.agility.project.repository.SprintRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;

    public SprintService(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }

    public List<Sprint> findAll() {
        return sprintRepository.findAll();
    }

    public Optional<Sprint> findById(Long id) {
        return sprintRepository.findById(id);
    }

    public List<Sprint> findByProjectId(Long projectId) {
        return sprintRepository.findByProjectId(projectId);
    }

    public List<Sprint> findByStatus(SprintStatus status) {
        return sprintRepository.findByStatus(status);
    }

    public Sprint save(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    public Sprint update(Long id, Sprint sprint) {
        sprint.setId(id);
        return sprintRepository.save(sprint);
    }

    public void deleteById(Long id) {
        sprintRepository.deleteById(id);
    }
}
