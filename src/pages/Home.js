import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { a } from "framer-motion/client";

const Home = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searched, setSearched] = useState(false); // Nouvel état pour suivre si une recherche a été faite

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) {
			alert("Please enter a search query.");
			return;
		}

		setLoading(true);
		setError(null);
		setResults([]);
		setSearched(true); // Marque qu'une recherche a été effectuée

		const sparqlEndpoint = "https://dbpedia.org/sparql";
		const sparqlQuery = `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT ?entity ?label ?abstract ?thumbnail
      WHERE {
        dbr:Esports dbo:wikiPageWikiLink ?entity .
        ?entity rdfs:label ?label .
        OPTIONAL { ?entity dbo:abstract ?abstract . }
        OPTIONAL { ?entity dbo:thumbnail ?thumbnail . }
        FILTER (
          lang(?label) = "en" &&
          lang(?abstract) = "en" &&
          CONTAINS(LCASE(?label), "${searchQuery.toLowerCase()}")
        )
      }
      LIMIT 10
    `;

		const params = { query: sparqlQuery, format: "json" };

		try {
			const response = await axios.get(sparqlEndpoint, { params });
			const bindings = response.data.results.bindings;

			const formattedResults = bindings.map((item) => ({
				label: item.label.value,
				abstract: item.abstract?.value || "No description available.",
				thumbnail: item.thumbnail?.value || null,
			}));

			setResults(formattedResults);
		} catch (err) {
			setError("An error occurred while fetching the data.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<form
				onSubmit={handleSearch}
				className="flex items-center w-full max-w-lg mx-auto bg-white shadow-md rounded-full p-2 mt-4 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
			>
				<div className="flex items-center px-4">
					<FaSearch className="text-gray-400" />
				</div>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search for teams, games or players..."
					className="flex-1 px-2 py-2 text-gray-700 focus:outline-none rounded-l-full"
				/>
				<button
					type="submit"
					className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-950 transition-colors duration-300"
				>
					Search
				</button>
			</form>

			<div className="mt-6">
				{loading && <p>Results are loading...</p>}
				{error && <p className="text-red-500">{error}</p>}
				{results.length > 0 && (
					<div className="grid grid-cols-1 gap-4 mb-4">
						{results.map((result, index) => (
							<div
								key={index}
								className="flex items-start p-10 bg-gray-200 rounded-3xl shadow-md"
							>
								{result.thumbnail && (
									<img
										src={result.thumbnail}
										alt={result.label}
										className="w-16 h-16 rounded-md"
									/>
								)}
								<div className="px-4">
									<h3 className="text-lg font-bold">{result.label}</h3>
									<p className="text-gray-600">{result.abstract}</p>
								</div>
							</div>
						))}
					</div>
				)}
				{!loading && !error && searched && results.length === 0 && (
					<p className="text-center text-gray-500">No result found...</p>
				)}
			</div>
		</div>
	);
};

export default Home;
