import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { queryTeamDetailsByName } from "../utils/dbpediaQueries";

const TeamDetails = () => {
	const { teamName } = useParams();
	const [teamDetails, setTeamDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const details = await queryTeamDetailsByName(teamName);
				setTeamDetails(details);
			} catch (err) {
				setError(`Failed to fetch details for ${teamName}.`);
			} finally {
				setLoading(false);
			}
		};

		fetchDetails();
	}, [teamName]);

	if (loading) return <p className="text-white">Loading...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-8 text-white">
			<h2 className="text-4xl font-bold mb-4">{teamDetails.name}</h2>
			<p><strong>Games:</strong> {teamDetails.games.join(", ") || "No games available."}</p>
			<p><strong>Locations:</strong> {teamDetails.locations.join(", ") || "No locations available."}</p>
			<p><strong>Championships:</strong> {teamDetails.championships.join(", ") || "No championships listed."}</p>
			<p><strong>Countries:</strong> {teamDetails.countries.join(", ") || "No country information."}</p>
			<p><strong>Website:</strong> <a href={teamDetails.website} target="_blank" rel="noreferrer">{teamDetails.website}</a></p>
			<p><strong>Description:</strong> {teamDetails.abstract}</p>
		</div>
	);
};

export default TeamDetails;
