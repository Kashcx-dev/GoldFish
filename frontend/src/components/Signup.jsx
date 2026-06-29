import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import goldfishContext from "../Context/goldFishContext";

function Signup() {
	const context = useContext(goldfishContext);
	const { signup, loading } = context;
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		const result = await signup(
			formData.name,
			formData.email,
			formData.password,
		);
		if (result.success) {
			console.log("Registered successfully!");
			navigate("/");
		} else {
			setError(result.error);
		}
	};

	return (
		<div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-4 selection:bg-white selection:text-black">
			<div className="w-full max-w-md bg-[#18181b] border border-zinc-700 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
				<div className="w-12 h-12 rounded-full bg-zinc-800/60 flex items-center justify-center mb-6 border border-zinc-700/50">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-zinc-300"
					>
						<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
				</div>

				<h2 className="text-2xl font-semibold text-white mb-1 tracking-wide">
					Get Started
				</h2>
				<p className="text-sm text-zinc-400 mb-8">
					Create an account to access your dashboard
				</p>

				{error && (
					<div className="w-full mb-6 p-4 bg-[#2c1315]/80 border border-[#e11d48]/20 rounded-2xl text-[#f43f5e] text-[13px] flex items-center gap-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.25"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="shrink-0 text-[#f43f5e]"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						<span className="text-left font-medium leading-normal">
							{error}
						</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="w-full space-y-5">
					<div className="space-y-2">
						<label
							htmlFor="name"
							className="text-xs font-medium text-zinc-400 tracking-wider block"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							placeholder="Enter your name"
							value={formData.name}
							onChange={handleChange}
							className="w-full px-4 py-3 bg-[#242427]/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
							required
							disabled={loading}
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="email"
							className="text-xs font-medium text-zinc-400 tracking-wider block"
						>
							Email
						</label>
						<input
							type="text"
							id="email"
							name="email"
							placeholder="Enter email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-4 py-3 bg-[#242427]/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
							required
							disabled={loading}
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="password"
							className="text-xs font-medium text-zinc-400 tracking-wider block"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="Enter password"
							value={formData.password}
							onChange={handleChange}
							minLength={8}
							className="w-full px-4 py-3 bg-[#242427]/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
							required
							disabled={loading}
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="confirmPassword"
							className="text-xs font-medium text-zinc-400 tracking-wider block"
						>
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							placeholder="Confirm Password"
							value={formData.confirmPassword}
							onChange={handleChange}
							minLength={8}
							className="w-full px-4 py-3 bg-[#242427]/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
							required
							disabled={loading}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full mt-6 py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 text-sm shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Signing Up..." : "Sign Up"}
					</button>
				</form>

				<div className="mt-8 text-center text-sm text-zinc-400">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-white hover:underline font-medium transition duration-200"
					>
						Sign In
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Signup;
