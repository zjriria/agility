package com.agility.task.repository;

import com.agility.task.model.Task;
import com.agility.task.model.TaskStatus;
import com.agility.task.model.TaskType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findBySprintId(Long sprintId);
    List<Task> findByAssigneeId(Long assigneeId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByType(TaskType type);
    List<Task> findByProjectIdAndSprintIdIsNull(Long projectId);
    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);
    List<Task> findByProjectIdAndSprintId(Long projectId, Long sprintId);
}
