import React from "react";
import { motion } from "framer-motion"; // For animations

const About = () => {
	return (
		<section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl py-20 transition-transform duration-300 hover:scale-105">
			<div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-16">
				{/* Text */}
				<motion.div
					className="lg:w-1/2 mt-10 lg:mt-0"
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
						Welcome to <span className="text-blue-400">Esport'IF</span>
					</h2>
					<p className="text-lg mb-6 leading-relaxed">
						Esport'IF is an innovative platform dedicated to the world of{" "}
						<span className="text-blue-400 font-semibold">esport</span>, video
						games, and international competitions. Explore enriched data from{" "}
						<span className="text-indigo-400 font-semibold">DBpedia</span> and{" "}
						<span className="text-indigo-400 font-semibold">Wikidata</span>. Our
						goal is to provide a comprehensive view of{" "}
						<span className="text-blue-400 font-semibold">tournaments</span>,{" "}
						<span className="text-blue-400 font-semibold">teams</span>, and{" "}
						<span className="text-blue-400 font-semibold">players</span> who
						build this fascinating digital ecosystem.
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

			{/* Decorations */}
			<div className="absolute inset-0 bg-transparent pointer-events-none">
				{/* Add geometric shapes or particle effects if desired */}
			</div>
		</section>
	);
};

export default About;
