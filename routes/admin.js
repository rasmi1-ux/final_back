import express from "express";
import pgClient from "../db.js";

const adminRoutes = express.Router();



adminRoutes.post("/fields", async (req, res) => {
    const { field, location, price, img, description, size, amenities, rating } = req.body;

    // Validate required fields
    if (!field || !location || !price || !img || !description || !size || !rating) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Insert the new field into the database
        const query = `
            INSERT INTO fields (field, location, price, rating, img, description, size, amenities)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [field, location, price, rating, img, description, size, amenities];

        const result = await pgClient.query(query, values);

        // Send the inserted field back as a response
        res.status(201).json({ field: result.rows[0] });
    } catch (err) {
        console.error("Error adding field:", err);
        res.status(500).json({ message: "Failed to add new field", error: err.message });
    }
});


// POST - Add a new field (Admin only)
adminRoutes.delete("/fields/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Field ID is required" });
    }

    try {
        const result = await pgClient.query("DELETE FROM fields WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Field not found" });
        }

        res.json({ message: "Field deleted successfully", field: result.rows[0] });
    } catch (err) {
        console.error("Error deleting field:", err);
        res.status(500).json({ message: "Failed to delete field", error: err.message });
    }
});
adminRoutes.get("/allBookings", async (req, res) => {
    try {
        const result = await pgClient.query(`
            SELECT 
                b.book_id,
                b.date,
                b.duration,
                b.field_id AS booking_field_id,
                b.email,
                b.price AS booking_price,
                f.id AS field_id,
                f.field AS field_name,
                f.location,
                f.rating AS rate,
                f.img,
                f.description,
                f.size,
                f.amenities,
                f.price AS field_price
            FROM bookings b
            LEFT JOIN fields f ON b.field_id = f.id
          
        `);

        if (result.rows.length === 0) {
            return res.status(404).json([]);
        }

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ 
            message: "Failed to fetch bookings", 
            error: err.message 
        });
    }
});


adminRoutes.post("/bookings", async (req, res) => {
    const { date:date, duration:duration, field_id:field_id, email:email, price:price, img:img, field:field } = req.body;

    if (!date || !duration || !field_id || !email || !price || !img || !field) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await pgClient.query(
            "INSERT INTO history (date, duration, field_id, email, price,img_,field) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
            [date, duration, field_id, email, price,img,field]
        );

        res.status(201).json({ booking: result.rows[0] });
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ message: "Failed to create booking", error: err.message });
    }
});

adminRoutes.delete("/bookings/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Booking ID is required" });
    }

    try {
        const result = await pgClient.query("DELETE FROM bookings WHERE book_id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "Booking deleted successfully", booking: result.rows[0] });
    } catch (err) {
        console.error("Error deleting booking:", err);
        res.status(500).json({ message: "Failed to delete booking", error: err.message });
    }
});


export default adminRoutes;