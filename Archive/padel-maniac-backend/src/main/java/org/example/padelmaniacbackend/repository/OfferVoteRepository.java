package org.example.padelmaniacbackend.repository;

import lombok.extern.java.Log;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.OfferVote;
import org.example.padelmaniacbackend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OfferVoteRepository extends JpaRepository<OfferVote, Integer> {

    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN TRUE ELSE FALSE END " +
            "FROM OfferVote v " +
            "WHERE v.player.id = :playerId AND v.offer.match.id = :matchId")
    Boolean existsByPlayerAndMatch(
            @Param("playerId") Long playerId,
            @Param("matchId") Long matchId
    );

    @Query("SELECT COUNT (v) FROM OfferVote v WHERE v.offer.match.id =:matchId")
    Long countVotes(@Param("matchId") Long matchId);


}
