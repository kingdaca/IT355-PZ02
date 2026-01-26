DROP TABLE IF EXISTS ``;
CREATE TABLE `angazovanje` (
                               `angazovanje_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                               `profesor_id` int(11) DEFAULT NULL,
                               `predmet_id` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;