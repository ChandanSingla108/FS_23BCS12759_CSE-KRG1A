package com.projectmanagementapp.backend.controller;

import com.projectmanagementapp.backend.model.Project;
import com.projectmanagementapp.backend.model.TaskEntity;
import com.projectmanagementapp.backend.service.ProjectService;
import com.projectmanagementapp.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173") // allow React dev server
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    // Create project
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        Project saved = projectService.create(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // List all projects (manager) OR you can pass ?member=email to filter
    @GetMapping
    public ResponseEntity<List<Project>> listProjects(@RequestParam(required = false) String member) {
        if (member != null && !member.isBlank()) {
            return ResponseEntity.ok(projectService.findByMember(member));
        }
        return ResponseEntity.ok(projectService.listAll());
    }

    // Get project with its tasks
    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Long id) {
        Optional<Project> p = projectService.get(id);
        if (p.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");

        Project project = p.get();
        List<TaskEntity> tasks = taskService.findByProject(project);
        // return project + tasks in a small object
        return ResponseEntity.ok(new ProjectWithTasks(project, tasks));
    }

    // Update project (e.g., change members)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project update) {
        Optional<Project> p = projectService.get(id);
        if (p.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        Project project = p.get();
        project.setName(update.getName());
        project.setDescription(update.getDescription());
        project.setTeamMembers(update.getTeamMembers());
        Project saved = projectService.update(project);
        return ResponseEntity.ok(saved);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.ok().build();
    }

    // Tasks: create
    @PostMapping("/{id}/tasks")
    public ResponseEntity<?> createTask(@PathVariable Long id, @RequestBody TaskEntity request) {
        Optional<Project> p = projectService.get(id);
        if (p.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        request.setProject(p.get());
        TaskEntity saved = taskService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Update task
    @PutMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody TaskEntity request) {
        Optional<TaskEntity> tOpt = taskService.get(taskId);
        if (tOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        TaskEntity t = tOpt.get();
        t.setTitle(request.getTitle());
        t.setDescription(request.getDescription());
        t.setStatus(request.getStatus());
        t.setAssignee(request.getAssignee());
        TaskEntity saved = taskService.update(t);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        taskService.delete(taskId);
        return ResponseEntity.ok().build();
    }

    // Helper DTO
    public static record ProjectWithTasks(Project project, List<TaskEntity> tasks) {}
}
