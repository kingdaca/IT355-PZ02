package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.City;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Integer> {

    Match findById(Long id);

    List<Match> findByMatchDay(LocalDate matchDay);

    @Query("SELECT m FROM Match m WHERE m.matchDay >= :today and m.matchStatus = 'FULL' and m.location = :city")
    List<Match> findUpcomingMatches(@Param("today") LocalDate today,@Param("city") City city);

    @Query("SELECT DISTINCT m FROM Match m " +
            "LEFT JOIN FETCH m.players p " +
            "WHERE m.matchOrganizer.id = :userId OR p.id = :userId")
    List<Match> findMatchByUserId(@Param("userId") Long userId);

}
