const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error(" DB Connection Failed:", err);
  } else {
    console.log(" MySQL Connected");
    
    // Run schema to ensure tables exist
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    db.query(schema, (err) => {
      if (err) {
        console.error("Failed to run schema:", err);
      } else {
        console.log("Database schema applied successfully");
      }
    });
  }
});

module.exports = db;