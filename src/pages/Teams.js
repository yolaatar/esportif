import React, { useState, useEffect } from "react";
import { queryPopularTeams } from "../utils/dbpediaQueries";
import LayoutGrid from "./LayoutGrid";

const Teams = () => {
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				setLoading(true);
				const data = await queryPopularTeams();
				setTeams(data);
			} catch (err) {
				setError("Erreur lors de la récupération des équipes eSport.");
			} finally {
				setLoading(false);
			}
		};

		fetchTeams();
	}, []);

	return (
		<LayoutGrid
			title="eSport Teams"
			data={teams}
			loading={loading}
			error={error}
		/>
	);
};

export default Teams;
