package com.projectmanagementapp.backend.service;

import com.projectmanagementapp.backend.model.TaskEntity;
import com.projectmanagementapp.backend.model.Project;
import com.projectmanagementapp.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public TaskEntity create(TaskEntity t) { return taskRepository.save(t); }

    public List<TaskEntity> findByProject(Project p) { return taskRepository.findByProject(p); }

    public Optional<TaskEntity> get(Long id) { return taskRepository.findById(id); }

    public TaskEntity update(TaskEntity t) { return taskRepository.save(t); }

    public void delete(Long id) { taskRepository.deleteById(id); }
}
