package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTO.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/match")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping("/create")
    public ResponseEntity<?> createMatch(@RequestBody CreateMatchDTO createMatchDTO){


        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // 👈 USERNAME

        createMatchDTO.setUsername(username);
        try {
            matchService.createNewMatch(createMatchDTO);
            return ResponseEntity.ok("ok");
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    }
}
