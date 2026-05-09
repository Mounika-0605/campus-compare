require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

/* ---------- AUTO CREATE TABLES ---------- */

pool.query(`
CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  location VARCHAR(255),
  fees VARCHAR(100),
  ranking VARCHAR(100),
  placements VARCHAR(255),
  image TEXT,
  description TEXT
);
`);

pool.query(`
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  college_id INTEGER,
  question TEXT,
  answer TEXT
);
`);

pool.query(`
INSERT INTO colleges
(name, location, fees, ranking, placements, image, description)
VALUES
(
  'IIT Hyderabad',
  'Hyderabad',
  '2 Lakhs/year',
  'Top 10',
  '95%',
  'https://images.unsplash.com/photo-1562774053-701939374585',
  'Excellent engineering institute'
),
(
  'NIT Warangal',
  'Warangal',
  '1.5 Lakhs/year',
  'Top 20',
  '90%',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
  'Top national institute'
)
ON CONFLICT DO NOTHING;
`);

/* ---------- MIDDLEWARE ---------- */

app.use(
  cors({
    origin: "https://campus-compare.vercel.app",
  }),
);

app.use(express.json());

/* ---------- ROUTES ---------- */

app.get("/", (req, res) => {
  res.send("Server working");
});

app.get("/colleges", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM colleges");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/questions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM questions ORDER BY id DESC");

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/questions", async (req, res) => {
  try {
    const { college_id, question } = req.body;

    await pool.query(
      "INSERT INTO questions (college_id, question) VALUES ($1, $2)",
      [college_id, question],
    );

    res.json({ message: "Question added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/questions/:id", async (req, res) => {
  try {
    const { answer } = req.body;

    await pool.query("UPDATE questions SET answer=$1 WHERE id=$2", [
      answer,
      req.params.id,
    ]);

    res.json({ message: "Answer saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- SERVER ---------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/seed-colleges", async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO colleges
      (id, name, location, fees, rating, placement_percentage, courses)
      VALUES

      (1, 'IIT Delhi', 'Delhi', 200000, 4.8, 95, ARRAY['CSE','ECE']),
      (2, 'IIT Bombay', 'Mumbai', 220000, 4.9, 97, ARRAY['CSE','Mechanical']),
      (3, 'NIT Trichy', 'Tamil Nadu', 150000, 4.5, 90, ARRAY['CSE','Civil']),
      (4, 'BITS Pilani', 'Rajasthan', 300000, 4.7, 92, ARRAY['CSE','EEE']),
      (5, 'VIT Vellore', 'Tamil Nadu', 180000, 4.3, 85, ARRAY['CSE','IT']),
      (6, 'SRM University', 'Tamil Nadu', 250000, 4.2, 85, ARRAY['CSE','ECE']),
      (7, 'Amity University', 'Noida', 300000, 4.0, 80, ARRAY['CSE','MBA']),
      (8, 'Delhi University', 'Delhi', 50000, 4.5, 88, ARRAY['BA','BCom']),
      (9, 'JNTU Hyderabad', 'Telangana', 90000, 4.1, 82, ARRAY['CSE','EEE']),
      (10, 'Anna University', 'Tamil Nadu', 70000, 4.4, 87, ARRAY['CSE','Civil']),
      (11, 'SRM University 2', 'Tamil Nadu', 250000, 4.2, 85, ARRAY['CSE','ECE']),
      (12, 'Amity University 2', 'Noida', 300000, 4.0, 80, ARRAY['CSE','MBA']),
      (13, 'Delhi University 2', 'Delhi', 50000, 4.5, 88, ARRAY['BA','BCom']),
      (14, 'JNTU Hyderabad 2', 'Telangana', 90000, 4.1, 82, ARRAY['CSE','EEE']),
      (15, 'Anna University 2', 'Tamil Nadu', 70000, 4.4, 87, ARRAY['CSE','Civil'])

    `);

    res.send("15 colleges inserted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
