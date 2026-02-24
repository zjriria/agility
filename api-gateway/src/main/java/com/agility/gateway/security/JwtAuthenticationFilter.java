package com.agility.gateway.security;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange);
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                return onError(exchange);
            }

            String username = jwtUtil.extractUsername(token);
            List<String> roles = jwtUtil.extractRoles(token);

            ServerWebExchange modifiedExchange = exchange.mutate()
                    .request(r -> r
                            .header("X-User-Username", username)
                            .header("X-User-Roles", roles != null ? String.join(",", roles) : ""))
                    .build();

            return chain.filter(modifiedExchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
    }
}
