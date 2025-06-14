# Stage 1: Build the frontend
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend
FROM gradle:8.4.0-jdk17 AS builder
WORKDIR /app
COPY --from=frontend /app/frontend/dist /app/src/main/resources/static
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
COPY src ./src
RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon

# Stage 3: Create the final image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/mockgovsim-0.0.1-SNAPSHOT.jar /app/application.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "/app/application.jar", "--spring.profiles.active=prod"] 