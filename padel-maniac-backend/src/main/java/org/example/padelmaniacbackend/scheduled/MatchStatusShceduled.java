package org.example.padelmaniacbackend.scheduled;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Component
public class MatchStatusShceduled {

    @Autowired
    private MatchRepository matchRepository;

    @PostConstruct
    public void init() {
        System.out.println("✅ MatchStatusScheduled BEAN LOADED AND INITIALIZED!");
    }

    @Scheduled(cron = "0 */30 * * * *")
    @Transactional
    public void changeMatchStatus() {
        System.out.println("scheduled");

        List<Match> matches = matchRepository.findAll();

        matches.forEach(match -> {

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime matchDateTime = LocalDateTime.of(
                    match.getMatchDay(),
                    match.getMatchScheduledTime() != null ? match.getMatchScheduledTime() : match.getMatchAroundTime()
            );

            if (match.getMatchStatus() == Match.MatchStatus.OPEN
                    || match.getMatchStatus() == Match.MatchStatus.FULL) {

                if (now.isAfter(matchDateTime)) {
                    match.setMatchStatus(Match.MatchStatus.CANCELED);
                }
            }

            if (match.getMatchStatus() == Match.MatchStatus.SCHEDULED) {
                if (now.isAfter(matchDateTime)) {
                    match.setMatchStatus(Match.MatchStatus.ONGOING);
                }
            }

            double hours = 2.5;
            long h = (long) hours;
            long m = Math.round((hours - h) * 60);

            LocalDateTime matchEndTime = matchDateTime
                    .plusHours(h)
                    .plusMinutes(m);

            if (match.getMatchStatus() == Match.MatchStatus.ONGOING) {
                if (now.isAfter(matchEndTime)) {
                    match.setMatchStatus(Match.MatchStatus.ENDED);
                }
            }

            matchRepository.save(match);

        });

    }
}
