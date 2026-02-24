FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy parent pom and install it
COPY pom.xml ./pom.xml
RUN mvn dependency:go-offline -N

# Copy module pom and source
COPY timetracking-service/pom.xml ./timetracking-service/pom.xml
COPY timetracking-service/src ./timetracking-service/src

# Build the module
WORKDIR /app/timetracking-service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/timetracking-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
