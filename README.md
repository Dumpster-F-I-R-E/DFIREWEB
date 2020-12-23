# DFIREWEB

![Node.js CI](https://github.com/Dumpster-F-I-R-E/DFIREWEB/workflows/Node.js%20CI/badge.svg?branch=master&event=push)

## Node JS

https://nodejs.org/en/ - Version 15.1.0 Current

## Install dependencies

      git repo clone Dumpster-F-I-R-E/DFIREWEB
      cd DFIREWEB

## Install production dependencies

     npm install

## Install development dependencies

     npm install --only=dev

## Create Database

     - Use Mysql Benchmark or Mysql CMD to run the following SQL Commands.

     CREATE USER 'dfireweb'@'localhost' IDENTIFIED BY 'password';
     CREATE DATABASE IF NOT EXISTS dfireweb;
     GRANT ALL PRIVILEGES ON dfireweb. * TO 'dfireweb'@'localhost';
     CREATE DATABASE IF NOT EXISTS dfireweb_test;
     GRANT ALL PRIVILEGES ON dfireweb_test. * TO 'dfireweb'@'localhost';

### Create Tables

     npm run db-init

## Run tests

     npm run test

## Run server

     npm start

     To see console output:

     SET DEBUG=express-locallibrary-tutorial:* & npm run devstart

     open [http://localhost:3000/](http://localhost:3000/) [I'm an inline-style link](https://www.google.com)

## Commiting

Run `npm run check` before commmiting to git.

Check STYLEGUIDE.md for more information.
