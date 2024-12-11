import React from "react";

const About = () => {
	return (
		<div className="relative flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-16 min-h-screen">
			{/* Texte */}
			<div className="md:w-1/2 text-white text-justify space-y-6 animate-fadeIn max-w-2xl">
				<h2 className="text-5xl font-extrabold leading-tight drop-shadow-2xl text-center md:text-left">
					Bienvenue sur <span className="text-blue-400">Esport'IF</span>
				</h2>
				<p className="text-lg leading-relaxed drop-shadow-xl">
					Esport'IF est une plateforme innovante dédiée à l'univers de
					l'<span className="text-blue-400 font-semibold">esport</span>, des
					jeux vidéo et des compétitions internationales. Explorez les données
					enrichies provenant de{" "}
					<span className="text-indigo-400 font-semibold">DBpedia</span> et{" "}
					<span className="text-indigo-400 font-semibold">Wikidata</span>. Notre
					objectif est de fournir une vision complète des{" "}
					<span className="text-blue-400 font-semibold">tournois</span>, des{" "}
					<span className="text-blue-400 font-semibold">équipes</span>, et des{" "}
					<span className="text-blue-400 font-semibold">joueurs</span> qui
					construisent cet écosystème numérique fascinant.
				</p>
				<div className="flex justify-center md:justify-start">
					<button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
						En savoir plus
					</button>
				</div>
			</div>

			{/* Image */}
			<div className="md:w-1/2 flex justify-center animate-fadeIn max-w-2xl">
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
