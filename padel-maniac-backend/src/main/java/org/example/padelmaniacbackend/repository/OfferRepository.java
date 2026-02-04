package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Court;
import org.example.padelmaniacbackend.model.Offer;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface OfferRepository extends JpaRepository<Offer, Integer> {

    List<Offer> findByMatch(Match match);

    @Query("SELECT o FROM Offer o WHERE o.court.id = :courtId")
    List<Offer> findByCourtId(@Param("courtId") Long courtId);

    Offer findById(Long id);
}
