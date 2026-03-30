import jwt from "jsonwebtoken";

/**
 * Express middleware to authenticate requests using a JWT.
 *
 * Behavior:
 * - Looks for a token in the `Authorization: Bearer <token>` header or `req.cookies.token` (if cookies are used).
 * - Verifies the token using `process.env.JWT_SECRET`.
 * - On success, attaches minimal user info to `req.user` and calls `next()`.
 * - On failure, responds with 401 (no token) or 403 (invalid token).
 *
 * Notes:
 * - Ensure `process.env.JWT_SECRET` is set in your environment (.env).
 * - If you plan to rely on cookies, add `cookie-parser` middleware to your app so `req.cookies` is available.
 */
export function authenticateToken(req, res, next) {
	try {
		// Read token from Authorization header (Bearer token) or cookie
		let token = req.cookies?.token;
		
		// Check for Authorization header with Bearer token
		if (!token && req.headers.authorization) {
			const authHeader = req.headers.authorization;
			if (authHeader.startsWith('Bearer ')) {
				token = authHeader.slice(7); // Remove "Bearer " prefix
			}
		}

		if (!token) {
			return res.status(401).json({ message: "Unauthorized: token required" });
		}

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			// Server misconfiguration — treat as server error rather than auth failure.
			console.error("JWT_SECRET is not set in environment");
			return res.status(500).json({ message: "Server configuration error" });
		}

		jwt.verify(token, secret, (err, payload) => {
			if (err) {
				console.error("Token verification failed:", err.message, "Token:", token.substring(0, 20) + "...");
				return res.status(403).json({ message: "Forbidden: invalid token" });
			}

			// Attach useful user information to the request for downstream handlers.
			// The exact payload shape depends on how tokens are signed (e.g. { id, email }).
			req.user = payload || {};
			next();
		});
	} catch (error) {
		console.error("Error in authenticateToken middleware:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export default authenticateToken;
