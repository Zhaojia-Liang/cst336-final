SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
	`userId` tinyint(2) NOT NULL,
	`username` varchar(8) COLLATE utf8_unicode_ci NOT NULL,
	`password` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
	`flightnumber` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--



--
-- Table structure for table `flight`
--
DROP TABLE IF EXISTS `flight`;
CREATE TABLE `flight` (
  `flightId` mediumint(9) NOT NULL,
  `flightnumber` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `start` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `end` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `departure` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `arrival` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `flight`
--

INSERT INTO `flight` (`flightId`, `flightnumber`, `start`, `end`, `departure`, `arrival`) VALUES
(1, '319DC', 'Seattle', 'San Jose', '2020-05-03', '2020-05-04'),
(2, '246FL', 'Monterey', 'San Francisco', '2020-05-03', '2020-05-04'),
(3, '441JK', 'Shanghai', 'Los Angeles', '2020-05-04', '2020-05-06'),
(4, '888CK', 'Tokyo', 'Los Angeles', '2020-05-05', '2020-05-06'),
(5, '520FU', 'Shanghai', 'Tokyo', '2020-05-03', '2020-05-03'),
(6, '741CA', 'Las Vegas', 'New York', '2020-05-05', '2020-05-06'),
(7, '223TK', 'Chicago', 'New York', '2020-05-04', '2020-05-05'),
(8, '777UA', 'Houston', 'Phoenix', '2020-05-07', '2020-05-08'),
(9, '543UH', 'San Diego', 'Columbus', '2020-05-04', '2020-05-05'),
(10, '588IU', 'Denver', 'Los Angeles', '2020-05-08', '2020-05-09'),
(11, '431NM', 'Shanghai', 'Washington, D.C.', '2020-05-04', '2020-05-06'),
(12, '994QS', 'Miami', 'Los Angeles', '2020-05-04', '2020-05-05'),
(13, '411LS', 'Shanghai', 'Miami', '2020-05-04', '2020-05-06'),
(14, '511QS', 'Houston', 'Los Angeles', '2020-05-04', '2020-05-04'),
(15, '978AQ', 'San Jose', 'Los Angeles', '2020-05-04', '2020-05-04'),
(16, '789CA', 'Beijing', 'San Jose', '2020-05-04', '2020-05-06'),
(17, '432SK', 'New Orleans', 'Los Angeles', '2020-05-04', '2020-05-04'),
(18, '561JK', 'Orlando', 'Los Angeles', '2020-05-04', '2020-05-04'),
(19, '598IK', 'Boston', 'Los Angeles', '2020-05-04', '2020-05-05'),
(20, '322HJ', 'Detroit', 'Los Angeles', '2020-05-04', '2020-05-04'),
(21, '666KK', 'Philadelphia', 'Los Angeles', '2020-05-04', '2020-05-04'),
(22, '777QA', 'Dallas', 'Los Angeles', '2020-05-06', '2020-05-06'),
(23, '732QA', 'Dallas', 'New York', '2020-05-06', '2020-05-06'),
(24, '727QA', 'Dallas', 'Miami', '2020-05-06', '2020-05-06');

-- --------------------------------------------------------

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;

CREATE TABLE `manager` (
  `managerId` mediumint(9) NOT NULL,
  `name` varchar(8) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(500) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `manager`
--

INSERT INTO `manager` (`managerId`, `name`, `password`) VALUES
(1, 'zhaojia', 'zhaojia'),
(2, 'zhangben', 'zhangben');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);
--
-- Indexes for table `flight`
--
ALTER TABLE `flight`
  ADD PRIMARY KEY (`flightId`);

--
-- Indexes for table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`managerId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
  
--
-- AUTO_INCREMENT for table `flight`
--
ALTER TABLE `flight`
  MODIFY `flightId` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

COMMIT;