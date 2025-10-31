// get data from user and validate and create user
function signupHandler(req, res, next) {
    try {
        console.log("Signup request received:", req.body);
        return res.json({ message: "Signup endpoint reached", data: req.body });
    }
    catch (error) {
        console.error("Error in signup function in auth-service:", error);
		return res.status(500).json({ message: "Internal server error" });
    }
}

export{
    signupHandler
}