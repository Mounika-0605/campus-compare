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
    origin: [
      "https://campus-compare.vercel.app",
      "https://campus-compare-p5wfn8hq4-mounika-0605s-projects.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
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
      (name, location, fees, ranking, placements, image, description)
      VALUES

      (
        'IIT Delhi',
        'Delhi',
        '2 Lakhs/year',
        'Top 5',
        '95%',
        'https://images.unsplash.com/photo-1562774053-701939374585',
        'Excellent engineering institute'
      ),

      (
        'IIT Bombay',
        'Mumbai',
        '2.2 Lakhs/year',
        'Top 3',
        '97%',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
        'Premier IIT in India'
      ),

      (
        'NIT Trichy',
        'Tamil Nadu',
        '1.5 Lakhs/year',
        'Top 15',
        '90%',
        'https://images.unsplash.com/photo-1564981797816-1043664bf78d',
        'Top NIT college'
      ),

      (
        'BITS Pilani',
        'Rajasthan',
        '3 Lakhs/year',
        'Top 10',
        '92%',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
        'Top private engineering college'
      ),

      (
        'VIT Vellore',
        'Tamil Nadu',
        '1.8 Lakhs/year',
        'Top 20',
        '85%',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
        'Popular private university'
      )
    `);

    res.send("Colleges inserted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
