# Simple Demo App for Chatting with a Cloud Model

A demonstration application consisting of an Angular chat client and a Spring Boot microservice that interfaces with Ollama's cloud-based LLM.

![A chat example](llmchat.png)

## Architecture

| Component | Description |
|-----------|-------------|
| **llm_chat_client** | Angular/Node.js chat client |
| **llm_microservice** | Spring Boot microservice that communicates with the Ollama cloud model "gpt-oss:120b" and streams responses to the client via SSE |

## How It Works

1. **Client → Microservice**: User submits a question via the Angular frontend
2. **Microservice → Cloud Model**: The microservice forwards the question to the Ollama API
3. **Cloud Model → Microservice → Client**: The response is streamed back using Server-Sent Events (SSE)

## Prerequisites

- Node.js (v18+)
- Java 17+ (for Spring Boot)
- An [Ollama](https://ollama.com) account (free) to obtain an API key

## Running Locally

### 1. Clone the repository

    git clone https://github.com/yourusername/your-repo.git
    cd your-repo

### 2. Set up environment variables

    export OLLAMA_API_KEY=your_api_key_here

### 3. Start the microservice

    cd llm_microservice
    ./mvnw spring-boot:run

### 4. Start the Angular client

    cd llm_chat_client
    npm install
    ng serve

### 5. Open the app

Navigate to `http://localhost:4200` in your browser.

## Production Readiness

**This demo is not production-ready!** Please address the following before deploying to production:

### Security Considerations

| Communication Path | Status |
|--------------------|--------|
| Microservice ↔ Ollama Cloud | ✅ Secured (JWT + TLS) |
| Frontend ↔ Microservice | ⚠️ Partially secured (JWT Cookie auth + CORS configured) |

> **Note on TLS:** This application is designed to be deployed on cloud platforms (e.g., [Render.com](https://render.com), Heroku, Railway) that provide TLS termination automatically. No additional TLS configuration is required when using such platforms.

### TODO

- [ ] Write tests
- [ ] Document the code
- [ ] Allow users to select from available cloud models
- [ ] Add conversation context (MCP functionality) — currently, the model has no memory of previous questions
- [ ] Improve UI/UX
- [ ] Implement conversation persistence (with appropriate security considerations)
- [ ] Add caching, preprocessing, and postprocessing
- [ ] Complete this documentation

## License

Add your license here

## Contributing

Add contribution guidelines here