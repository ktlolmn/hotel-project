package com.hotel.web.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String  email;
    private String password;
    private String name;
    private String phone;
}
