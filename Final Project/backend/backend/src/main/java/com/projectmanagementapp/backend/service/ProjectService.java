package com.projectmanagementapp.backend.service;

import com.projectmanagementapp.backend.model.Project;
import com.projectmanagementapp.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    public Project create(Project project) {

        // ✅ Ensure teamMembers list is never null
        if (project.getTeamMembers() == null) {
            project.setTeamMembers(new ArrayList<>());
        }

        return projectRepository.save(project);
    }

    public List<Project> listAll() {
        return projectRepository.findAll();
    }

    public Optional<Project> get(Long id) {
        return projectRepository.findById(id);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    public Project update(Project project) {

        // ✅ Ensure list is valid during update also
        if (project.getTeamMembers() == null) {
            project.setTeamMembers(new ArrayList<>());
        }

        return projectRepository.save(project);
    }

    public List<Project> findByMember(String email) {
        return projectRepository.findByTeamMembersContaining(email);
    }
}
