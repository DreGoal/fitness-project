package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ACTIVITYAISERVICE activityaiservice;
    private final RecommendationRepository recommendationRepository;


    @KafkaListener(topics = "${kafka.topic.name}",groupId ="activity-processor-group" )
    public  void processActivity(Activity activity){
        log.info("Received activity for processing: {}", activity.getUserId());

        Recommendation recommendation=activityaiservice.generateRecommendation(activity);
        recommendationRepository.save(recommendation);

    }
}
