package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTOs.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchIdDTO;
import org.example.padelmaniacbackend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/match")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping("/create")
    public ResponseEntity<?> createMatch(@RequestBody CreateMatchDTO createMatchDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        matchService.createNewMatch(createMatchDTO, username);
        return ResponseEntity.ok(ApiResponse.success("ok"));
    }

    @GetMapping("/getMatches")
    public ResponseEntity<?> getAllMatches(){
        return ResponseEntity.ok(ApiResponse.success(matchService.getMatches()));
    }

    @PostMapping("/joinToMatch")
    public ResponseEntity<?> joinToMatch(@RequestBody MatchIdDTO matchIdDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // 👈 USERNAME

        return ResponseEntity.ok(ApiResponse.success(matchService.joinToMatch(matchIdDTO.getMatchId(), username)));
    }

    @PostMapping("/matchDetails")
    public ResponseEntity<?> matchDetails(@RequestBody MatchIdDTO matchIdDTO){
        return ResponseEntity.ok(ApiResponse.success(matchService.matchDetails(matchIdDTO.getMatchId())));
    }

    @PostMapping("/removeMatch")
    public ResponseEntity<?> removeMatch(@RequestBody MatchIdDTO matchIdDTO){
        return ResponseEntity.ok(ApiResponse.success(matchService.removeMatch(matchIdDTO.getMatchId())));
    }

    @GetMapping("/getUpcomingMatches")
    public ResponseEntity<?> getUpcomingMatches(){
        return ResponseEntity.ok(ApiResponse.success(matchService.getUpcomingMatches()));
    }
}
