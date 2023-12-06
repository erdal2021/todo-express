const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const DB_USER = "todo";
const DB_PASSWORD = "1234";
const DB_HOST = "localhost";
const DB_NAME = "todosdb";

// 'templates' folder containing 'index.html'
app.set('views', 'templates');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

async function createDbConnection() {
    try {
        const connection = await mysql.createConnection({
            user: DB_USER,
            password: DB_PASSWORD,
            host: DB_HOST,
            database: DB_NAME,
        });
        console.log("Connected to the database");
        return connection;
    } catch (error) {
        console.error(`Error connecting to the database: ${error}`);
        throw error;
    }
}

async function resetAutoIncrement() {
    const connection = await createDbConnection();
    const query = "ALTER TABLE todos AUTO_INCREMENT = 1";

    try {
        await connection.execute(query);
    } catch (error) {
        console.error(`Error resetting auto-increment: ${error}`);
    } finally {
        connection.end();
    }
}

app.get("/", async (req, res) => {
    const connection = await createDbConnection();
    const query = "SELECT * FROM todos;";

    try {
        const [rows] = await connection.execute(query);
        res.render("index", { request: req, todos: rows, app_version: "0.0.1", Lizenz: "Open Source GPL" });
    } catch (error) {
        console.error(`Error: ${error}`);
    } finally {
        connection.end();
    }
});

app.post("/todos", async (req, res) => {
    const connection = await createDbConnection();

    const todo = req.body;
    const query = "INSERT INTO todos (item, stat) VALUES (?, ?)";
        const data = [todo.item, "open"];
// const todo = req.body.todo;
// const query = "INSERT INTO todos (item, stat) VALUES (?, ?)";
//     const data = [todo, "open"];

    try {
        await connection.execute(query, data);
        res.redirect("/?message=ToDo created successfully");
    } catch (error) {
        console.error(`Error: ${error}`);
    } finally {
        connection.end();
    }
});

// app.get("/todos", async (req, res) => {
//     const connection = await createDbConnection();
//     console.log(req.body)
//     const todo = req.body;
//     const query = "SELECT * FROM todos;";
//     const data = [todo.item, "open"];

//     try {
//         await connection.execute(query, data);
//         res.redirect("/?message=ToDo created successfully");
//     } catch (error) {
//         console.error(`Error: ${error}`);
//     } finally {
//         connection.end();
//     }
// });





app.post("/update_status/:todo_id/:new_status", async (req, res) => {
    const connection = await createDbConnection();
    const todoId = req.params.todo_id;
    const newStatus = req.params.new_status;
const query = "UPDATE todos SET stat = ? WHERE id = ?";
    const data = [newStatus, todoId];

    try {
        await connection.execute(query, data);
        res.redirect(`/?message=Status of ToDo ${todoId} updated to ${newStatus}`);
    } catch (error) {
        console.error(`Error: ${error}`);
    } finally {
        connection.end();
    }
});

app.post("/update_todo/:todo_id", async (req, res) => {
    const connection = await createDbConnection();
    const todoId = req.params.todo_id;
    const newStatus = req.body.newStatus;
const query = "UPDATE todos SET stat = ? WHERE id = ?";
    const data = [newStatus, todoId];

    try {
        await connection.execute(query, data);
        res.redirect("/?message=Todo updated successfully");
    } catch (error) {
        console.error(`Error: ${error}`);
    } finally {
        connection.end();
    }
});

app.post("/delete_todo/:todo_id", async (req, res) => {
    const connection = await createDbConnection();
    const todoId = req.params.todo_id;
const query = "DELETE FROM todos WHERE id = ?";
    const data = [todoId];

    try {
        await connection.execute(query, data);
        await resetAutoIncrement();
        res.redirect(`/?message=ToDo ${todoId} deleted successfully`);
    } catch (error) {
        console.error(`Error: ${error}`);
    } finally {
        connection.end();
    }
});

app.listen(port, () => {
console.log(`ToDO app started on port ${port}`);
// console.log("ToDO app started on port " + port);
 })

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });