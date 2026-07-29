package com.fitness.userservice.Services;

import com.fitness.userservice.repository.UserRepository;
import com.fitness.userservice.request.UserRequest;
import com.fitness.userservice.response.UserResponse;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import com.fitness.userservice.models.User;
@Service
@AllArgsConstructor
public class UserService {


    private final UserRepository userRepository;

    public UserResponse register(UserRequest userRequest) {
        if(userRepository.existsByEmail(userRequest.getEmail())) {
//            throw new RuntimeException("Email already exist");
            User existingUser=userRepository.findByEmail(userRequest.getEmail());
            UserResponse userResponse=new UserResponse();
            userResponse.setId(existingUser.getId());
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setPassword(existingUser.getPassword());
            userResponse.setCreateDate(existingUser.getCreatedDate());
            userResponse.setUpdateDate(existingUser.getUpdatedDate());
        }
        User user=new User();
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());
        user.setKeyClockId(userRequest.getKeyClockId());

        userRepository.save(user);
        UserResponse userResponse=new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setKeyClockId(user.getKeyClockId());
        userResponse.setLastName(user.getLastName());
        userResponse.setPassword(user.getPassword());
        userResponse.setCreateDate(user.getCreatedDate());
        userResponse.setUpdateDate(user.getUpdatedDate());

        return userResponse;


    }

    public UserResponse getUserProfile(String id) {
        User user=userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse userResponse=new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setPassword(user.getPassword());
        userResponse.setCreateDate(user.getCreatedDate());
        userResponse.setUpdateDate(user.getUpdatedDate());

        return userResponse;
    }

    public  boolean existByUserID(String id) {

        return userRepository.existsByKeyClockId(id);

    }
}
