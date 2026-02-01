package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.CourtOffer;
import org.example.padelmaniacbackend.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtOfferRepository extends JpaRepository<CourtOffer, Integer> {

    List<CourtOffer> findByMatch(Match match);
}
