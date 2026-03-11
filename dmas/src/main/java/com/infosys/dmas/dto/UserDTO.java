package com.infosys.dmas.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
    private String location; // Renamed from 'area' to match User.java
}