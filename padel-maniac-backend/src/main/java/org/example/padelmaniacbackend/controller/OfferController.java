package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTOs.OfferDTO.CanceorAcceptlOfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferDTO.CreatOfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferDTO.GetOffersForCourtDTO;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteRequestDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchIdDTO;
import org.example.padelmaniacbackend.service.OfferService;
import org.example.padelmaniacbackend.service.OfferVoteService;
import org.springframework.beans.factory.annotation.Autowired;
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
            offerService.createOffer(creatOfferDTO);
            return ResponseEntity.ok(ApiResponse.success("ok"));
    };

    @PostMapping("/getOffersByMatchId")
    public ResponseEntity<?> getOffersByMatchId(@RequestBody MatchIdDTO matchIdDTO){
        return ResponseEntity.ok(ApiResponse.success(offerService.findByMatchId(matchIdDTO.getMatchId())));
    };

    @PostMapping("/vote")
    public ResponseEntity<?> vote(@RequestBody OfferVoteRequestDTO offerVoteRequestDTO){
        offerVoteService.vote(offerVoteRequestDTO);
        return ResponseEntity.ok(
                ApiResponse.success("Uspešno ste glasali")
        );
    };

    @PostMapping("/getOffersForCourt")
    public ResponseEntity<?> getOffersForCourt(@RequestBody GetOffersForCourtDTO getOffersForCourtDTO) throws Throwable {
        return ResponseEntity.ok(
                ApiResponse.success(offerService.findByCourtId(getOffersForCourtDTO.getPlayerId()))
        );
    };

    @PostMapping("/cancelOffer")
    public ResponseEntity<?> cancelOffer(@RequestBody CanceorAcceptlOfferDTO cancelOfferDTO){
        return ResponseEntity.ok(
                ApiResponse.success(offerService.cancelOffer(cancelOfferDTO.getOfferId()))
        );
    };

    @PostMapping("/confirmOffer")
    public ResponseEntity<?> confirmOffer(@RequestBody CanceorAcceptlOfferDTO cancelOfferDTO){
        System.out.println(cancelOfferDTO.getOfferId());
        return ResponseEntity.ok(
                ApiResponse.success(offerService.confirmOffer(cancelOfferDTO.getOfferId()))
        );
    };


}
