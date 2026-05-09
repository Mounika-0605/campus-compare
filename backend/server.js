const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(
  cors({
    origin: "https://campus-compare.vercel.app",
  }),
);
app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
