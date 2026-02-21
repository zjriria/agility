package com.agility.project.service;

import com.agility.project.model.Project;
import com.agility.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project project = getProjectById(id);
        project.setName(updatedProject.getName());
        project.setDescription(updatedProject.getDescription());
        project.setMethodology(updatedProject.getMethodology());
        project.setTheoreticalCapacity(updatedProject.getTheoreticalCapacity());
        project.setStartDate(updatedProject.getStartDate());
        project.setEndDate(updatedProject.getEndDate());
        project.setProductOwnerId(updatedProject.getProductOwnerId());
        project.setScrumMasterId(updatedProject.getScrumMasterId());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
