package com.fitness.userservice.controller;

import com.fitness.userservice.Services.UserService;
import com.fitness.userservice.request.UserRequest;
import com.fitness.userservice.response.UserResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRequest user) {
        return ResponseEntity.ok(userService.register(user));


    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @GetMapping("{id}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.existByUserID(id));
    }
}
