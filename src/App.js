// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
// Importez d'autres pages selon vos besoins

const App = () => {
	return (
		<Router>
			<div className="min-h-screen flex flex-col">
				{/* Titre principal */}
				<header className="bg-gray-800 text-white p-4">
					<h1 className="text-3xl">Esport'IF</h1>
				</header>

				{/* Menu horizontal */}
				<Navbar />

				{/* Contenu de la page */}
				<main className="flex-grow p-4">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/contact" element={<Contact />} />
						{/* Ajoutez d'autres routes ici */}
					</Routes>
				</main>

				{/* Footer (optionnel) */}
				<footer className="bg-gray-800 text-white p-4 text-center">
					© 2024 Esport'IF. Tous droits réservés.
				</footer>
			</div>
		</Router>
	);
};

export default App;
