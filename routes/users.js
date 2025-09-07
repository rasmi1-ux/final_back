import express from "express";
import pgClient from "../db.js";

const userRoutes = express.Router();

// localhost:5000/api/users
// GET
userRoutes.get("/", async (req, res) => {
    try {
        const result = await pgClient.query("SELECT * FROM fields");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

userRoutes.get("/home", async (req, res) => {
    try {
        const result = await pgClient.query("SELECT * FROM fields LIMIT 3");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
//check for login
userRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pgClient.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        //add alert
        res.json({ message: "Login successful", user: result.rows[0] });
        
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});


userRoutes.post("/signup", async (req, res) => {
    console.log("Signup request received");
  const { email, password, role } = req.body;
  const exists = await pgClient.query("SELECT * FROM users WHERE email = $1", [email]);
  if (exists.rows.length > 0) return res.status(400).json({ message: "User already exists" });

  const result = await pgClient.query(
    "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
    [email, password, role]
  );
  res.status(201).json({ user: result.rows[0] });
});

userRoutes.post('/booking', async (req, res) => {
  const { fieldId, date, duration, email, price } = req.body;
  try {
    const result = await pgClient.query(
      "INSERT INTO bookings (date, duration, field_id, email, price) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [date, duration, fieldId, email, price]
    );
    res.status(201).json({ booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


userRoutes.get('/bookings/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pgClient.query(
      `SELECT b.*, f.*
       FROM bookings b
       JOIN fields f ON b.field_id = f.id
       WHERE b.email = $1`,
      [email]
    );

    res.json({ bookings: result.rows });
  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


userRoutes.delete("/bookings/:id/:email", async (req, res) => {
  const id = Number(req.params.id);
  const email = req.params.email; // or from auth: req.user.email

  if (!Number.isInteger(id) || !email) {
    return res.status(400).json({ message: "id and email are required" });
  }

  try {
    const { rowCount, rows } = await pgClient.query(
      "DELETE FROM bookings WHERE book_id = $1 AND email = $2 RETURNING *",
      [id, email]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "No matching booking found" });
    }

    return res.json({ deleted: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


//this one should update on duration
userRoutes.put("/bookings/:id/:email", async (req, res) => {
  const id = Number(req.params.id);
  const email = req.params.email; // or from auth: req.user.email
  const { duration,price } = req.body;

  if (!Number.isInteger(id) || !email) {
    return res.status(400).json({ message: "id and email are required" });
  }

  try {
    const { rowCount, rows } = await pgClient.query(
      "UPDATE bookings SET duration = $1, price = $2 WHERE book_id = $3 AND email = $4 RETURNING *",
      [duration, price, id, email]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "No matching booking found" });
    }

    return res.json({ updated: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
userRoutes.get('/history/:email', async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const result = await pgClient.query(
            `SELECT * FROM history WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json([]);
        }

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching booking history:", err);
        res.status(500).json({ message: "Failed to fetch booking history", error: err.message });
    }
});

export default userRoutes;