const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hash, role],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("User created");
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err || result.length === 0) return res.status(400).send("User not found");

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET
);
    res.json({ token });
  });
});

module.exports = router;