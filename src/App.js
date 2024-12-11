import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Jeux from "./pages/Jeux";

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
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/contact" element={<Contact />} />
            <Route path="/jeux" element={<Jeux />} />
					</Routes>
				</main>

				{/* Footer */}
				<Footer />
			</div>
		</Router>
	);
};

export default App;
