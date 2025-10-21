package com.service.llm_microservice.dto;


public class ChatRequestDto {
    private String userMessage;

    public String getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }
}