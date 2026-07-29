package com.fitness.activityService.service;


import com.fitness.activityService.dto.ActivityRequest;
import com.fitness.activityService.dto.ActivityResponse;
import com.fitness.activityService.models.Activity;
import com.fitness.activityService.repository.ActivityRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String, Activity> kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;

   public ActivityResponse trackActivity(ActivityRequest activityRequest){

       boolean isValidUser=userValidationService.validateUser(activityRequest.getUserId());

       if(!isValidUser){
           throw new RuntimeException("Invalid User: "+activityRequest.getUserId());
       }
       Activity activity=Activity.builder()
               .userId(activityRequest.getUserId())
               .type(activityRequest.getType())
               .duration(activityRequest.getDuration())
               .caloriesBurned(activityRequest.getCaloriesBurned())
               .startTime(activityRequest.getStartTime())
               .additionalMetrices(activityRequest.getAdditionalMetrices())
               .build();

       Activity savedActivity= activityRepository.save(activity);
       try{
           kafkaTemplate.send(topicName,savedActivity.getUserId(),savedActivity);

       }catch(Exception e){
           e.printStackTrace();
       }

       return mapToResponse(savedActivity);
   }

    private ActivityResponse mapToResponse(Activity savedActivity) {
       ActivityResponse activityResponse=new ActivityResponse();
        activityResponse.setId(savedActivity.getId());
        activityResponse.setUserId(savedActivity.getUserId());
        activityResponse.setType(savedActivity.getType());
        activityResponse.setDuration(savedActivity.getDuration());
        activityResponse.setCaloriesBurned(savedActivity.getCaloriesBurned());
        activityResponse.setStartTime(savedActivity.getStartTime());
        activityResponse.setAdditionalMetrices(savedActivity.getAdditionalMetrices());
        activityResponse.setCreatedAt(savedActivity.getCreatedAt());
        activityResponse.setUpdatedAt(savedActivity.getUpdatedAt());

        return activityResponse;
    }

    public List<ActivityResponse>  getUserActivities(String userId) {
         List<Activity>activityList= activityRepository.findByUserId(userId);
         return activityList.stream()
                 .map(this::mapToResponse)
                 .collect(Collectors.toList());

    }
}
