package com.agility.task.service;

import com.agility.task.model.Task;
import com.agility.task.model.TaskStatus;
import com.agility.task.model.TaskType;
import com.agility.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Task createTask(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(Long projectId, Long sprintId, Long assigneeId,
                                  TaskStatus status, TaskType type) {
        if (projectId != null && sprintId != null) {
            return taskRepository.findByProjectIdAndSprintId(projectId, sprintId);
        }
        if (projectId != null && status != null) {
            return taskRepository.findByProjectIdAndStatus(projectId, status);
        }
        if (projectId != null) {
            return taskRepository.findByProjectId(projectId);
        }
        if (sprintId != null) {
            return taskRepository.findBySprintId(sprintId);
        }
        if (assigneeId != null) {
            return taskRepository.findByAssigneeId(assigneeId);
        }
        if (status != null) {
            return taskRepository.findByStatus(status);
        }
        if (type != null) {
            return taskRepository.findByType(type);
        }
        return taskRepository.findAll();
    }

    public Task getTaskById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    public Task updateTask(String id, Task updatedTask) {
        Task task = getTaskById(id);
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setType(updatedTask.getType());
        task.setStatus(updatedTask.getStatus());
        task.setPriority(updatedTask.getPriority());
        task.setEstimation(updatedTask.getEstimation());
        task.setAssigneeId(updatedTask.getAssigneeId());
        task.setSprintId(updatedTask.getSprintId());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getBacklog(Long projectId) {
        return taskRepository.findByProjectIdAndSprintIdIsNull(projectId);
    }
}
