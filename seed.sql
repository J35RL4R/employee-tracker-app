
-- Insert Departments --
INSERT INTO department (name)
VALUES("Sales"),("Engineering"),("Finance"),("Legal");

-- Insert Roles --
INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Manager", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Head Software Engineer", 150000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO roles (title, salary, department_id)
VALUE ("Senior Lawyer", 250000, 4);
INSERT INTO roles (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);

-- Insert Employees --
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE("Bob", "Doe", 1, 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE("Killer", "Mike", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE("Bill", "Burgers", 3, 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE("Kevin", "Kaine", 4, null);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE("Malia", "Pumrt", 5, null);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE("Sarah", "Imbesi", 6, null);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE("Tim", "Tooltime", 7, 6);