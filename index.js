const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

const Employee = require('./lib/employee');
const Role = require('./lib/role');
const Department = require('./lib/department');


// create the connection information for the sql database
const connection = mysql.createConnection({
    // Your database hostname
    host: process.env.DB_HOST,

    // Your database port
    port: process.env.DB_PORT,

    // Your database username
    user: process.env.DB_USER,

    // Your database password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

});

// function which prompts the user for what action they should take
const start = () => {
    inquirer
        .prompt({
            name: 'choice',
            type: 'list',
            message: 'Would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'View All Departments',
                'Add Department',
                'Remove Department',
                'QUIT'],
        })
        .then((data) => {
            switch (data.choice) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Employees By Department":
                    viewAllEmployeesByDept();
                    break;
                case "View All Employees By Manager":
                    viewAllEmployeesByManager();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Remove Role":
                    comingSoon();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Remove Department":
                    comingSoon();
                    break;
                default:
                    console.log("Close Connection");
                    connection.end();
            }
        });
};

function comingSoon() {
    console.log(`\n`);
    console.log("Feature is coming soon!!!!");
    console.log(`\n`);
    start();
};

function viewAllEmployees() {
    connection.query(`
        SELECT 
            e.id, e.first_name, e.last_name, r.title, d.name AS department, CONCAT("$",FORMAT(r.salary,2)) AS salary, CONCAT(m.first_name, " ", m.last_name) AS manager
        FROM 
            employee e
        INNER JOIN role r ON e.role_id = r.id
        INNER JOIN department d on r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id;
    `,
        (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(`\n`);
            console.table(res);
            start();
        });
};

function viewAllEmployeesByDept() {
    connection.query(`
                SELECT 
                    d.name
                FROM 
	                department d
                `,
        (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            newArray = []
            res.forEach(element => {
                newArray.push(element.name);
            });
            inquirer
                .prompt([
                    {
                        name: 'department',
                        type: 'list',
                        choices: newArray,
                        message: 'What is the department you want to list the employees for?',
                    },
                ])
                .then((answer) => {
                    connection.query(`
                        SELECT 
                            e.id, e.first_name, e.last_name, r.title, d.name AS department, CONCAT("$",FORMAT(r.salary,2)) AS salary, CONCAT(m.first_name, " ", m.last_name) AS manager
                        FROM 
                            employee e
                        INNER JOIN 
                            role r ON e.role_id = r.id
                        INNER JOIN 
                            department d on r.department_id = d.id
                        LEFT JOIN 
                            employee m ON e.manager_id = m.id
                        WHERE
                            d.name = ?;
                        `,
                        [
                            answer.department,
                        ],
                        (err, res) => {
                            if (err) throw err;
                            // Log all results of the SELECT statement
                            console.log(`\n`);
                            console.table(res);
                            start();
                        });
                });
        });
};

function viewAllEmployeesByManager() {
    let whereCond;
    connection.query(`
        SELECT 
            e.id, CONCAT(e.first_name, " ", e.last_name) AS managers_name
        FROM 
            employee e, employee m
        WHERE
            e.id = m.manager_id
        GROUP BY
            managers_name, e.id;
        `,
        (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            newArray = []
            res.forEach(element => {
                newArray.push(element.managers_name);
            });
            newArray.push("None");
            inquirer
                .prompt([
                    {
                        name: 'manager',
                        type: 'list',
                        choices: newArray,
                        message: 'Which manager do you want to list the employees for?',
                    },
                ])
                .then((answer) => {
                    const newArray2 = res.filter(managerData => managerData.managers_name === answer.manager);
                    if (newArray2 === undefined || newArray2.length == 0) {
                        whereCond = `e.manager_id is NULL`;
                    }
                    else {
                        whereCond = `e.manager_id = ${newArray2[0].id}`;
                    };
                    connection.query(`
                                SELECT 
                                    e.id, e.first_name, e.last_name, r.title, d.name AS department, CONCAT("$",FORMAT(r.salary,2)) AS salary, CONCAT(m.first_name, " ", m.last_name) AS manager
                                FROM 
                                    employee e
                                INNER JOIN 
                                    role r ON e.role_id = r.id
                                INNER JOIN 
                                    department d on r.department_id = d.id
                                LEFT JOIN 
                                    employee m ON e.manager_id = m.id
                                WHERE
                                    ${whereCond}
                                `,
                        (err, res) => {
                            if (err) throw err;
                            // Log all results of the SELECT statement
                            console.log(`\n`);
                            console.table(res);
                            start();
                        });
                });
        });
};

