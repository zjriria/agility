package com.agility.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service-auth", r -> r.path("/api/auth/**")
                        .uri("lb://user-service"))
                .route("user-service", r -> r.path("/api/users/**", "/api/teams/**")
                        .uri("lb://user-service"))
                .route("project-service-projects", r -> r.path("/api/projects/**")
                        .uri("lb://project-service"))
                .route("project-service-sprints", r -> r.path("/api/sprints/**")
                        .uri("lb://project-service"))
                .route("task-service-tasks", r -> r.path("/api/tasks/**")
                        .uri("lb://task-service"))
                .route("task-service-backlog", r -> r.path("/api/backlog/**")
                        .uri("lb://task-service"))
                .route("time-tracking-service-entries", r -> r.path("/api/time-entries/**")
                        .uri("lb://time-tracking-service"))
                .route("time-tracking-service-capacity", r -> r.path("/api/capacity/**")
                        .uri("lb://time-tracking-service"))
                .route("reporting-service", r -> r.path("/api/reports/**")
                        .uri("lb://reporting-service"))
                .build();
    }
}
