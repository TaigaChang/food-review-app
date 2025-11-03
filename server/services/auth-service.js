import pool from "../db.js";
import Validations from "../validations/auth-validation.js";

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

        const [results] = await pool.query(
            `INSERT INTO users (name_first, name_last, email, password) VALUES (?, ?, ?)`,
            [name_first, name_last, email, password]
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

export{
    signupHandler
}