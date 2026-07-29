package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class ACTIVITYAISERVICE {

    private final GeminiService geminiService;
    private final ObjectMapper mapper;

    public Recommendation generateRecommendation(Activity activity) {

        String prompt=createPromptForActivity(activity);
        String aiResponse =geminiService.getRecommendation(prompt);
        log.info("Response from AI {}",aiResponse);

         return processAIResponse(activity,aiResponse);

    }

    private Recommendation processAIResponse(Activity activity, String aiResponse) {

        try{

            JsonNode root = mapper.readTree(aiResponse);

            String text = root.path("steps")
                    .get(1)
                    .path("content")
                    .get(0)
                    .path("text")
                    .asText();

            text = text.replace("```json", "")
                    .replace("```", "")
                    .trim();

            JsonNode ai = mapper.readTree(text);

            Recommendation recommendation = new Recommendation();

            recommendation.setActivityId(activity.getId());
            recommendation.setUserId(activity.getUserId());

            recommendation.setRecommendation(
                    ai.path("analysis").path("overall").asText());

            List<String> improvements = new ArrayList<>();
            for (JsonNode node : ai.path("improvments")) {
                improvements.add(node.path("recommendation").asText());
            }
            recommendation.setImprovements(improvements);

            List<String> suggestions = new ArrayList<>();
            for (JsonNode node : ai.path("suggestions")) {
                suggestions.add(node.path("description").asText());
            }
            recommendation.setSuggestions(suggestions);

            List<String> safety = new ArrayList<>();
            for (JsonNode node : ai.path("safety")) {
                safety.add(node.asText());
            }
            recommendation.setSafety(safety);
            log.info("Recommendation {}",recommendation);
            return recommendation;

        }catch(Exception e){
            log.error("Failed to process AI response", e);
            throw new RuntimeException("Failed to process AI response", e);
        }

    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
               Analyze this fitness activity and provide detailed recommendations int the following EXACT JSON format:
               {
                  "analysis":{
                        "overall": "Overall analysis here",
                        "pace":  "Pace analysis here",
                        "heartRate": "Heart rate analysis here",
                        "caloriesBurned":"Calories analysis here"
                  },
                  "improvments":[
                      {
                         "area": "Area name",
                         "recommendation": "Detailed recommendation"
                      }
                  ],
                  "suggestions":[
                       {
                          "workout":"Workout name",
                          "description": "Detailed workout description"
                       }
                  ],
                  "safety": [
                      {
                        "Safety point 1",
                        "Safety point 2",
                      }
                  ]
               }
               
               Analyze this activity:
               Activity Type: %s
               Duration: %d minutes
               Calories Burned: %d
               Additional Metrics: %s
               
               Provide detailed analysis focusing on performance,improvements,next workout suggestion, and safety guidelines.
               Ensure the response follows the EXACT JSON format shown above.
               """,
                   activity.getType(),
                   activity.getDuration(),
                   activity.getCaloriesBurned(),
                   activity.getAdditionalMetrices()
               );
    }
}
