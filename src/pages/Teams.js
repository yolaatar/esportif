import React, { useState, useEffect } from "react";
import { queryPopularTeams } from "../utils/dbpediaQueries";
import LayoutGrid from "./LayoutGrid";
import { useNavigate } from "react-router-dom";

const Teams = () => {
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

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

	const handleTeamClick = (team) => {
		navigate(`/team/${encodeURIComponent(team.name)}`);
	};

	return (
		<LayoutGrid
			title="eSport Teams"
			data={teams}
			loading={loading}
			error={error}
			onClick={handleTeamClick}
		/>
	);
};

export default Teams;
