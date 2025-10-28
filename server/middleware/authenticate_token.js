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
		const authHeader = req.headers.authorization || req.headers.Authorization;
		let token;

		if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
			token = authHeader.split(" ")[1];
		} else if (req.cookies && req.cookies.token) {
			token = req.cookies.token;
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
				return res.status(403).json({ message: "Forbidden: invalid token" });
			}

			// Attach useful user information to the request for downstream handlers.
			// The exact payload shape depends on how tokens are signed (e.g. { id, email }).
			req.user = payload || {};
			next();
		});
	} catch (e) {
		console.error("Error in authenticateToken middleware:", e);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export default authenticateToken;
