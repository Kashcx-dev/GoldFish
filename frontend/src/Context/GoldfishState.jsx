import React, { useState } from "react";
import goldfishContext from "./goldFishContext";

function GoldfishState(props) {
	const host = import.meta.env.BACKEND_HOST || "http://localhost:3000";
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	// Login Function
	const login = async (email, password) => {
		setLoading(true);
		try {
			const response = await fetch(`${host}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			setLoading(false);

			if (data.success) {
				localStorage.setItem("token", data.token);
				setUser(data.user);
				return { success: true };
			} else {
				const errorMsg = data.errors && data.errors.length > 0 
					? data.errors[0].msg 
					: data.error || "Login failed";
				return { success: false, error: errorMsg };
			}
			//eslint-disable-next-line
		} catch (error) {
			setLoading(false);
			return {
				success: false,
				error: "Something went wrong. Please try again.",
			};
		}
	};

	// Signup Function
	const signup = async (name, email, password) => {
		setLoading(true);
		try {
			const response = await fetch(`${host}/api/auth/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			});
			const data = await response.json();
			setLoading(false);

			if (data.success) {
				localStorage.setItem("token", data.token);
				setUser(data.user);
				return { success: true };
			} else {
				const errorMsg = data.errors && data.errors.length > 0 
					? data.errors[0].msg 
					: data.error || "Signup failed";
				return { success: false, error: errorMsg };
			}
			//eslint-disable-next-line
		} catch (error) {
			setLoading(false);
			return {
				success: false,
				error: "Something went wrong. Please try again.",
			};
		}
	};

	// Logout Function
	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<goldfishContext.Provider
			value={{ user, loading, login, signup, logout }}
		>
			{props.children}
		</goldfishContext.Provider>
	);
}

export default GoldfishState;
