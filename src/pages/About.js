import React from "react";

const About = () => {
	return (
		<div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-gray-100">
			{/* Texte */}
			<div>
				<h2 className="text-2xl font-semibold mb-4">À propos</h2>
				<p className="text-gray-700" style={{ textAlign: "justify" }}>
					Esport'IF est une plateforme innovante dédiée à l'univers de l'esport,
					des jeux vidéo, et des compétitions internationales. Conçue pour les
					passionnés et les curieux, elle s'appuie sur des données enrichies
					issues de sources fiables comme DBpedia et Wikidata. Notre objectif
					est de fournir une vue d'ensemble complète des tournois emblématiques,
					des équipes de renom, et des structures qui façonnent le monde de
					l'esport. Que vous soyez joueur, fan ou chercheur, Esport'IF vous
					invite à explorer et à comprendre l'évolution fascinante de cet
					écosystème numérique en constante expansion.
				</p>
			</div>

			{/* Image */}
			<div className="flex-shrink-0">
				<img
					src="/esport-about-page.jpg" // Chemin relatif à la racine
					alt="Esport illustration"
					className="w-full md:w-96 rounded-lg shadow-md"
				/>
			</div>
		</div>
	);
};

export default About;
