package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Integer> {

    Match findById(Long id);
}
