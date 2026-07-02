import React, { useState } from "react";
import goldfishContext from "./goldFishContext";

function GoldfishState(props) {
	const host = import.meta.env.VITE_BACKEND_HOST || "http://localhost:8000";
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	const login = async (email, password) => {
		setLoading(true);
		try {
			const response = await fetch(`${host}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			setLoading(false);

			if (data.success) {
				if (data.requires2FA) {
					return { success: true, requires2FA: true, email };
				}
				localStorage.setItem("token", data.token);
				setUser(data.user);
				return { success: true, requires2FA: false };
			} else {
				const errorMsg =
					data.errors && data.errors.length > 0
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

	const verifyLoginOtp = async (email, otp) => {
		setLoading(true);
		try {
			const response = await fetch(`${host}/api/auth/verify-otp`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp }),
			});
			const data = await response.json();
			setLoading(false);

			if (data.success) {
				localStorage.setItem("token", data.token);
				setUser(data.user);
				return { success: true };
			} else {
				return {
					success: false,
					error: data.error || "Verification failed",
				};
			}
			//eslint-disable-next-line
		} catch (error) {
			setLoading(false);
			return { success: false, error: "Something went wrong." };
		}
	};

	const signup = async (name, email, password) => {
		setLoading(true);
		try {
			const response = await fetch(`${host}/api/auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			const data = await response.json();
			setLoading(false);

			if (data.success) {
				if (data.requires2FA) {
					return { success: true, requires2FA: true, email };
				}
				localStorage.setItem("token", data.token);
				setUser(data.user);
				return { success: true, requires2FA: false };
			} else {
				const errorMsg =
					data.errors && data.errors.length > 0
						? data.errors[0].msg
						: data.error || "Signup failed";
				return { success: false, error: errorMsg };
			}
			//eslint-disable-next-line
		} catch (error) {
			setLoading(false);
			return { success: false, error: "Something went wrong." };
		}
	};

	const verifySignupOtp = async (email, otp) => {
		setLoading(true);
		try {
			const response = await fetch(`${host}/api/auth/verify-signup-otp`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp }),
			});
			const data = await response.json();
			setLoading(false);

			if (data.success) {
				localStorage.setItem("token", data.token);
				setUser(data.user);
				return { success: true };
			} else {
				return {
					success: false,
					error: data.error || "Verification failed",
				};
			}
			//eslint-disable-next-line
		} catch (error) {
			setLoading(false);
			return { success: false, error: "Something went wrong." };
		}
	};

	const getUser = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;
		try {
			const response = await fetch(`${host}/api/auth/getuser`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			if (data.success) {
				setUser(data.user);
			}
		} catch (error) {
			console.error("Failed to fetch user:", error);
		}
	};

	// useEffect(() => {
	// 	getUser();
	// }, []);

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<goldfishContext.Provider
			value={{
				user,
				loading,
				login,
				signup,
				verifyLoginOtp,
				verifySignupOtp,
				getUser,
				logout,
			}}
		>
			{props.children}
		</goldfishContext.Provider>
	);
}

export default GoldfishState;
