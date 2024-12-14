import React, { useState, useEffect } from "react";
import { queryGames } from "../utils/dbpediaQueries";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const Games = () => {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
  	const navigate = useNavigate();

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

	const handleGameClick = (game) => {
		if (game.name) {
			navigate(`/game/${encodeURIComponent(game.name)}`); // Navigate to the game details page
		} else {
			console.error("Game name is undefined");
		}
	};

	return (
		<Layout title="eSport Games" data={games} loading={loading} error={error} onClick={handleGameClick} />
	);
};


export default Games;
