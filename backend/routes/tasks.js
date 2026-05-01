// backend/routes/tasks.js
const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { title, assigned_to, project_id, due_date } = req.body;

  db.query(
    "INSERT INTO tasks (title, assigned_to, project_id, due_date) VALUES (?, ?, ?, ?)",
    [title, assigned_to, project_id, due_date],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Task created");
    }
  );
});

router.get("/", auth, (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    res.json(result);
  });
});

router.put("/:id", auth, (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE tasks SET status=? WHERE id=?",
    [status, req.params.id],
    () => res.send("Updated")
  );
});

module.exports = router;