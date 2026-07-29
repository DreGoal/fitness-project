package com.fitness.userservice.response;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserResponse {

    private String id;
    private String keyClockId;


    private  String firstName;
    private  String lastName;

    private  String email;
    private  String password;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;


}
