
const express = require("express");
const Database = require("better-sqlite3");
const cors= require("cors");

const app = express();
app.use(cors());

app.use(express.json());

const db = new Database("tasks.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`);

app.get("/api/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();

  res.json(tasks);
});

app.get("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const result = db
    .prepare("INSERT INTO tasks (title) VALUES (?)")
    .run(title);

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const existingTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  db.prepare(`
    UPDATE tasks
    SET title = ?, completed = ?
    WHERE id = ?
  `).run(title, completed ? 1 : 0, id);

  const updatedTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  res.json(updatedTask);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const result = db
    .prepare("DELETE FROM tasks WHERE id = ?")
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted successfully" });
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});














