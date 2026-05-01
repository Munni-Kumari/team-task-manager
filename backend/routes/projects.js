const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { name } = req.body;

  db.query(
    "INSERT INTO projects (name, created_by) VALUES (?, ?)",
    [name, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(201).json({ message: "Project created", id: result.insertId });
    }
  );
});

router.get("/", auth, (req, res) => {
  db.query(
    "SELECT p.*, u.name as creator_name FROM projects p JOIN users u ON p.created_by = u.id",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json(result);
    }
  );
});

module.exports = router;