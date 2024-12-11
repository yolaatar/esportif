import React from "react";

const Footer = () => {
	return (
		<footer className="absolute bottom-0 left-0 w-full text-white p-4 text-center z-10">
			<div className="container mx-auto">
				<p className="bg-neutral-600 bg-opacity-50 backdrop-blur-sm hover:bg-neutral-300 hover:bg-opacity-50 rounded-lg px-4 py-2 inline-block transition duration-300">
					© 2024 Esport'IF. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
