package org.example.padelmaniacbackend.controller;

import lombok.extern.java.Log;
import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.registration.CourtOwnerRegistrationDTO;
import org.example.padelmaniacbackend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/court")
public class CourtController {

    @Autowired
    private CourtService courtService;

    @GetMapping("/getCourts")
    public ResponseEntity<?> getAllCities(){
        return ResponseEntity.ok(courtService.getAllCourts());
    }

    @PostMapping("/getMyCourtInfo")
    public ResponseEntity<?> getMyCourtInfo(@RequestBody Long playerId){
        return ResponseEntity.ok(ApiResponse.success(courtService.getCourtInfoByPlayerId(playerId)));
    }


    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/registration")
    public ResponseEntity<?> courtRegistration(@RequestBody CourtOwnerRegistrationDTO courtOwnerRegistrationDTO){
        try {
            return ResponseEntity.ok(courtService.registerCourt(courtOwnerRegistrationDTO));
        }catch (Exception exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    };
}
