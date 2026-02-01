package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Integer> {

    Player findByUsername(String username);

    boolean existsByUsernameAndEmail(String username, String password);

    Player findById(Long userId);
}
