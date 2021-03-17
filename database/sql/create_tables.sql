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

CREATE TABLE IF NOT EXISTS `ProfileImages` (
	`UserID` INT NOT NULL,
	`Image` MEDIUMBLOB,
	PRIMARY KEY (`UserID`),
    FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`)
	ON DELETE CASCADE
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
	`Longitude` DOUBLE NOT NULL,
	`Latitude` DOUBLE NOT NULL,
	`CompanyID` INT NOT NULL,
	PRIMARY KEY (`DepotID`),
    FOREIGN KEY (`CompanyID`) REFERENCES Companies(`CompanyID`)
	
);

CREATE TABLE IF NOT EXISTS `Dumpsters` (
	`DumpsterID` INT NOT NULL AUTO_INCREMENT,
	`DumpsterSerialNumber` INT NOT NULL,
	`CompanyID` INT NOT NULL,
	`DriverID` INT NULL,
	`dumpsterEPAddr` VARCHAR(255),
	PRIMARY KEY (`DumpsterID`),
    FOREIGN KEY (`CompanyID`) REFERENCES Companies(`CompanyID`),
	FOREIGN KEY (`DriverID`) REFERENCES Users(`UserID`) ON DELETE SET NULL
	
);

CREATE TABLE IF NOT EXISTS `DumpsterReports` (
	`ReportID` INT NOT NULL AUTO_INCREMENT,
	`DumpsterID` INT NOT NULL,
	`Longitude` DOUBLE NOT NULL,
	`Latitude` DOUBLE NOT NULL,
	`BatteryLevel` DOUBLE NOT NULL,
	`FullnessLevel` DOUBLE NOT NULL,
	`ErrorCode` INT NOT NULL,
	`Time` DATETIME NOT NULL DEFAULT NOW(),
	PRIMARY KEY (`ReportID`),
    FOREIGN KEY (`DumpsterID`) REFERENCES Dumpsters(`DumpsterID`)
	ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Sessions` (
	`SessionID` INT NOT NULL AUTO_INCREMENT,
	`UserID` INT NOT NULL,
	`Token` VARCHAR(120) NOT NULL,
	`ExpireDate` DATETIME NOT NULL,
	PRIMARY KEY (`SessionID`),
	FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`)
	ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `resetPassword` (
	`UserID` INT NOT NULL,
	`username` VARCHAR(255) NOT NULL,
	`resetToken` VARCHAR(255) NOT NULL,
	`resetExpired` DATE NOT NULL,
	FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`)
	ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Drivers` (
	`UserID` INT NOT NULL,
	`Longitude` DOUBLE NOT NULL,
	`Latitude` DOUBLE NOT NULL,
	PRIMARY KEY (`UserID`)
);

CREATE TABLE IF NOT EXISTS `drivermessages` (
	`MessageID` INT NOT NULL AUTO_INCREMENT,
	`userID` int not null,
	`Message` varchar(255) not null,
	`Time` timestamp,
	`Status` varchar(255) not null,
	primary key (`MessageID`),
	FOREIGN Key (`userID`) REFERENCES Users(`UserID`) ON DELETE CASCADE
);
