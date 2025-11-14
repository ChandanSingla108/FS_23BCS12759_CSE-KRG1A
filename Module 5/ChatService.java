// src/main/java/com/projectmanagementapp/backend/service/ChatService.java
package com.projectmanagementapp.backend.service;

import com.projectmanagementapp.backend.model.ChatMessage;
import com.projectmanagementapp.backend.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public ChatMessage save(ChatMessage msg) {
        return chatRepository.save(msg);
    }

    public List<ChatMessage> getAll() {
        return chatRepository.findAll();
    }
}
