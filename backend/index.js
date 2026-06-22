const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// MYSQL CONNECTION
// ======================
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
// MOVIES API (FIXED)
// ======================

// GET all movies (FIXED JOIN + safer output)
app.get("/movies", (req, res) => {
  const sql = `
    SELECT
      movies.id,
      movies.title,
      movies.year,
      movies.genre_id,
      genres.name AS genre
    FROM movies
    LEFT JOIN genres
      ON movies.genre_id = genres.id
    ORDER BY movies.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET /movies error:", err);
      return res.status(500).send(err);
    }

    res.json(result);
  });
});

// SEARCH movie
app.get("/movies/search/:title", (req, res) => {
  db.query(
    `
    SELECT
      movies.id,
      movies.title,
      movies.year,
      movies.genre_id,
      genres.name AS genre
    FROM movies
    LEFT JOIN genres
      ON movies.genre_id = genres.id
    WHERE movies.title LIKE ?
    `,
    [`%${req.params.title}%`],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.json(result);
    }
  );
});

// ADD movie (SAFE INT FIX)
app.post("/movies", (req, res) => {
  const { title, year, genre_id } = req.body;

  if (!title || !year || !genre_id) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const gId = Number(genre_id);

  db.query(
    "INSERT INTO movies (title, year, genre_id) VALUES (?, ?, ?)",
    [title, year, gId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json({
        id: result.insertId,
        title,
        year,
        genre_id: gId
      });
    }
  );
});

// UPDATE movie
app.put("/movies/:id", (req, res) => {
  const { title, year, genre_id } = req.body;

  if (!title || !year || !genre_id) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  db.query(
    "UPDATE movies SET title=?, year=?, genre_id=? WHERE id=?",
    [title, year, Number(genre_id), req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json({ message: "Movie updated successfully" });
    }
  );
});

// DELETE movie
app.delete("/movies/:id", (req, res) => {
  db.query(
    "DELETE FROM movies WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json({ message: "Movie deleted successfully" });
    }
  );
});

// ======================
// GENRES API (FIXED SAFE)
// ======================

// GET all genres
app.get("/genres", (req, res) => {
  db.query("SELECT * FROM genres ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// ADD genre
app.post("/genres", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Genre name is required"
    });
  }

  db.query(
    "INSERT INTO genres (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json({
        id: result.insertId,
        name
      });
    }
  );
});

// UPDATE genre
app.put("/genres/:id", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Genre name is required"
    });
  }

  db.query(
    "UPDATE genres SET name=? WHERE id=?",
    [name, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json({ message: "Genre updated successfully" });
    }
  );
});

// DELETE genre (SAFE)
app.delete("/genres/:id", (req, res) => {
  db.query(
    "DELETE FROM genres WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json({ message: "Genre deleted successfully" });
    }
  );
});
app.get("/test", (req, res) => {
  db.query(`
    SELECT * FROM movies
  `, (err, r1) => {
    db.query(`
      SELECT movies.id, movies.title, movies.genre_id, genres.name
      FROM movies
      LEFT JOIN genres ON movies.genre_id = genres.id
    `, (err, r2) => {
      res.json({ raw: r1, joined: r2 });
    });
  });
});
// ======================
// SERVER
// ======================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});