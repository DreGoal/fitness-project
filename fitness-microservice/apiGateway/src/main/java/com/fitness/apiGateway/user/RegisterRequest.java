package com.fitness.apiGateway.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private String keyClockId;

    @NotBlank(message = "first name is required")
    private  String firstName;
    private  String lastName;
    @Email(message="Invalid email format")
    private  String email;
    @NotBlank(message = "Password is required")
    @Size(min=6,message = "password must have atleast 6 character")
    private  String password;


}
