SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema vacation_planner
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `vacation_planner` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `vacation_planner` ;

-- -----------------------------------------------------
-- Table `vacation_planner`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacation_planner`.`user` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(25) NULL DEFAULT NULL,
  `email` VARCHAR(25) NULL DEFAULT NULL,
  `password` VARCHAR(25) NULL DEFAULT NULL,
  `age` INT NULL DEFAULT NULL,
  `phone` VARCHAR(10) NULL DEFAULT NULL,
  `userType` ENUM('User', 'Owner', 'Moderator') NULL DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `vacation_planner`.`owner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacation_planner`.`owner` (
  `ownerId` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  PRIMARY KEY (`ownerId`),
  INDEX `fk_owner_user1_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `fk_owner_user1`
    FOREIGN KEY (`userId`)
    REFERENCES `vacation_planner`.`user` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `vacation_planner`.`accommodation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacation_planner`.`accommodation` (
  `accommodationId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL DEFAULT NULL,
  `country` VARCHAR(25) NULL DEFAULT NULL,
  `city` VARCHAR(25) NULL DEFAULT NULL,
  `street` VARCHAR(50) NULL DEFAULT NULL,
  `description` VARCHAR(200) NULL DEFAULT NULL,
  `pricePerNight` FLOAT NULL DEFAULT NULL,
  `singleRoomPrice` FLOAT NULL DEFAULT NULL,
  `doubleRoomPrice` FLOAT NULL DEFAULT NULL,
  `tripleRoomPrice` FLOAT NULL DEFAULT NULL,
  `quadrupleRoomPrice` FLOAT NULL DEFAULT NULL,
  `accommodationType` ENUM('Apartment', 'Hotel', 'Guesthouse', 'Hostel') NULL DEFAULT NULL,
  `totalSingleRooms` INT NULL DEFAULT NULL,
  `totalDoubleRooms` INT NULL DEFAULT NULL,
  `totalTripleRooms` INT NULL DEFAULT NULL,
  `totalQuadrupleRooms` INT NULL DEFAULT NULL,
  `ownerId` INT NOT NULL,
  PRIMARY KEY (`accommodationId`),
  INDEX `fk_accommodation_owner1_idx` (`ownerId` ASC) VISIBLE,
  CONSTRAINT `fk_accommodation_owner1`
    FOREIGN KEY (`ownerId`)
    REFERENCES `vacation_planner`.`owner` (`ownerId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `vacation_planner`.`reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacation_planner`.`reservation` (
  `reservationId` INT NOT NULL AUTO_INCREMENT,
  `checkIn` DATE NOT NULL,
  `checkOut` DATE NOT NULL,
  `totalPrice` FLOAT NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `userId` INT NOT NULL,
  `accommodationId` INT NOT NULL,
  PRIMARY KEY (`reservationId`),
  INDEX `fk_reservation_user1_idx` (`userId` ASC) VISIBLE,
  INDEX `fk_reservation_accommodation1_idx` (`accommodationId` ASC) VISIBLE,
  CONSTRAINT `fk_reservation_user1`
    FOREIGN KEY (`userId`)
    REFERENCES `vacation_planner`.`user` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reservation_accommodation1`
    FOREIGN KEY (`accommodationId`)
    REFERENCES `vacation_planner`.`accommodation` (`accommodationId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `vacation_planner`.`room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacation_planner`.`room` (
  `roomId` INT NOT NULL,
  `roomType` ENUM('Single', 'Double', 'Triple', 'Quadruple') NULL DEFAULT NULL,
  `reservationId` INT NOT NULL,
  PRIMARY KEY (`roomId`),
  INDEX `fk_room_reservation1_idx` (`reservationId` ASC) VISIBLE,
  CONSTRAINT `fk_room_reservation1`
    FOREIGN KEY (`reservationId`)
    REFERENCES `vacation_planner`.`reservation` (`reservationId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `vacation_planner`.`moderator`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacation_planner`.`moderator` (
  `modId` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  PRIMARY KEY (`modId`),
  INDEX `fk_moderator_user_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `fk_moderator_user`
    FOREIGN KEY (`userId`)
    REFERENCES `vacation_planner`.`user` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `vacation_planner`.`accommodationphoto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacation_planner`.`accommodationphoto` (
  `photoId` INT NOT NULL AUTO_INCREMENT,
  `photo` LONGBLOB NULL DEFAULT NULL,
  `accommodationId` INT NOT NULL,
  PRIMARY KEY (`photoId`, `accommodationId`),
  INDEX `fk_accommodationphoto_accommodation1_idx` (`accommodationId` ASC) VISIBLE,
  CONSTRAINT `fk_accommodationphoto_accommodation1`
    FOREIGN KEY (`accommodationId`)
    REFERENCES `vacation_planner`.`accommodation` (`accommodationId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `vacation_planner`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacation_planner`.`review` (
  `reviewId` INT NOT NULL AUTO_INCREMENT,
  `review` VARCHAR(200) NULL DEFAULT NULL,
  `rating` FLOAT NULL DEFAULT NULL,
  `userId` INT NOT NULL,
  `accommodationId` INT NOT NULL,
  PRIMARY KEY (`reviewId`),
  INDEX `fk_review_user1_idx` (`userId` ASC) VISIBLE,
  INDEX `fk_review_accommodation1_idx` (`accommodationId` ASC) VISIBLE,
  CONSTRAINT `fk_review_user1`
    FOREIGN KEY (`userId`)
    REFERENCES `vacation_planner`.`user` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_review_accommodation1`
    FOREIGN KEY (`accommodationId`)
    REFERENCES `vacation_planner`.`accommodation` (`accommodationId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
