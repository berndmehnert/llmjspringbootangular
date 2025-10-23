package com.service.llm_microservice.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ChatService {

    private final WebClient webClient;
    private final String API_KEY;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatService(WebClient webClient, @Value("${ollama.api.key}") String apiKey) {
        this.webClient = webClient;
        this.API_KEY = apiKey;
    }

    public Flux<String> getChatResponseStream(String userMessage) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-oss:120b");
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", userMessage);
        requestBody.put("messages", new Map[]{message});
        requestBody.put("stream", true); // The corresponding API now supports streaming, the old code is commented out.

        String jsonRequestBody;
        try {
            jsonRequestBody = objectMapper.writeValueAsString(requestBody);
        } catch (JsonProcessingException e) {
            // If JSON processing fails, return a Flux that emits an error.
            return Flux.error(new RuntimeException("Error creating request JSON", e));
        }

        return this.webClient.post()
                .uri("/chat")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + API_KEY)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(jsonRequestBody)
                .retrieve()
                .onStatus(
                        statusCode -> statusCode.isError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new RuntimeException("Ollama API Error: " + errorBody)))
                )
                .bodyToFlux(String.class);
    }
}
