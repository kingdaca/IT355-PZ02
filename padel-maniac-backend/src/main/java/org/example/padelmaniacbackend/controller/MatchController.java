package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTO.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTO.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/match")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping("/create")
    public ResponseEntity<?> createMatch(@RequestBody CreateMatchDTO createMatchDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // 👈 USERNAME

        try {
            matchService.createNewMatch(createMatchDTO, username);
            return ResponseEntity.ok("ok");
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    }

    @GetMapping("/getMatches")
    public ResponseEntity<?> getAllMatches(){
        try {
            List<MatchDTO> matches = matchService.getMatches();
            return ResponseEntity.ok(matches);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    }
}
