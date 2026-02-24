FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy parent pom and install it
COPY pom.xml ./pom.xml
RUN mvn dependency:go-offline -N

# Copy module pom and source
COPY api-gateway/pom.xml ./api-gateway/pom.xml
COPY api-gateway/src ./api-gateway/src

# Build the module
WORKDIR /app/api-gateway
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
