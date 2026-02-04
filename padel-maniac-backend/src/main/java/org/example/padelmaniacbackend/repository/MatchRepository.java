package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Integer> {

    Match findById(Long id);

    @Query("SELECT m FROM Match m WHERE m.matchDay >= :today and m.matchStatus = 'FULL'")
    List<Match> findUpcomingMatches(@Param("today") LocalDate today);

}
