
const tasks = [
  {
    id: 1,
    title: "Learn Node.js",
    completed: false
  },
  {
    id: 2,
    title: "Build a REST API",
    completed: false
  },
  {
    id: 3,
    title: "Connect a database",
    completed: false
  }
];

const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});














