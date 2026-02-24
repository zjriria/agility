FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy parent pom and install it
COPY pom.xml ./pom.xml
RUN mvn dependency:go-offline -N

# Copy module pom and source
COPY reporting-service/pom.xml ./reporting-service/pom.xml
COPY reporting-service/src ./reporting-service/src

# Build the module
WORKDIR /app/reporting-service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/reporting-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
