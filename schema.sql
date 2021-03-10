-- Drops the EmployeeTracker_DB if it exists currently --
DROP DATABASE IF EXISTS EmployeeTracker_DB;

-- Creates the "EmployeeTracker_DB" database --
CREATE DATABASE EmployeeTracker_DB;

-- Make it so all of the following code will affect EmployeeTracker_DB --
USE EmployeeTracker_DB;

-- Creates the table "employee" within EmployeeTracker_DB --
CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  PRIMARY KEY(id)
);

-- Creates the table "role" within EmployeeTracker_DB --
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  department_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- Creates the table "department" within EmployeeTracker_DB --
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
