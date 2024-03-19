USE mysql;
CREATE DATABASE IF NOT EXISTS ddd_bootcamp;
USE ddd_bootcamp;
CREATE TABLE IF NOT EXISTS aircrafts(model VARCHAR(30), manufacturer VARCHAR(30), PRIMARY KEY (model));