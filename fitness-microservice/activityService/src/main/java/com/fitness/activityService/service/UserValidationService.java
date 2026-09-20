package com.fitness.activityService.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {

    private final WebClient userServiceWebClient;

    public boolean validateUser(String id) {
        try {
            Boolean result = userServiceWebClient.get()
                    .uri("/api/users/{id}/validate", id)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

            return Boolean.TRUE.equals(result);

        } catch (WebClientResponseException e) {
            log.error(
                    "User validation failed. status={}, body={}",
                    e.getStatusCode(),
                    e.getResponseBodyAsString(),
                    e
            );
            return false;

        } catch (Exception e) {
            log.error("Error calling User Service for userId={}", id, e);
            return false;
        }
    }
}