const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
  db.query(
    "SELECT id, name, email, role FROM users",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json(result);
    }
  );
});

module.exports = router;
