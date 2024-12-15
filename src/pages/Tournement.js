import React, { useState, useEffect } from "react";
import { queryTournaments } from "../utils/dbpediaQueries";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const Tournement = () => {
	const [tournaments, setTournaments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTournaments = async () => {
			try {
				setLoading(true);
				const data = await queryTournaments();
				setTournaments(data);
			} catch (err) {
				setError("Erreur lors de la récupération des tournois eSport.");
			} finally {
				setLoading(false);
			}
		};

		fetchTournaments();
	}, []);

	const handleTournamentClick = (tournament) => {
		// Navigate to the tournament details page with the tournament name
		navigate(`/tournament/${encodeURIComponent(tournament.name)}`);
	};
	
	return (
		<Layout
			title="eSport Tournaments"
			data={tournaments}
			loading={loading}
			error={error}
			onClick={handleTournamentClick}
		/>
	);
};

export default Tournement;
