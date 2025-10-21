package com.service.llm_microservice.controller;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.service.llm_microservice.dto.ChatRequestDto;
import com.service.llm_microservice.service.ChatService;

import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
   private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@RequestBody ChatRequestDto request) {
        return chatService.getChatResponseStream(request.getUserMessage());
    }

    /*
    @PostMapping
    public ResponseEntity<String> chat(@RequestBody String userMessage) {
        try {
            String botResponse = chatService.getChatResponse(userMessage);
            return ResponseEntity.ok(botResponse);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    */
}
