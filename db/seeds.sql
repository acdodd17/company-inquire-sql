INSERT INTO departments (name)
VALUES 
    ('Production'), 
    ('Research and Development'), 
    ('Marketing'), 
    ('Sales')
;

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Production Manager', 150000.00, 1),
    ('Quality Control Inspector', 75000.00, 1),
    ('Operator', 50000.00, 1),
    ('R & D Manager', 150000.00, 2),
    ('R & D Engineer', 80000.00, 2),
    ('Research Scientist', 80000.00, 2),
    ('Research Technician', 50000.00, 2),
    ('Marketing Manager', 10000.00, 3),
    ('Ditgital Marketing Specialist', 75000.00, 3),
    ('Product Marketing Specialist', 75000.00, 3),
    ('Marketing Intern', 35000.00, 3),
    ('Sales Manager', 100000.00, 4),
    ('Sales Representative', 75000.00, 4),
    ('Sales Intern', 35000.00, 4),
;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Minerva', 'McGonagall', 1, NULL),
    ('Luna', 'Lovegood', 2, 1),
    ('Nevill', 'Longbottom', 3, 1),
    ('Albus', 'Dumbeldore', 4, NULL),
    ('Harry', 'Potter', 5, 4),
    ('Hermione', 'Granger', 6, 4),
    ('Ron', 'Weasley', 7, 4),
    ('Rita', 'Skeeter', 8, NULL),
    ('George', 'Weasley', 9, 8),
    ('Fred', 'Weasley', 10, 8),
    ('Colin', 'Creevey', 11, 8),
    ('Rubeus', 'Hagrid', 12, NULL),
    ('Ginny', 'Weasley', 13, 12),
    ('Dobby', 'Elf', 14, 12),
;

