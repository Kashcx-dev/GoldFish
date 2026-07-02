import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import goldfishContext from "../Context/goldFishContext";

function Dashboard() {
	const { user, getUser, logout, loading } = useContext(goldfishContext);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}
		getUser();
		//eslint-disable-next-line
	}, []);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	if (!user && !loading) {
		return null;
	}

	const memberSince = user?.created_at
		? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
		: "—";

	const tokenCount = user?.token_count ?? 0;
	const tokenPercent = Math.min((tokenCount / 1000) * 100, 100);

	return (
		<div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-6 selection:bg-white selection:text-black">
			{/* Header */}
			<div className="max-w-5xl mx-auto">
				<div className="flex items-center justify-between mb-10">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
							{user?.name?.charAt(0)?.toUpperCase() || "G"}
						</div>
						<div>
							<h1 className="text-lg font-semibold text-white">
								Welcome back, {user?.name || "User"}
							</h1>
							<p className="text-xs text-zinc-500">GoldFish Dashboard</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className="px-4 py-2 text-sm text-zinc-400 border border-zinc-800 rounded-xl hover:text-white hover:border-zinc-600 transition-all duration-200"
					>
						Sign Out
					</button>
				</div>

				{/* Stats Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
					{/* Account Info */}
					<div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 rounded-lg bg-zinc-800/60 flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
									<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
							</div>
							<h3 className="text-sm font-medium text-zinc-400">Account</h3>
						</div>
						<p className="text-white font-semibold text-lg mb-1">{user?.name || "—"}</p>
						<p className="text-zinc-500 text-sm">{user?.email || "—"}</p>
					</div>

					{/* Token Usage */}
					<div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 rounded-lg bg-zinc-800/60 flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="8" x2="12" y2="16"></line>
									<line x1="8" y1="12" x2="16" y2="12"></line>
								</svg>
							</div>
							<h3 className="text-sm font-medium text-zinc-400">Tokens Remaining</h3>
						</div>
						<p className={`font-bold text-3xl mb-2 ${tokenCount <= 0 ? 'text-red-400' : 'text-white'}`}>
							{tokenCount.toLocaleString()}
						</p>
						<div className="w-full bg-zinc-800 rounded-full h-2">
							<div
								className={`h-2 rounded-full transition-all duration-500 ${tokenCount <= 0 ? 'bg-red-500' : tokenPercent > 50 ? 'bg-emerald-500' : tokenPercent > 20 ? 'bg-amber-400' : 'bg-red-400'}`}
								style={{ width: `${tokenPercent}%` }}
							></div>
						</div>
					</div>

					{/* Member Since */}
					<div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 rounded-lg bg-zinc-800/60 flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
									<line x1="16" y1="2" x2="16" y2="6"></line>
									<line x1="8" y1="2" x2="8" y2="6"></line>
									<line x1="3" y1="10" x2="21" y2="10"></line>
								</svg>
							</div>
							<h3 className="text-sm font-medium text-zinc-400">Member Since</h3>
						</div>
						<p className="text-white font-semibold text-lg">{memberSince}</p>
						<p className="text-zinc-500 text-sm mt-1">Free Tier</p>
					</div>
				</div>

				{/* Subscription Placeholder */}
				<div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-8 text-center">
					<div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
							<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-white mb-2">Subscription & Billing</h3>
					<p className="text-zinc-500 text-sm max-w-md mx-auto">
						Manage your plan, view invoices, and upgrade your token quota. Coming soon.
					</p>
					<button className="mt-6 px-6 py-2.5 bg-zinc-800 text-zinc-300 font-medium rounded-xl text-sm hover:bg-zinc-700 transition-all duration-200 cursor-not-allowed opacity-60">
						Coming Soon
					</button>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
