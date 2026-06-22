const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ramin2002",
  database: "movie_db"
});

db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected!");
  }
});

// ======================
// MOVIES API
// ======================

// GET all movies
app.get("/movies", (req, res) => {
  const sql = `
    SELECT movies.id, movies.title, movies.year, genres.name AS genre
    FROM movies
    LEFT JOIN genres ON movies.genre_id = genres.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// ADD movie
app.post("/movies", (req, res) => {
  const { title, year, genre_id } = req.body;

  db.query(
    "INSERT INTO movies (title, year, genre_id) VALUES (?, ?, ?)",
    [title, year, genre_id],
    (err, result) => {
      if (err) return res.send(err);
      res.json({ id: result.insertId, title, year, genre_id });
    }
  );
});

// DELETE movie
app.delete("/movies/:id", (req, res) => {
  db.query(
    "DELETE FROM movies WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.send(err);
      res.json({ message: "Deleted" });
    }
  );
});

// ======================
// SERVER
// ======================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});