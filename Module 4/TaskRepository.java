package com.projectmanagementapp.backend.repository;

import com.projectmanagementapp.backend.model.TaskEntity;
import com.projectmanagementapp.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findByProject(Project project);
}
