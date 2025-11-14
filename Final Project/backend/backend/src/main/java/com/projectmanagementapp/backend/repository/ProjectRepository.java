package com.projectmanagementapp.backend.repository;

import com.projectmanagementapp.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Helper to find projects where a team member's email is in teamMembers
    List<Project> findByTeamMembersContaining(String email);
}
