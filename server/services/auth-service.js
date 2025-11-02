import pool from "../db.js";

// get data from user and validate and create user
function signupHandler(req, res, next) {
    try {

        const { name, email, hashed_password, created_at } = req.body;

        return res.json({ 
            message: "Signup endpoint reached", 
            receivedData: req.body 
        });
    }
    catch (error) {
        console.error("Error in signup function in auth-service:", error);
		return res.status(500).json({ message: "Internal server error" });
    }
}

export{
    signupHandler
}