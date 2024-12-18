import React, { useState, useEffect } from "react";
import { queryGames } from "../utils/dbpediaQueries";
import LayoutGrid from "./LayoutGrid";
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
			// Pass games along with the navigation
			navigate(`/game/${encodeURIComponent(game.name)}`, { state: { games } });
		} else {
			console.error("Game name is undefined");
		}
	};

	return (
		<LayoutGrid
			title="eSport Games"
			data={games}
			loading={loading}
			error={error}
			onClick={handleGameClick}
		/>
	);
};

export default Games;
