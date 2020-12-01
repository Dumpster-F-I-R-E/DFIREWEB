USE dfireweb;
CREATE TABLE IF NOT EXISTS `Users` (
	`UserID` INT NOT NULL,
	`Username` TEXT NOT NULL,
	`Password` TEXT NOT NULL,
	`Role` TEXT NOT NULL,
	`CompanyID` INT NOT NULL,
	PRIMARY KEY (`UserID`)
);

CREATE TABLE IF NOT EXISTS `Profile` (
	`UserID` INT NOT NULL,
	`FirstName` TEXT NOT NULL,
	`LastName` TEXT NOT NULL,
	`Address` TEXT NOT NULL,
	`Email` TEXT NOT NULL,
	`Phone` TEXT NOT NULL,
	`StaffID` TEXT,
	PRIMARY KEY (`UserID`),
    FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`)
);

CREATE TABLE IF NOT EXISTS `Companies` (
	`CompanyID` INT NOT NULL,
	`Name` TEXT NOT NULL,
	`Address` TEXT NOT NULL,
	`Phone` TEXT NOT NULL,
	PRIMARY KEY (`CompanyID`)
);

CREATE TABLE IF NOT EXISTS `Depots` (
	`DepotID` INT NOT NULL,
	`Name` TEXT NOT NULL,
	`Address` TEXT NOT NULL,
	`CompanyID` INT NOT NULL,
	PRIMARY KEY (`DepotID`),
    FOREIGN KEY (`CompanyID`) REFERENCES Companies(`CompanyID`)
);

CREATE TABLE IF NOT EXISTS `Sensors` (
	`SensorID` INT NOT NULL,
	`CompanyID` INT NOT NULL,
	PRIMARY KEY (`SensorID`),
    FOREIGN KEY (`CompanyID`) REFERENCES Companies(`CompanyID`)
);

CREATE TABLE IF NOT EXISTS `SensorReports` (
	`ReportID` INT NOT NULL,
	`SensorID` INT NOT NULL,
	`Longitude` DOUBLE NOT NULL,
	`Latitude` DOUBLE NOT NULL,
	`BatteryLevel` DOUBLE NOT NULL,
	`FullnessLevel` DOUBLE NOT NULL,
	`ErrorCode` INT NOT NULL,
	PRIMARY KEY (`ReportID`),
    FOREIGN KEY (`SensorID`) REFERENCES Sensors(`SensorID`)
);

