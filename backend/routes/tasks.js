const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.post("/", auth, isAdmin, (req, res) => {
  const { title, assigned_to, project_id, due_date } = req.body;

  db.query(
    "INSERT INTO tasks (title, assigned_to, project_id, due_date) VALUES (?, ?, ?, ?)",
    [title, assigned_to, project_id, due_date],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(201).json({ message: "Task created", id: result.insertId });
    }
  );
});

router.get("/", auth, (req, res) => {
  db.query(
    "SELECT t.*, u.name as assignee_name, p.name as project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json(result);
    }
  );
});

router.put("/:id", auth, (req, res) => {
  const { status, title, due_date } = req.body;
  
  db.query(
    "UPDATE tasks SET status=COALESCE(?, status), title=COALESCE(?, title), due_date=COALESCE(?, due_date) WHERE id=?",
    [status, title, due_date, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "Task updated" });
    }
  );
});

module.exports = router;