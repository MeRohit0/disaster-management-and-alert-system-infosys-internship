package com.infosys.dmas.controller;

import org.springframework.web.bind.annotation.*;

import com.infosys.dmas.model.User;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/signin")
    public String UserSignUp(@RequestBody User user) {
        return "s";
    }
}
