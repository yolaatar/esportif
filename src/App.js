import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import Tournement from "./pages/Tournement";
import Teams from "./pages/Teams.js";

const App = () => {
	return (
		<Router>
			<div className="min-h-screen flex flex-col relative">
				{/* Image de fond globale */}
				<img
					src="/esport-bg.jpg" // Assurez-vous que l'image est dans public/
					alt="Fond e-Sport"
					className="absolute inset-0 w-full h-full object-cover -z-10"
				/>

				{/* Overlay global */}
				<div className="absolute inset-0 bg-black opacity-60 -z-10"></div>

				{/* Menu horizontal */}
				<Navbar />

				{/* Contenu de la page */}
				<main className="relative flex-grow flex items-center justify-center px-4 py-10">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
									<Route path="/games" element={<Games />} />
						<Route path="/game/:name" element={<GameDetails />} />
									<Route path="/tournement" element={<Tournement />} />
						<Route path="/teams" element={<Teams />} />
					</Routes>
				</main>

				{/* Footer */}
				<Footer />
			</div>
		</Router>
	);
};

export default App;
