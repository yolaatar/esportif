import React, { useState, useEffect } from "react";
import { queryTournaments } from "../utils/dbpediaQueries";
import Layout from "./Layout";

const Tournement = () => {
	const [tournaments, setTournaments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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

	return (
		<Layout
			title="Tournois eSport"
			data={tournaments}
			loading={loading}
			error={error}
		/>
	);
};

export default Tournement;
