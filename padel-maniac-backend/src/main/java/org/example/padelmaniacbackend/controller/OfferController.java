package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTOs.OfferDTO.CreatOfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteRequestDTO;
import org.example.padelmaniacbackend.service.OfferService;
import org.example.padelmaniacbackend.service.OfferVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/offer")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @Autowired
    private OfferVoteService offerVoteService;

    @PostMapping("/creatOffer")
    public ResponseEntity<?> createOffer(@RequestBody CreatOfferDTO creatOfferDTO){
        try {
            offerService.createOffer(creatOfferDTO);
            return ResponseEntity.ok("ok");
        }catch (Exception exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    };

    @PostMapping("/getOffersByMatchId")
    public ResponseEntity<?> getOffersByMatchId(@RequestBody Long matchId){
        try {
            return ResponseEntity.ok(offerService.findByMatchId(matchId));
        }catch (Exception exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    };

    @PostMapping("/vote")
    public ResponseEntity<?> vote(@RequestBody OfferVoteRequestDTO offerVoteRequestDTO){
        try {
            offerVoteService.vote(offerVoteRequestDTO);
            return ResponseEntity.ok("Success");
        }catch (Exception exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error");
        }
    };
}
