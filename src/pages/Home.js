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
				className="flex w-full max-w-lg z-10 items-center"
			>
				<FaSearch className="text-gray-400 ml-4 mr-2" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Recherchez vos jeux, équipes ou joueurs préférés..."
					className="flex-1 px-4 py-3 focus:outline-none text-gray-700 w-full"
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 ml-2"
				>
					Rechercher
				</button>
			</form>
		</div>
	);
};

export default Home;
