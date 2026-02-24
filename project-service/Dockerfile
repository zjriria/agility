FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy parent pom and install it
COPY pom.xml ./pom.xml
RUN mvn dependency:go-offline -N

# Copy module pom and source
COPY project-service/pom.xml ./project-service/pom.xml
COPY project-service/src ./project-service/src

# Build the module
WORKDIR /app/project-service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/project-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
