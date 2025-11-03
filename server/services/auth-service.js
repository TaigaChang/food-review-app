import pool from "../db.js";
import Validations from "../validations/auth-validation.js";
import bcrypt from "bcrypt";

// get data from user and validate and create user
async function signupHandler(req, res, next) {

    const { name_first, name_last, email, password } = req.body;
    const userFields = { name_first, name_last, email, password };
    
    try {

        for (const field in userFields) {
            const isValid = await Validations[field](userFields[field]);
            if (!isValid) {
                return res.status(400).json({ message: `Invalid field: ${field}` });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [results] = await pool.query(
            `INSERT INTO users (name_first, name_last, email, password) VALUES (?, ?, ?, ?)`,
            [name_first, name_last, email, hashedPassword]
        );

        return res.status(201).json({
            message: "User created successfully",
            user_id: results.insertId,
        });
    }
    catch (error) {
        console.error("Error in signing up user:", error);
		return res.status(500).json({ message: error.sqlMessage });
    }
}

async function loginHandler(req, res, next) {
    
    const { email, password } = req.body;
    const userFields = { email, password };

    try {
        for (const field in userFields) {
            const isValid = await Validations[field](userFields[field]);
            if (!isValid) {
                return res.status(400).json({ message: `Invalid field: ${field}` });
            }
        }
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email" });
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
        }

        return res.status(200).json({ message: "Login successful", user_id: user.id });
    }
    catch (error) {
        console.error("Error in logging in:", error);
        return res.status(500).json({ message: error.sqlMessage });
    }
}

export{
    signupHandler,
    loginHandler
}