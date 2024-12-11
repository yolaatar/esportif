import React from "react";

const About = () => {
	return (
		<div className="relative flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-16 min-h-screen overflow-hidden">
			{/* Gradient de fond */}
			<div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-500 to-indigo-800 opacity-75 -z-10"></div>

			{/* Effets visuels (cercles) */}
			<div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30 -z-10"></div>
			<div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 -z-10"></div>

			{/* Texte */}
			<div className="md:w-1/2 text-white text-center md:text-left space-y-6 animate-fadeIn">
				<h2 className="text-5xl font-extrabold leading-tight">
					Bienvenue sur <span className="text-blue-300">Esport'IF</span>
				</h2>
				<p className="text-lg leading-relaxed opacity-90">
					Esport'IF est une plateforme innovante dédiée à l'univers de
					l'<span className="text-blue-300 font-semibold">esport</span>, des
					jeux vidéo et des compétitions internationales. Explorez les données
					enrichies provenant de{" "}
					<span className="text-indigo-300 font-semibold">DBpedia</span> et{" "}
					<span className="text-indigo-300 font-semibold">Wikidata</span>. Notre
					objectif est de fournir une vision complète des{" "}
					<span className="text-blue-300 font-semibold">tournois</span>, des{" "}
					<span className="text-blue-300 font-semibold">équipes</span>, et des{" "}
					<span className="text-blue-300 font-semibold">joueurs</span> qui
					construisent cet écosystème numérique fascinant.
				</p>
				<button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
					En savoir plus
				</button>
			</div>

			{/* Image */}
			<div className="md:w-1/2 flex justify-center animate-fadeIn">
				<img
					src="/esport-about-page.jpg"
					alt="Esport illustration"
					className="w-full max-w-md rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
				/>
			</div>
		</div>
	);
};

export default About;
