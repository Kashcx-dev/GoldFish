import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import goldfishContext from "../Context/goldFishContext";

function Login() {
	const context = useContext(goldfishContext);
	const { login, loading } = context;
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
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
		const result = await login(formData.email, formData.password);
		if (result.success) {
			console.log("Logged in successfully!");
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
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 text-zinc-300"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
						/>
					</svg>
				</div>

				<h2 className="text-2xl font-semibold text-white mb-1 tracking-wide">
					Welcome Back
				</h2>
				<p className="text-sm text-zinc-400 mb-8">
					Sign in to access your dashboard
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
							htmlFor="email"
							className="text-xs font-medium text-zinc-400 tracking-wider block"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="Enter your email"
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
						{loading ? "Signing In..." : "Sign In"}
					</button>
				</form>

				<div className="mt-8 text-center text-sm text-zinc-400">
					Don't have an account?{" "}
					<Link
						to="/signup"
						className="text-white hover:underline font-medium transition duration-200"
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
