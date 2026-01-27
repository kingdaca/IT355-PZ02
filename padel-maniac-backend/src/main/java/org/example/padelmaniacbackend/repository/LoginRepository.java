package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginRepository extends JpaRepository<Player, Integer> {

    Player findByUsernameAndPassword(String username, String password);

}
