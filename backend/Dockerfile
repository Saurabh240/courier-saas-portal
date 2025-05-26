# backend/Dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

COPY target/courier-saas-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]