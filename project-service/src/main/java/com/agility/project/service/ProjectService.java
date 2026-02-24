package com.agility.project.service;

import com.agility.project.model.Project;
import com.agility.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }

    public Project update(Long id, Project project) {
        project.setId(id);
        return projectRepository.save(project);
    }

    public void deleteById(Long id) {
        projectRepository.deleteById(id);
    }
}
