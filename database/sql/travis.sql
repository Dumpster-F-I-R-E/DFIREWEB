CREATE USER 'dfireweb'@'localhost' IDENTIFIED BY 'password';
CREATE DATABASE IF NOT EXISTS dfireweb_test;
GRANT ALL PRIVILEGES ON dfireweb_test. * TO 'dfireweb'@'localhost';