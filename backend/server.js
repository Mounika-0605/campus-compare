require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

/* ---------- MIDDLEWARE ---------- */

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

/* ---------- CREATE TABLES ---------- */

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

/* ---------- HOME ---------- */

app.get("/", (req, res) => {
  res.send("Server working");
});

/* ---------- GET COLLEGES ---------- */

app.get("/colleges", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        location,
        fees,
        ranking,
        placements AS placement_percentage,
        image,
        description
      FROM colleges
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* ---------- GET SINGLE COLLEGE ---------- */

app.get("/colleges/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM colleges WHERE id=$1", [
      req.params.id,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* ---------- QUESTIONS ---------- */

app.get("/questions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM questions ORDER BY id DESC");

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* ---------- ADD QUESTION ---------- */

app.post("/questions", async (req, res) => {
  try {
    const { college_id, question } = req.body;

    await pool.query(
      "INSERT INTO questions (college_id, question) VALUES ($1, $2)",
      [college_id, question],
    );

    res.json({
      message: "Question added",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* ---------- ANSWER QUESTION ---------- */

app.put("/questions/:id", async (req, res) => {
  try {
    const { answer } = req.body;

    await pool.query("UPDATE questions SET answer=$1 WHERE id=$2", [
      answer,
      req.params.id,
    ]);

    res.json({
      message: "Answer saved",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* ---------- RESET + INSERT COLLEGES ---------- */

app.get("/seed-colleges", async (req, res) => {
  try {
    await pool.query("DELETE FROM colleges");

    await pool.query("ALTER SEQUENCE colleges_id_seq RESTART WITH 1");

    await pool.query(`
      INSERT INTO colleges
      (name, location, fees, ranking, placements, image, description)

      VALUES

      ('IIT Delhi','Delhi','2 Lakhs/year','Top 5','95%','https://images.unsplash.com/photo-1562774053-701939374585','Top IIT college'),

      ('IIT Bombay','Mumbai','2.2 Lakhs/year','Top 3','97%','https://images.unsplash.com/photo-1523050854058-8df90110c9f1','Premier IIT'),

      ('NIT Trichy','Tamil Nadu','1.5 Lakhs/year','Top 15','90%','https://images.unsplash.com/photo-1564981797816-1043664bf78d','Top NIT'),

      ('BITS Pilani','Rajasthan','3 Lakhs/year','Top 10','92%','https://images.unsplash.com/photo-1541339907198-e08756dedf3f','Top private college'),

      ('VIT Vellore','Tamil Nadu','1.8 Lakhs/year','Top 20','85%','https://images.unsplash.com/photo-1523240795612-9a054b0db644','Popular private university'),

      ('SRM University','Chennai','2 Lakhs/year','Top 25','85%','https://images.unsplash.com/photo-1498243691581-b145c3f54a5a','Leading private university'),

      ('Amity University','Noida','3 Lakhs/year','Top 40','80%','https://images.unsplash.com/photo-1562774053-701939374585','Well known private university'),

      ('Delhi University','Delhi','50K/year','Top 15','88%','https://images.unsplash.com/photo-1523050854058-8df90110c9f1','Top central university'),

      ('JNTU Hyderabad','Telangana','90K/year','Top 30','82%','https://images.unsplash.com/photo-1564981797816-1043664bf78d','Famous engineering university'),

      ('Anna University','Tamil Nadu','70K/year','Top 20','87%','https://images.unsplash.com/photo-1541339907198-e08756dedf3f','Popular government university'),

      ('Osmania University','Hyderabad','60K/year','Top 35','78%','https://images.unsplash.com/photo-1523240795612-9a054b0db644','Historic university'),

      ('IIT Hyderabad','Hyderabad','2 Lakhs/year','Top 10','95%','https://images.unsplash.com/photo-1562774053-701939374585','Excellent engineering institute'),

      ('NIT Warangal','Warangal','1.5 Lakhs/year','Top 20','90%','https://images.unsplash.com/photo-1523050854058-8df90110c9f1','Top national institute'),

      ('Manipal University','Manipal','2.5 Lakhs/year','Top 30','84%','https://images.unsplash.com/photo-1498243691581-b145c3f54a5a','Popular private university'),

      ('KL University','Vijayawada','1.2 Lakhs/year','Top 50','80%','https://images.unsplash.com/photo-1523240795612-9a054b0db644','Growing private university');

    `);

    res.send("15 colleges inserted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* ---------- SERVER ---------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
