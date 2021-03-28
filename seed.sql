-- Make it so all of the following code will affect EmployeeTracker_DB --
USE EmployeeTracker_DB;

-- Insert seed data into the department table --
INSERT INTO department (name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal"),
("Human Resources");

-- Insert seed data into the role table --
INSERT INTO role (title, salary, department_id)
VALUES 
("Sales Lead", 50000.00, 1),
("Salesperson", 25000.00, 1),
("Lead Engineer", 40000.00, 2),
("Software Engineer", 20000.00, 2),
("Accountant", 45000.00, 3),
("Legal Team Lead", 55000.00, 4),
("Lawyer", 45000.00, 4),
("HR Lead", 42000.00, 5),
("HR Analyst", 22000.00, 5);


-- Insert seed data into the employee table --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Jane", "Doe",1,NULL),
("Alan", "Smith",2, 1),
("Chris", "Lancaster",3,NULL),
("Rory", "Davis",4, 3),
("Sarah", "Tinto",5,NULL),
("Noah", "Tomlinson",6, NULL),
("Brandon", "Wilson",7, 6),
("Augusto", "Woods",8,NULL),
("Robert", "Dell",9, 8);