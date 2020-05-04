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

INSERT INTO `users` (`userId`, `username`, `password`) VALUES
(1, 'admin', '$2b$10$sffemRCjSUw98dp/Vw/78uLk7fHopuUEzqnZNWDiB6TtcUSeSS6Ne');

--
-- Table structure for table `flight`
--
DROP TABLE IF EXISTS `flight`;
CREATE TABLE `flight` (
  `flightId` mediumint(9) NOT NULL,
  `flightnumber` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `from` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `to` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `departure` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `arrival` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `flight`
--

INSERT INTO `flight` (`flightId`, `flightnumber`, `from`, `to`, `departure`, `arrival`) VALUES
(1, '319DC', 'San Francisco', 'San Jose', '2020-05-03', '2020-05-04'),
(2, '246FL', 'Marina', 'San Francisco', '2020-05-03', '2020-05-04'),
(3, '441JK', 'Shanghai', 'Los Angeles', '2020-05-04', '2020-05-06');

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