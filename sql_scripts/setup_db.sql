CREATE DATABASE IF NOT EXISTS todosdb;

CREATE USER IF NOT EXISTS 'todo'@'localhost' IDENTIFIED BY 'TodoApp!';

GRANT ALL PRIVILEGES ON todosdb.* TO 'todo'@'localhost';

FLUSH PRIVILEGES;