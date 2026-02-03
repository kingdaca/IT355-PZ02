package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Offer;
import org.example.padelmaniacbackend.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Integer> {

    List<Offer> findByMatch(Match match);

    Offer findById(Long id);
}
