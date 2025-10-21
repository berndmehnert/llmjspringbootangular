# Simple demo app for chatting with a cloud-model 

- llm_chat_client: Angular/nodejs chat client
- llm_microservice: Spring Boot microservice which asks the Ollama cloud-model "gpt-oss:120b" user questions and provides the client with the answers. Since an answer might be long, answers are given as streams
- To run the microservice, one needs to register at ollama.com (which is free) and get an API_KEY and provide this key as an environment variable, details follow ... 

TODOs:
- Write tests
- Let user choose between all the cloud-models
- Add more MCP functionality, more context
- Save conversations to local storage 
- Add security, caching, ...
- Complete this page
