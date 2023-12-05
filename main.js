const express = require('express');
const mysql = require('mysql2/promise');
// const ejs = require('ejs');
// const path = require('path');

const app = express();
const port = 8000;

app.use(express.json());


const DB_USER = "todo";
const DB_PASSWORD = "1234";
const DB_HOST = "localhost";
const DB_NAME = "todosdb";

const templates = "templates";

app.use(express.urlencoded({ extended: true }));

// Serve static files (for example, CSS)
// app.use('/static', express.static(path.join(__dirname, 'static')));

let connection;

async function createDBConnection() {
    try {
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
        });
        console.log("Connected to the database");
    } catch (error) {
        console.error(`Error connecting to the database: ${error}`);
        throw error;
    }
}

async function resetAutoIncrement() {
    const query = "ALTER TABLE todos AUTO_INCREMENT = 1";
    await connection.execute(query);
}


// app.get("/", (req, res) => {
//     console.log("Req:", req);
//     res.send("Hello World!");
//  })

//  app.post("/hello", (request, response) => {
//     console.log("Req:", request.body);
//     response.status(200).send("Hello AWS23-07!");
//  })



 app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
    await createDBConnection();
    await resetAutoIncrement();
})


// app.listen(port, () => {
//     console.log(`ToDO app started on port ${port}`);
//     // console.log("ToDO app started on port" + port);
// })

