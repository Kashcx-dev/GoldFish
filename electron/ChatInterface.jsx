import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import goldfishContext from "../Context/goldFishContext";

function ChatInterface() {
	const context = useContext(goldfishContext);
	const { user, getUser, logout } = context;
	const navigate = useNavigate();

	const [showAuthModal, setShowAuthModal] = useState(false);

	useEffect(() => {
		getUser();
		//eslint-disable-next-line
	}, []);

	const getInitials = (name) => {
		if (!name) return "GF";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [chats, setChats] = useState([
		{
			id: "1",
			title: "Design System Guidelines",
			messages: [],
		},
		{
			id: "2",
			title: "PostgreSQL Schema Setup",
			messages: [],
		},
		{
			id: "3",
			title: "Vite + Tailwind V4 Config",
			messages: [],
		},
	]);
	const [activeChatId, setActiveChatId] = useState("1");
	const [input, setInput] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const messagesEndRef = useRef(null);

	const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [activeChat?.messages]);

	const handleSend = (textToSend) => {
		const messageText = textToSend || input;
		if (!messageText.trim()) return;

		if (!user) {
			setShowAuthModal(true);
			return;
		}

		//Add user message
		const updatedChats = chats.map((chat) => {
			if (chat.id === activeChatId) {
				return {
					...chat,
					title:
						chat.messages.length === 0
							? messageText.substring(0, 30) +
								(messageText.length > 30 ? "..." : "")
							: chat.title,
					messages: [
						...chat.messages,
						{ sender: "user", text: messageText },
					],
				};
			}
			return chat;
		});
		setChats(updatedChats);
		setInput("");
		setIsGenerating(true);

		//Simulate AI stream / reply after a brief timeout
		setTimeout(() => {
			setChats((prevChats) =>
				prevChats.map((chat) => {
					if (chat.id === activeChatId) {
						return {
							...chat,
							messages: [
								...chat.messages,
								{
									sender: "ai",
									text: `I've received your prompt: "${messageText}". I am currently working as a mock interface, but I will process this once connected to the backend API!`,
								},
							],
						};
					}
					return chat;
				}),
			);
			setIsGenerating(false);
		}, 1000);
	};

	const handleNewChat = () => {
		const newId = String(Date.now());
		const newChat = {
			id: newId,
			title: "New Chat",
			messages: [],
		};
		setChats([newChat, ...chats]);
		setActiveChatId(newId);
	};

	const handleDeleteChat = (idToDelete, e) => {
		e.stopPropagation();
		const remaining = chats.filter((c) => c.id !== idToDelete);
		setChats(remaining);
		if (activeChatId === idToDelete && remaining.length > 0) {
			setActiveChatId(remaining[0].id);
		} else if (remaining.length === 0) {
			//eslint-disable-next-line
			const newId = String(Date.now());
			setChats([{ id: newId, title: "New Chat", messages: [] }]);
			setActiveChatId(newId);
		}
	};

	const quickPrompts = [
		{
			title: "Design Guidelines",
			desc: "Create a design system mockup",
			text: "Can you help me design a dark mode color palette?",
		},
		{
			title: "Database Schema",
			desc: "Design a schema for a POS app",
			text: "Create a PostgreSQL database schema for a POS (Point of Sale) system.",
		},
		{
			title: "Code React Component",
			desc: "Generate an auth form in React",
			text: "Write a React component for a clean glassmorphism Login form.",
		},
		{
			title: "Explain concepts",
			desc: "Explain APIs like I am five",
			text: "Explain what REST APIs are to a 5-year old.",
		},
	];

	return (
		<div className="flex h-screen w-screen bg-[#09090b] text-[#f4f4f5] overflow-hidden font-sans selection:bg-white selection:text-black">
			{/* SIDEBAR */}
			<div
				className={`bg-[#0d0d0f] border-r border-zinc-800/60 flex flex-col transition-all duration-300 ${
					isSidebarOpen ? "w-64" : "w-0 border-r-0"
				} overflow-hidden`}
			>
				{/* Header Actions */}
				<div className="p-3 flex items-center justify-between gap-2 shrink-0">
					<button
						onClick={handleNewChat}
						className="flex-1 flex items-center justify-between px-3 py-2 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-sm font-medium transition duration-200 cursor-pointer active:scale-[0.98]"
					>
						<span className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 4.5v15m7.5-7.5h-15"
								/>
							</svg>
							New chat
						</span>
					</button>

					{/* Collapse Button inside sidebar for desktop */}
					<button
						onClick={() => setIsSidebarOpen(false)}
						className="p-2 hover:bg-zinc-800 border border-transparent hover:border-zinc-800 rounded-xl transition cursor-pointer text-zinc-400 hover:text-white"
						title="Collapse sidebar"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
							/>
						</svg>
					</button>
				</div>

				{/* Chat List */}
				<div className="flex-1 overflow-y-auto px-2 space-y-1 py-2 scrollbar-thin">
					<div className="text-[11px] font-bold text-zinc-500 px-3 py-1 tracking-wider uppercase">
						Recent Chats
					</div>
					{chats.map((chat) => (
						<div
							key={chat.id}
							onClick={() => setActiveChatId(chat.id)}
							className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-sm transition-all duration-200 ${
								chat.id === activeChatId
									? "bg-zinc-800 text-white font-medium shadow-sm"
									: "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
							}`}
						>
							<div className="flex items-center gap-2 overflow-hidden pr-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="15"
									height="15"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
									className="shrink-0 opacity-70"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.12 2.9 2.68 2.94 1.07.02 2.22.02 3.32-.01l3.07 3.07a.75.75 0 0 0 1.28-.53V17.02c1.23-.05 2.45-.16 3.65-.33A2.94 2.94 0 0 0 21 13.82V7.18a2.94 2.94 0 0 0-2.68-2.94A42.43 42.43 0 0 0 12 4.18c-2.45 0-4.83.1-7.18.26A2.94 2.94 0 0 0 2.25 7.18v6.64z"
									/>
								</svg>
								<span className="truncate">{chat.title}</span>
							</div>

							<button
								onClick={(e) => handleDeleteChat(chat.id, e)}
								className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700/60 rounded text-zinc-400 hover:text-red-400 transition duration-150"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
					))}
				</div>

				{/* User Profile / Footer */}
				<div className="p-4 border-t border-zinc-800/60 shrink-0 bg-[#0b0b0c]">
					{user ? (
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 overflow-hidden">
								<div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner">
									{getInitials(user?.name)}
								</div>
								<div className="flex flex-col overflow-hidden">
									<span className="text-xs font-semibold text-white leading-none truncate">
										{user?.name || "Goldfish User"}
									</span>
									<span className="text-[10px] text-zinc-500 truncate mt-1">
										{user?.email || "user@goldfish.ai"}
									</span>
								</div>
							</div>
							<button
								onClick={logout}
								className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition cursor-pointer"
								title="Log Out"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l-3-3m0 0l-3 3m3-3v12"
									/>
								</svg>
							</button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<button
								onClick={() => navigate("/login")}
								className="flex-1 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all duration-150 cursor-pointer text-center"
							>
								Sign In
							</button>
							<button
								onClick={() => navigate("/signup")}
								className="flex-1 py-2 bg-transparent text-zinc-400 hover:text-white border border-zinc-850 hover:border-zinc-700 font-semibold text-xs rounded-xl active:scale-[0.98] transition-all duration-150 cursor-pointer text-center"
							>
								Sign Up
							</button>
						</div>
					)}
				</div>
			</div>

			{/* MAIN CHAT AREA */}
			<div className="flex-1 flex flex-col h-full bg-[#121214] relative">
				{/* Top Header */}
				<div className="h-14 border-b border-zinc-800/50 flex items-center px-4 justify-between bg-[#121214]/65 backdrop-blur-md z-10 shrink-0">
					<div className="flex items-center gap-3">
						{!isSidebarOpen && (
							<button
								onClick={() => setIsSidebarOpen(true)}
								className="p-2 hover:bg-zinc-800/80 rounded-xl transition cursor-pointer text-zinc-400 hover:text-white"
								title="Open sidebar"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M11.25 4.5l7.5 7.5-7.5 7.5m6-15l-7.5 7.5 7.5 7.5"
									/>
								</svg>
							</button>
						)}
						<span className="font-semibold text-white tracking-wide flex items-center gap-2 text-sm bg-zinc-800/40 border border-zinc-800 px-3 py-1 rounded-full">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
							Goldfish v1.0
						</span>
					</div>

					<div className="flex items-center gap-2">
						{/* Clear Chat option */}
						<button
							onClick={() => {
								setChats(
									chats.map((c) =>
										c.id === activeChatId
											? { ...c, messages: [] }
											: c,
									),
								);
							}}
							className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
						>
							Clear Thread
						</button>
					</div>
				</div>

				{/* Conversation Messages */}
				<div className="flex-1 overflow-y-auto scrollbar-thin py-6 px-4 md:px-8 space-y-6">
					{activeChat.messages.length === 0 ? (
						// LANDING STATE (No messages)
						<div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8 select-none py-12">
							<div className="space-y-3">
								<div className="w-16 h-16 rounded-3xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center mx-auto shadow-lg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="1.5"
										className="text-white"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM12.75 9a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"
										/>
									</svg>
								</div>
								<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-4">
									How can I help you today?
								</h1>
								<p className="text-sm text-zinc-400 max-w-md mx-auto">
									Ask Goldfish to write schemas, refactor routes,
									create interactive components, or explain code
									concepts.
								</p>
							</div>

							{/* Quick suggestions */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
								{quickPrompts.map((prompt, i) => (
									<button
										key={i}
										onClick={() => handleSend(prompt.text)}
										className="p-4 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-left transition duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
									>
										<div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition">
											{prompt.title}
										</div>
										<div className="text-[11px] text-zinc-500 mt-1 leading-normal">
											{prompt.desc}
										</div>
									</button>
								))}
							</div>
						</div>
					) : (
						// MESSAGE LIST
						<div className="max-w-3xl mx-auto space-y-6">
							{activeChat.messages.map((msg, idx) => (
								<div
									key={idx}
									className={`flex gap-4 ${
										msg.sender === "user"
											? "justify-end"
											: "justify-start"
									}`}
								>
									{/* AI Avatar */}
									{msg.sender === "ai" && (
										<div className="w-8 h-8 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
												className="text-emerald-400"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18z"
												/>
											</svg>
										</div>
									)}

									{/* Message bubble */}
									<div
										className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
											msg.sender === "user"
												? "bg-[#f4f4f5] text-[#09090b] font-medium"
												: "bg-zinc-850 border border-zinc-800 text-zinc-200"
										}`}
									>
										{msg.text}
									</div>

									{/* User Avatar */}
									{msg.sender === "user" && (
										<div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-750 flex items-center justify-center shrink-0 shadow-sm text-xs font-bold text-white mt-0.5">
											{getInitials(user?.name)}
										</div>
									)}
								</div>
							))}

							{/* Loading Stream effect */}
							{isGenerating && (
								<div className="flex gap-4 justify-start">
									<div className="w-8 h-8 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center shrink-0 shadow-sm">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											className="text-emerald-400"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18z"
											/>
										</svg>
									</div>
									<div className="bg-zinc-850 border border-zinc-800 text-zinc-400 rounded-2xl px-4 py-3 text-sm flex items-center gap-1">
										<span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce"></span>
										<span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce [animation-delay:0.2s]"></span>
										<span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce [animation-delay:0.4s]"></span>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>
					)}
				</div>

				{/* Floating Input Capsule */}
				<div className="p-4 bg-linear-to-t from-[#121214] via-[#121214] to-transparent shrink-0">
					<div className="max-w-3xl mx-auto relative">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSend();
							}}
							className="relative bg-zinc-850/80 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-md flex items-end p-2 focus-within:border-zinc-700 transition"
						>
							<textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSend();
									}
								}}
								rows={1}
								placeholder="Message Goldfish..."
								className="flex-1 max-h-48 py-2 px-3 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none resize-none align-bottom scrollbar-none"
								style={{ height: "auto" }}
							/>
							<button
								type="submit"
								disabled={!input.trim() || isGenerating}
								className="p-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl transition duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
									/>
								</svg>
							</button>
						</form>
						<p className="text-[10px] text-zinc-500 text-center mt-2 tracking-wide">
							Goldfish can make mistakes. Consider checking important
							info.
						</p>
					</div>
				</div>
			</div>

			{showAuthModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
					<div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
						<div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mx-auto">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
								className="text-white"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
								/>
							</svg>
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-bold text-white tracking-wide">
								Sign In to Continue
							</h3>
							<p className="text-xs text-zinc-400 leading-relaxed">
								You need an account to save your chat threads and
								message the AI assistant.
							</p>
						</div>
						<div className="flex flex-col gap-2 pt-2">
							<button
								onClick={() => navigate("/login")}
								className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all duration-150 cursor-pointer text-sm"
							>
								Sign In
							</button>
							<button
								onClick={() => navigate("/signup")}
								className="w-full py-3 bg-transparent text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 font-semibold rounded-xl active:scale-[0.98] transition-all duration-150 cursor-pointer text-sm"
							>
								Create Account
							</button>
							<button
								onClick={() => setShowAuthModal(false)}
								className="w-full py-2.5 text-zinc-500 hover:text-zinc-300 font-medium text-xs transition duration-150 cursor-pointer"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ChatInterface;
