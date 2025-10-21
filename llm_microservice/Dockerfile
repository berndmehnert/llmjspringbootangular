# Build stage
FROM jelastic/maven:3.9.5-openjdk-21 AS build
WORKDIR /app

# Copy the pom.xml file and the source code
COPY pom.xml .
COPY src ./src

# Run Maven to clean and build the project
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/llm_microservice-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
