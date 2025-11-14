// src/main/java/com/projectmanagementapp/backend/repository/ChatRepository.java
package com.projectmanagementapp.backend.repository;

import com.projectmanagementapp.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<ChatMessage, Long> {}
