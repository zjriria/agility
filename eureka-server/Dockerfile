FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy parent pom and install it
COPY pom.xml ./pom.xml
RUN mvn dependency:go-offline -N

# Copy module pom and source
COPY eureka-server/pom.xml ./eureka-server/pom.xml
COPY eureka-server/src ./eureka-server/src

# Build the module
WORKDIR /app/eureka-server
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/eureka-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
