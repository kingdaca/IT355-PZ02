package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Court;
import org.example.padelmaniacbackend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Integer> {

    Player findByUsername(String username);

    boolean existsByUsernameAndEmail(String username, String password);

    Player findById(Long userId);

}
