-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Aug 27, 2023 at 03:36 PM
-- Server version: 10.11.3-MariaDB-1:10.11.3+maria~ubu2204
-- PHP Version: 8.1.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hwm`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `content`
-- (See below for the actual view)
--
CREATE TABLE `content` (
`location` int(11)
,`content` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `itemid` int(11) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `name_de` varchar(255) NOT NULL,
  `serial` varchar(255) DEFAULT NULL,
  `location` int(11) NOT NULL,
  `labeled` tinyint(1) NOT NULL DEFAULT 1,
  `deleted` tinyint(1) DEFAULT NULL,
  `image` tinyint(1) DEFAULT NULL,
  `document` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`itemid`, `name_en`, `name_de`, `serial`, `location`, `labeled`, `deleted`, `image`, `document`) VALUES
(0, 'root', 'root', NULL, 0, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure for view `content`
--
DROP TABLE IF EXISTS `content`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `content`  AS SELECT `items`.`location` AS `location`, count(0) AS `content` FROM `items` GROUP BY `items`.`location` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`itemid`),
  ADD KEY `location` (`location`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `itemid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3000;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `location` FOREIGN KEY (`location`) REFERENCES `items` (`itemid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
