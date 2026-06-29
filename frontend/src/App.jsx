import React from "react";
import GoldfishState from "./Context/GoldfishState";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./App.css";

function App() {
	return (
		<GoldfishState>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
			</Router>
		</GoldfishState>
	);
}

export default App;
