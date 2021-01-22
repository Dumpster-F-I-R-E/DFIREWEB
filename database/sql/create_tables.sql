CREATE TABLE IF NOT EXISTS `Users` (
	`UserID` INT NOT NULL AUTO_INCREMENT,
	`Username` TEXT NOT NULL,
	`Password` TEXT NOT NULL,
	`Role` TEXT NOT NULL,
	`CompanyID` INT NOT NULL,
	`FirstName` TEXT ,
	`LastName` TEXT,
	`Address` TEXT,
	`Email` TEXT,
	`Phone` TEXT,
	`StaffID` TEXT,
	PRIMARY KEY (`UserID`)
);

-- CREATE TABLE IF NOT EXISTS `Profile` (
-- 	`UserID` INT NOT NULL,
-- 	`FirstName` TEXT NOT NULL,
-- 	`LastName` TEXT NOT NULL,
-- 	`Address` TEXT NOT NULL,
-- 	`Email` TEXT NOT NULL,
-- 	`Phone` TEXT NOT NULL,
-- 	`StaffID` TEXT,
-- 	`Image` MEDIUMBLOB,
-- 	PRIMARY KEY (`UserID`),
--     FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`)
-- );

CREATE TABLE IF NOT EXISTS `ProfileImages` (
	`UserID` INT NOT NULL,
	`Image` MEDIUMBLOB,
	PRIMARY KEY (`UserID`),
    FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`)
);


CREATE TABLE IF NOT EXISTS `Companies` (
	`CompanyID` INT NOT NULL AUTO_INCREMENT,
	`Name` TEXT NOT NULL,
	`Address` TEXT NOT NULL,
	`Phone` TEXT NOT NULL,
	PRIMARY KEY (`CompanyID`)
);

CREATE TABLE IF NOT EXISTS `Depots` (
	`DepotID` INT NOT NULL AUTO_INCREMENT,
	`Name` TEXT NOT NULL,
	`Address` TEXT NOT NULL,
	`CompanyID` INT NOT NULL,
	PRIMARY KEY (`DepotID`),
    FOREIGN KEY (`CompanyID`) REFERENCES Companies(`CompanyID`)
);

CREATE TABLE IF NOT EXISTS `Sensors` (
	`SensorID` INT NOT NULL AUTO_INCREMENT,
	`SensorSerialNumber` INT NOT NULL,
	`CompanyID` INT NOT NULL,
	PRIMARY KEY (`SensorID`),
    FOREIGN KEY (`CompanyID`) REFERENCES Companies(`CompanyID`)
);

CREATE TABLE IF NOT EXISTS `SensorReports` (
	`ReportID` INT NOT NULL AUTO_INCREMENT,
	`SensorID` INT NOT NULL,
	`Longitude` DOUBLE NOT NULL,
	`Latitude` DOUBLE NOT NULL,
	`BatteryLevel` DOUBLE NOT NULL,
	`FullnessLevel` DOUBLE NOT NULL,
	`ErrorCode` INT NOT NULL,
	`Time` DATETIME NOT NULL DEFAULT NOW(),
	PRIMARY KEY (`ReportID`),
    FOREIGN KEY (`SensorID`) REFERENCES Sensors(`SensorID`)
);

CREATE TABLE IF NOT EXISTS `Sessions` (
	`SessionID` INT NOT NULL AUTO_INCREMENT,
	`UserID` INT NOT NULL,
	`Token` VARCHAR(120) NOT NULL,
	`ExpireDate` DATETIME NOT NULL,
	PRIMARY KEY (`SessionID`)
);