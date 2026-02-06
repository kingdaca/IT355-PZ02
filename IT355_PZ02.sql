-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 06, 2026 at 11:03 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `IT355_PZ02`
--

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `name`) VALUES
(1, 'Beograd'),
(2, 'Novi Sad'),
(3, 'Niš'),
(4, 'Kragujevac'),
(5, 'Subotica'),
(6, 'Zrenjanin'),
(7, 'Pančevo'),
(8, 'Čačak'),
(9, 'Kraljevo'),
(10, 'Kruševac'),
(11, 'Šabac'),
(12, 'Užice'),
(13, 'Valjevo'),
(14, 'Smederevo'),
(15, 'Požarevac'),
(16, 'Jagodina'),
(17, 'Vranje'),
(18, 'Novi Pazar'),
(19, 'Sombor'),
(20, 'Kikinda'),
(21, 'Sremska Mitrovica'),
(22, 'Vršac'),
(23, 'Bor'),
(24, 'Zaječar'),
(25, 'Pirot'),
(26, 'Leskovac'),
(27, 'Prokuplje'),
(28, 'Loznica');

-- --------------------------------------------------------

--
-- Table structure for table `court`
--

CREATE TABLE `court` (
  `id` bigint(20) NOT NULL,
  `court_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `city_id` bigint(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `player_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `court`
--

INSERT INTO `court` (`id`, `court_name`, `phone`, `city_id`, `address`, `player_id`) VALUES
(9, 'Niš Padel Club', '+381 18 123 4567', 3, 'Nikole Pašića 28', 9),
(18, 'neki teren', '0123891023123', 1, 'neka adresa', 13);

-- --------------------------------------------------------

--
-- Table structure for table `court_offer_votes`
--

CREATE TABLE `court_offer_votes` (
  `id` bigint(20) NOT NULL,
  `offer_id` bigint(20) DEFAULT NULL,
  `player_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `court_offer_votes`
--

INSERT INTO `court_offer_votes` (`id`, `offer_id`, `player_id`) VALUES
(17, 3, 8),
(24, 3, 7),
(25, 5, 9),
(26, 5, 7),
(27, 9, 13),
(28, 9, 9);

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `match_day` date DEFAULT NULL,
  `court_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `free_position` int(11) NOT NULL,
  `city_id` bigint(20) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `match_organizer_id` bigint(20) DEFAULT NULL,
  `organizer_id` bigint(20) NOT NULL,
  `match_around_time` time(6) DEFAULT NULL,
  `match_status` enum('CANCELED','ENDED','FULL','OPEN','SCHEDULED') DEFAULT NULL,
  `match_duration` float NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `match_scheduled_time` time(6) DEFAULT NULL,
  `need_reservation` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`match_day`, `court_id`, `id`, `free_position`, `city_id`, `notes`, `match_organizer_id`, `organizer_id`, `match_around_time`, `match_status`, `match_duration`, `price`, `match_scheduled_time`, `need_reservation`) VALUES
('2026-02-01', NULL, 25, 0, 1, '', NULL, 9, '21:14:00.000000', 'CANCELED', 2.5, 0.00, NULL, b'0'),
('2026-02-02', 9, 27, 0, 1, '', NULL, 7, '02:57:00.000000', 'ENDED', 1, 2000.00, '02:57:00.000000', b'0'),
('2026-02-04', 18, 28, 0, 3, '', NULL, 7, '18:29:00.000000', 'ENDED', 2.5, 2500.00, '20:30:00.000000', b'0'),
('2026-02-05', NULL, 38, 1, 1, '', NULL, 9, '11:14:00.000000', 'CANCELED', 2, NULL, NULL, b'0'),
('2026-02-06', NULL, 41, 0, 1, '', NULL, 9, '12:10:00.000000', 'CANCELED', 2, NULL, NULL, b'0'),
('2026-02-06', NULL, 44, 2, 1, '', NULL, 9, NULL, 'CANCELED', 2, NULL, '15:00:00.000000', b'1'),
('2026-02-06', NULL, 45, 2, 3, '', NULL, 9, '14:51:00.000000', 'CANCELED', 2, NULL, NULL, b'0'),
('2026-02-06', NULL, 46, 2, 3, 'Imam rezervaciju u 17:00 na terenu tom i tom fale nam jos 2 igraca', NULL, 9, NULL, 'CANCELED', 2, NULL, '15:02:00.000000', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` bigint(20) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `player_id` bigint(20) NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `message`, `player_id`, `sent_at`, `is_read`) VALUES
(154, 'New request form match in2026-02-06 12:10', 9, '2026-02-06 09:10:17.000000', b'1'),
(155, 'You have a new player in match at 2026-02-06 12:10', 9, '2026-02-06 09:10:37.000000', b'1'),
(156, 'Your match is full 2026-02-06 12:10', 9, '2026-02-06 09:10:37.000000', b'1'),
(158, 'New offer for match in 2026-02-06 12:10', 9, '2026-02-06 09:14:17.000000', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `offer`
--

CREATE TABLE `offer` (
  `id` bigint(20) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `offer_time` time(6) DEFAULT NULL,
  `offered_price` decimal(38,2) DEFAULT NULL,
  `status` enum('ACCEPTED','PENDING','REJECTED','CONFIRMED') DEFAULT NULL,
  `court_id` bigint(20) NOT NULL,
  `match_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offer`
--

INSERT INTO `offer` (`id`, `notes`, `offer_time`, `offered_price`, `status`, `court_id`, `match_id`) VALUES
(3, '', '02:57:00.000000', 2000.00, 'CONFIRMED', 9, 27),
(5, '', '20:30:00.000000', 1000.00, 'CONFIRMED', 18, 28),
(6, '', '11:20:00.000000', 1200.00, 'PENDING', 18, 38),
(7, '', '11:14:00.000000', 2000.00, 'PENDING', 18, 38),
(8, '', '20:14:00.000000', 1200.00, 'PENDING', 18, 38),
(9, '', '12:10:00.000000', 2000.00, 'ACCEPTED', 18, 41);

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `level` enum('ADVANCED','BEGINNER','INTERMEDIATE') DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `court_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`id`, `email`, `first_name`, `last_name`, `password`, `phone`, `username`, `level`, `role_id`, `court_id`) VALUES
(7, 'mitic.david@yahoo.com', 'David 1', 'Mitic', '$2a$10$L6Ba4bIb0hOT0UzgIl.ngOJd96GzE.LFrHzBKtjpkmKalaOMXUcAG', '+381658569328', 'kingdaca', 'BEGINNER', 1, NULL),
(8, 'adasdadasd@gmail.com', 'David', 'Mitic', '$2a$10$rCZEb12TGxoo2JxP7y3cv.w5tgP71cTx2sBrKsa6cjlYu0XjdnvEG', '+381658569328', 'admin', 'BEGINNER', 3, NULL),
(9, 'asdadads@asda.com', 'Petar', 'Petrovic', '$2a$10$w74KUeC.TKbKLKsCu2R.YeLC/nEWUn3ifDK9m1gYAKsuQcWUv9x6m', '+381658569328', 'petar', 'BEGINNER', 2, 9),
(13, 'asdasd@asdads.com', 'novica', 'velickovic', '$2a$10$pi2aZvgEen5Ax/EB87sczOK.KPhdpWBPKIGpHP5b6S/n0WUAqyKGC', '+381123891023123', 'novica', NULL, 2, 18);

-- --------------------------------------------------------

--
-- Table structure for table `player_match`
--

CREATE TABLE `player_match` (
  `match_id` bigint(20) NOT NULL,
  `player_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `player_match`
--

INSERT INTO `player_match` (`match_id`, `player_id`) VALUES
(25, 8),
(27, 8),
(28, 9),
(41, 13);

-- --------------------------------------------------------

--
-- Table structure for table `potential_players`
--

CREATE TABLE `potential_players` (
  `match_id` bigint(20) NOT NULL,
  `player_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `name` enum('ADMIN','COURT_OWNER','PLAYER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'ADMIN'),
(2, 'COURT_OWNER'),
(3, 'PLAYER');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `court`
--
ALTER TABLE `court`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK757pksahkfidvlqvtwxdplle1` (`player_id`),
  ADD KEY `FKpvt1uof23om6tlxfqvw5ularg` (`city_id`);

--
-- Indexes for table `court_offer_votes`
--
ALTER TABLE `court_offer_votes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKem8gugtsqeho31wsfbukq7ile` (`offer_id`),
  ADD KEY `FKfl5p71p4esvmskdd7kb3kmivc` (`player_id`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKg5f76a3krto7qys8et557i2sh` (`court_id`),
  ADD KEY `FKk9uby5bd19bdhkgase8bxri1c` (`city_id`),
  ADD KEY `FKlewxxbm3pb905aw2f7iddn6sg` (`match_organizer_id`),
  ADD KEY `FKn2r52eii4oysyfwda7jsg5g08` (`organizer_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKh8ahd3yhrb7p23c0eebdtfo4n` (`player_id`);

--
-- Indexes for table `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKn7q7uqi0c8by8k4we5iqxrjj4` (`court_id`),
  ADD KEY `FKhnqlytvf4p9mslwupdtmfs4d` (`match_id`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKb4p4so7wcq4bw7a5rrksswedy` (`court_id`),
  ADD KEY `FKl25s3775req4swi79ox3rilqb` (`role_id`);

--
-- Indexes for table `player_match`
--
ALTER TABLE `player_match`
  ADD KEY `FKqvp7g5ktnfjdiexph9ou0so8u` (`player_id`),
  ADD KEY `FK8qrqq97wmcwed3qxq80f38ecg` (`match_id`);

--
-- Indexes for table `potential_players`
--
ALTER TABLE `potential_players`
  ADD UNIQUE KEY `UKb94aksrmbrmvlydwnb1djb9if` (`player_id`),
  ADD KEY `FKd4oiijjnfndi3ft9j1htpcevd` (`match_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `court`
--
ALTER TABLE `court`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `court_offer_votes`
--
ALTER TABLE `court_offer_votes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `court`
--
ALTER TABLE `court`
  ADD CONSTRAINT `FK1rgyscnf949lenlbmyysva4yu` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`),
  ADD CONSTRAINT `FKpvt1uof23om6tlxfqvw5ularg` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`);

--
-- Constraints for table `court_offer_votes`
--
ALTER TABLE `court_offer_votes`
  ADD CONSTRAINT `FKem8gugtsqeho31wsfbukq7ile` FOREIGN KEY (`offer_id`) REFERENCES `offer` (`id`),
  ADD CONSTRAINT `FKfl5p71p4esvmskdd7kb3kmivc` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`);

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `FKk9uby5bd19bdhkgase8bxri1c` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`),
  ADD CONSTRAINT `FKlewxxbm3pb905aw2f7iddn6sg` FOREIGN KEY (`match_organizer_id`) REFERENCES `players` (`id`),
  ADD CONSTRAINT `FKmv6h69kgdcfof0kvv0h6iwlu8` FOREIGN KEY (`court_id`) REFERENCES `court` (`id`),
  ADD CONSTRAINT `FKn2r52eii4oysyfwda7jsg5g08` FOREIGN KEY (`organizer_id`) REFERENCES `players` (`id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `FKh8ahd3yhrb7p23c0eebdtfo4n` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`);

--
-- Constraints for table `offer`
--
ALTER TABLE `offer`
  ADD CONSTRAINT `FKhnqlytvf4p9mslwupdtmfs4d` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`),
  ADD CONSTRAINT `FKn7q7uqi0c8by8k4we5iqxrjj4` FOREIGN KEY (`court_id`) REFERENCES `court` (`id`);

--
-- Constraints for table `players`
--
ALTER TABLE `players`
  ADD CONSTRAINT `FKf1ribci9v4s7801bec7wqudlb` FOREIGN KEY (`court_id`) REFERENCES `court` (`id`),
  ADD CONSTRAINT `FKl25s3775req4swi79ox3rilqb` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `player_match`
--
ALTER TABLE `player_match`
  ADD CONSTRAINT `FK8qrqq97wmcwed3qxq80f38ecg` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`),
  ADD CONSTRAINT `FKqvp7g5ktnfjdiexph9ou0so8u` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`);

--
-- Constraints for table `potential_players`
--
ALTER TABLE `potential_players`
  ADD CONSTRAINT `FKccn6pvg85k0ojjk58wx2n0yx2` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`),
  ADD CONSTRAINT `FKd4oiijjnfndi3ft9j1htpcevd` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
