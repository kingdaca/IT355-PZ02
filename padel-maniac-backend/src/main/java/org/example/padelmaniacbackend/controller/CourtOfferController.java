package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTOs.CourtOfferDTO.CreatCourtOfferDTO;
import org.example.padelmaniacbackend.service.CourtOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/offer")
public class CourtOfferController {

    @Autowired
    private  CourtOfferService courtOfferService;

    @PostMapping("/creatOffer")
    public ResponseEntity<?> createOffer(@RequestBody CreatCourtOfferDTO creatCourtOfferDTO){
        try {
            courtOfferService.createOffer(creatCourtOfferDTO);
            return ResponseEntity.ok("ok");
        }catch (Exception exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    };

    @PostMapping("/getOffersByMatchId")
    public ResponseEntity<?> getOffersByMatchId(@RequestBody Long matchId){
        try {
            return ResponseEntity.ok(courtOfferService.findByMatchId(matchId));
        }catch (Exception exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    };
}
