// backend/routes/projects.js
const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { name } = req.body;

  db.query(
    "INSERT INTO projects (name, created_by) VALUES (?, ?)",
    [name, req.user.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Project created");
    }
  );
});

router.get("/", auth, (req, res) => {
  db.query("SELECT * FROM projects", (err, result) => {
    res.json(result);
  });
});

module.exports = router;