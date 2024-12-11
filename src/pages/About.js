import React from "react";
import { motion } from "framer-motion"; // Pour les animations

const About = () => {
	return (
		<section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl py-20 transition-transform duration-300 hover:scale-105">
			<div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-16">
				{/* Texte */}
				<motion.div
					className="lg:w-1/2 mt-10 lg:mt-0"
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
						Bienvenue sur <span className="text-blue-400">Esport'IF</span>
					</h2>
					<p className="text-lg mb-6 leading-relaxed">
						Esport'IF est une plateforme innovante dédiée à l'univers de l'
						<span className="text-blue-400 font-semibold">esport</span>, des
						jeux vidéo et des compétitions internationales. Explorez les données
						enrichies provenant de{" "}
						<span className="text-indigo-400 font-semibold">DBpedia</span> et{" "}
						<span className="text-indigo-400 font-semibold">Wikidata</span>.
						Notre objectif est de fournir une vision complète des{" "}
						<span className="text-blue-400 font-semibold">tournois</span>, des{" "}
						<span className="text-blue-400 font-semibold">équipes</span>, et des{" "}
						<span className="text-blue-400 font-semibold">joueurs</span> qui
						construisent cet écosystème numérique fascinant.
					</p>
				</motion.div>

				{/* Image */}
				<motion.div
					className="lg:w-1/2 flex justify-center"
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}
				>
					<img
						src={"/esport-about-page.jpg"}
						alt="Esport'IF"
						className="rounded-lg shadow-2xl w-full max-w-md object-cover"
					/>
				</motion.div>
			</div>

			{/* Décorations */}
			<div className="absolute inset-0 bg-transparent pointer-events-none">
				{/* Ajoutez des formes géométriques ou des effets de particules si souhaité */}
			</div>
		</section>
	);
};

export default About;
