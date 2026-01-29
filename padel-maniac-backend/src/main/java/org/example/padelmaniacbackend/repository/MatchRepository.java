package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Integer> {
}
