import { useState, useEffect, createContext, useRef } from "react";
import { POLL_INTERVAL_MS } from "../constants.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const wasLoggedInRef = useRef(false); // Track previous logged-in state

    // Reusable function to fetch /api/auth/me and update user state
    async function loadMe() {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                setUser(json.user || null);
                wasLoggedInRef.current = true; // Mark as logged in
                return { ok: true, user: json.user || null };
            } else {
                // Server returned 401/403 → cookie expired or invalid
                const wasLoggedIn = wasLoggedInRef.current;
                
                setUser(null);
                wasLoggedInRef.current = false; // Mark as logged out

                // Only show notification if transitioning from logged-in to logged-out
                if (wasLoggedIn && (res.status === 401 || res.status === 403)) {
                    alert('Your session has expired. Please log in again.');
                }

                return { ok: false, status: res.status };
            }
        } catch (err) {
            setUser(null);
            wasLoggedInRef.current = false;
            return { ok: false, error: err };
        }
    }

    useEffect(() => {
        let stopped = false;

        // Initial check on mount
        (async () => {
            await loadMe();
            if (!stopped) setLoading(false);
        })();

        // Periodic polling to detect cookie expiry
        // For testing with 1s cookie, use 1-2s. For production (1h cookie), use 15-60s.
        const id = setInterval(() => {
            loadMe(); // Re-check auth state every interval
        }, POLL_INTERVAL_MS);

        return () => {
            stopped = true;
            clearInterval(id); // Stop polling on unmount
        };
    }, []);

    const login = (userData) => setUser(userData);
    
    const logout = async () => {
        // Optional: call server to clear cookie
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (e) {
            // Ignore errors
        }
        setUser(null);
    };

    return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

