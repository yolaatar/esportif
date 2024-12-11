import React from "react";
import Navbar from "./components/Navbar";

const App = () => {
	return (
		<div>
			{/* Titre principal */}
			<header>
				<h1>Esport'IF</h1>
			</header>

			{/* Menu horizontal */}
			<Navbar />

			{/* Contenu de la page */}
			<main>
				<p>Explorez des données enrichies à partir de DBpedia et Wikidata.</p>
			</main>
		</div>
	);
};

export default App;
