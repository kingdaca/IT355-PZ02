package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTOs.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        String username = auth.getName();

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

    @PostMapping("/joinToMatch")
    public ResponseEntity<?> joinToMatch(@RequestBody Long matchId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // 👈 USERNAME

        try{
            return ResponseEntity.ok(matchService.joinToMatch(matchId, username));
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    }

    @PostMapping("/matchDetails")
    public ResponseEntity<?> matchDetails(@RequestBody Long matchId){
        try{
            return ResponseEntity.ok(matchService.matchDetails(matchId));
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    }

    @PostMapping("/removeMatch")
    public ResponseEntity<?> removeMatch(@RequestBody Long matchId){
        try{
            return ResponseEntity.ok(matchService.removeMatch(matchId));
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    }

    @GetMapping("/getUpcomingMatches")
    public ResponseEntity<?> getUpcomingMatches(){
        try{
            return ResponseEntity.ok(matchService.getUpcomingMatches());
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    }
}
