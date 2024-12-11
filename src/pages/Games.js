import React, { useState, useEffect } from "react";
import { queryGames } from "../utils/dbpediaQueries";
import Layout from "./Layout";

const Games = () => {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchGames = async () => {
			try {
				setLoading(true);
				const data = await queryGames();
				setGames(data);
			} catch (err) {
				setError("Erreur lors de la récupération des jeux eSport.");
			} finally {
				setLoading(false);
			}
		};

		fetchGames();
	}, []);

	return (
		<Layout title="Jeux eSport" data={games} loading={loading} error={error} />
	);
};


export default Games;
