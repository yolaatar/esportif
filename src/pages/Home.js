import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Home = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e) => {
		e.preventDefault();
		console.log("Recherche pour :", searchQuery);
	};

	return (
		<div className="relative h-screen flex items-center justify-center px-4">
			<form
				onSubmit={handleSearch}
				className="flex items-center w-full max-w-lg mx-auto bg-white shadow-md rounded-full p-2 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
			>
				<div className="flex items-center px-4">
					<FaSearch className="text-gray-400" />
				</div>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Recherchez vos jeux, équipes ou joueurs préférés..."
					className="flex-1 px-4 py-3 text-gray-700 focus:outline-none rounded-l-full"
				/>
				<button
					type="submit"
					className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-950 transition-colors duration-300"
				>
					Rechercher
				</button>
			</form>
		</div>
	);
};

export default Home;
