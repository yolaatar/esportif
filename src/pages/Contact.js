// src/pages/Contact.js
import React from "react";

const Contact = () => {
	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">Contactez-nous</h2>
			<form className="space-y-4">
				<div>
					<label className="block text-sm font-medium">Nom</label>
					<input
						type="text"
						className="mt-1 block w-full border border-gray-300 rounded-md p-2"
						placeholder="Votre nom"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">Email</label>
					<input
						type="email"
						className="mt-1 block w-full border border-gray-300 rounded-md p-2"
						placeholder="Votre email"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">Message</label>
					<textarea
						className="mt-1 block w-full border border-gray-300 rounded-md p-2"
						rows="4"
						placeholder="Votre message"
					></textarea>
				</div>
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
				>
					Envoyer
				</button>
			</form>
		</div>
	);
};

export default Contact;
