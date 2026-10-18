# Builds the React frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# Builds the Spring Boot backend
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend

COPY backend/pom.xml ./
RUN mvn dependency:go-offline

COPY backend/src ./src

# Places the React production files inside Spring Boot
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests


# Runs the finished application
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]