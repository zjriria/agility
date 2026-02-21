package com.agility.timetracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class TimeTrackingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TimeTrackingServiceApplication.class, args);
    }
}