function addEmployee() {
    connection.query(`
    SELECT 
        e.id, CONCAT(e.first_name, " ", e.last_name) AS managers_name
    FROM 
        employee e
    GROUP BY
        managers_name, e.id;
    `,
        (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            newArray = []
            res.forEach(element => {
                newArray.push(element.managers_name);
            });
            newArray.push("None");
            connection.query(`
            SELECT 
                r.id, r.title
            FROM 
                role r
            GROUP BY
                r.title, r.id;
            `,
                (err, resRole) => {
                    if (err) throw err;
                    // Log all results of the SELECT statement
                    roleArray = []
                    resRole.forEach(element => {
                        roleArray.push(element.title);
                    });

                    inquirer.prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: `What is the employee's first name?`,
                            validate: answer => {
                                if (answer !== "") {
                                    return true;
                                }
                                return "Please enter at least one character.";
                            }
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: `What is the employee's last name?`,
                            validate: answer => {
                                if (answer !== "") {
                                    return true;
                                }
                                return "Please enter at least one character.";
                            }
                        },
                        {
                            type: "list",
                            name: "role",
                            choices: roleArray,
                            message: `What is the employee's role?`
                        },
                        {
                            type: "list",
                            name: "manager",
                            choices: newArray,
                            message: `Who is the employee's manager?`
                        },

                    ]).then(function (data) {
                        const roleArray2 = resRole.filter(roleData => roleData.title === data.role);
                        const roleId = roleArray2[0].id;

                        let managerid;
                        const newArray2 = res.filter(managerData => managerData.managers_name === data.manager);
                        if (newArray2 === undefined || newArray2.length == 0) {
                            managerid = null;
                        }
                        else {
                            managerid = newArray2[0].id;
                        };

                        const newEmployee = new Employee(data.firstName, data.lastName, roleId, managerid);
                        connection.query(
                            'INSERT INTO employee SET ?',
                            newEmployee,
                            (err, res) => {
                                if (err) throw err;
                                start();
                            }
                        );
                    }
                    )
                })
        })
};

function updateEmployeeRole() {
    connection.query(`
    SELECT 
        e.id, CONCAT(e.first_name, " ", e.last_name, " (Current Role: ", r.title, ")") AS name
    FROM 
        employee e,
        role r
    WHERE
        e.role_id = r.id
    `,
        (err, resEmployee) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            employeeArray = []
            resEmployee.forEach(employeeData => {
                employeeArray.push(employeeData.name);
            });
            connection.query(`
            SELECT 
                r.id, r.title
            FROM 
                role r
            `,
                (err, resRole) => {
                    if (err) throw err;
                    // Log all results of the SELECT statement
                    roleArray = []
                    resRole.forEach(roleData => {
                        roleArray.push(roleData.title);
                    });
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "employee",
                            choices: employeeArray,
                            message: `Which employee do you need to update the role on?`
                        },
                        {
                            type: "list",
                            name: "newRole",
                            choices: roleArray,
                            message: `What is the new role for the employee?`
                        },

                    ]).then(function (data) {
                        const employeeArray2 = resEmployee.filter(employeeData => employeeData.name === data.employee);
                        const employeeId = employeeArray2[0].id;

                        const roleArray2 = resRole.filter(roleData => roleData.title === data.newRole);
                        const roleId = roleArray2[0].id;

                        connection.query(
                            'UPDATE employee SET role_id = ? WHERE id = ?',
                            [
                                roleId,
                                employeeId,
                            ],
                            (err, res) => {
                                if (err) throw err;
                                start();
                            }
                        );
                    }
                    )
                });
        });
};

function viewAllRoles() {
    connection.query(`
        SELECT 
            r.id, r.title, d.name AS department, CONCAT("$",FORMAT(r.salary,2)) AS salary
        FROM 
            role r
        INNER JOIN 
            department d on r.department_id = d.id
    `,
        (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(`\n`);
            console.table(res);
            start();
        });
};

function addRole() {
    connection.query(`
    SELECT 
        d.id, d.name
    FROM 
        department d
    GROUP BY
        d.name, d.id;
    `,
        (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            newArray = []
            res.forEach(element => {
                newArray.push(element.name);
            });
            inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: `What is the title of the new role?`,
                    validate: answer => {
                        if (answer !== "") {
                            return true;
                        }
                        return "Please enter at least one character.";
                    }
                },
                {
                    type: "input",
                    name: "salary",
                    message: `What is the salary of the new role?`,
                    validate: answer => {
                        if (answer !== "") {
                            return true;
                        }
                        return "Please enter at least one character.";
                    }
                },
                {
                    type: "list",
                    name: "department",
                    choices: newArray,
                    message: `Which department does the new role belong to?`
                },

            ]).then(function (data) {
                const newArray2 = res.filter(departmentData => departmentData.name === data.department);
                const departmentId = newArray2[0].id;

                const newRole = new Role(data.title, data.salary, departmentId);
                connection.query(
                    'INSERT INTO role SET ?',
                    newRole,
                    (err, res) => {
                        if (err) throw err;
                        start();
                    }
                );
            }
            )
        })
}

function viewAllDepartments() {

    connection.query(`
    SELECT 
        d.id, d.name, CONCAT("$",FORMAT(SUM(r.salary),2)) AS utilized_budget
    FROM 
        department d 
    INNER JOIN 
        role r on r.department_id = d.id 
    INNER JOIN 
        employee e on e.role_id = r.department_id 
    GROUP BY 
        d.name, d.id;
    `,
        (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(`\n`);
            console.table(res);
            start();
        });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: `What is the name of the new department?`,
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter at least one character.";
            }
        },
    ]).then(function (data) {
        const newDepartment = new Department(data.name);
        connection.query(
            'INSERT INTO department SET ?',
            newDepartment,
            (err, res) => {
                if (err) throw err;
                start();
            }
        );
    }
    )
}

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log(`connected as id ${connection.threadId}\n`);
    console.clear();
    start();
});