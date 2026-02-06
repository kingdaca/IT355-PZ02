package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTOs.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchIdDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchUnsubscribeOrJoinDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.UpcomingMatchRequestDTO;
import org.example.padelmaniacbackend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/match")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('PLAYERS')")
    public ResponseEntity<?> createMatch(@RequestBody CreateMatchDTO createMatchDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        matchService.createNewMatch(createMatchDTO, username);
        return ResponseEntity.ok(ApiResponse.success("ok"));
    }

    @GetMapping("/getMatches/{localDate}")
    public ResponseEntity<?> getAllMatches(@PathVariable LocalDate localDate){
        return ResponseEntity.ok(ApiResponse.success(matchService.getMatches(localDate)));
    }


    @GetMapping("/getMyMatches/{userId}")
    public ResponseEntity<?> getMyMatches(@PathVariable Long userId){
        return ResponseEntity.ok(ApiResponse.success(matchService.getMyMatches(userId)));
    }

    @PostMapping("/joinToMatch")
    @PreAuthorize("hasAnyRole('PLAYERS')")
    public ResponseEntity<?> joinToMatch(@RequestBody MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // 👈 USERNAME

        return ResponseEntity.ok(ApiResponse.success(matchService.joinToMatch(matchUnsubscribeOrJoinDTO)));
    }

    @PostMapping("/requestForMatch")
    @PreAuthorize("hasAnyRole('PLAYERS')")
    public ResponseEntity<?> requestForMatch(@RequestBody MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO){

        return ResponseEntity.ok(ApiResponse.success(matchService.requestForMatch(matchUnsubscribeOrJoinDTO)));
    }

    @PostMapping("/rejectRequest")
    @PreAuthorize("hasAnyRole('PLAYERS')")
    public ResponseEntity<?> rejectRequest(@RequestBody MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO){

        return ResponseEntity.ok(ApiResponse.success(matchService.rejectRequest(matchUnsubscribeOrJoinDTO)));
    }

    @PostMapping("/matchDetails")
    public ResponseEntity<?> matchDetails(@RequestBody MatchIdDTO matchIdDTO){
        return ResponseEntity.ok(ApiResponse.success(matchService.matchDetails(matchIdDTO.getMatchId())));
    }

    @PostMapping("/removeMatch")
    @PreAuthorize("hasAnyRole('PLAYERS')")
    public ResponseEntity<?> removeMatch(@RequestBody MatchIdDTO matchIdDTO){
        return ResponseEntity.ok(ApiResponse.success(matchService.removeMatch(matchIdDTO.getMatchId())));
    }

    @PostMapping("/matchUnsubscribe")
    @PreAuthorize("hasAnyRole('PLAYERS')")
    public ResponseEntity<?> matchUnsubscribe(@RequestBody MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO){
        return ResponseEntity.ok(ApiResponse.success(matchService.matchUnsubscribe(matchUnsubscribeOrJoinDTO)));
    }


    @PostMapping("/getUpcomingMatches")
    @PreAuthorize("hasAnyRole('COURT_OWNER')")
    public ResponseEntity<?> getUpcomingMatches(@RequestBody UpcomingMatchRequestDTO upcomingMatchRequestDTO){
        return ResponseEntity.ok(ApiResponse.success(matchService.getUpcomingMatches(upcomingMatchRequestDTO.getPlayerId())));
    }
}
