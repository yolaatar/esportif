import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { queryTeamDetailsByName } from "../utils/dbpediaQueries";
import { ClipLoader } from "react-spinners";

const TeamDetails = ({ games }) => {
	const { teamName } = useParams();
	const navigate = useNavigate();
	const [teamDetails, setTeamDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				setLoading(true);
				const details = await queryTeamDetailsByName(
					decodeURIComponent(teamName)
				);
				setTeamDetails(details);
			} catch (err) {
				setError("Error fetching team details.");
			} finally {
				setLoading(false);
			}
		};

		fetchDetails();
	}, [teamName]);

	// Fonction pour surligner les jeux disponibles
	const highlightGames = (text) => {
		if (!text || games.length === 0) return text;

		let highlightedText = text;

		// Vérifie si chaque jeu dans "games" est présent dans le texte
		games.forEach((game) => {
			const regex = new RegExp(`\\b${game.name}\\b`, "gi");
			highlightedText = highlightedText.replace(
				regex,
				`<span class="text-blue-400 cursor-pointer underline" data-name="${game.name}">${game.name}</span>`
			);
		});

		return highlightedText;
	};

	// Gestion du clic sur un jeu surligné
	const handleGameClick = (e) => {
		if (e.target.dataset.name) {
			const gameName = e.target.dataset.name;
			navigate(`/game/${encodeURIComponent(gameName)}`);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-center min-h-[80vh]">
				<ClipLoader color="#ffffff" size={50} />
			</div>
		);

	if (error)
		return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;

	if (!teamDetails)
		return (
			<p className="text-gray-400 text-center mt-10">No details available.</p>
		);

	const {
		name,
		abstract,
		foundingYear,
		locations,
		games: teamGames,
		ceos,
		notablePlayers,
	} = teamDetails;

	return (
		<div
			className="max-w-4xl mx-auto mt-5 mb-8 bg-gray-800 p-8 rounded-3xl shadow-lg text-white"
			onClick={handleGameClick}
		>
			<h3 className="text-3xl font-bold text-yellow-400 text-center mb-6">
				{name}
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div className="bg-gray-700 py-4 px-6 rounded-3xl">
					<strong className="block text-yellow-400 mb-1">Founded:</strong>
					<span>{foundingYear || "N/A"}</span>
				</div>
				<div className="bg-gray-700 py-4 px-6 rounded-3xl">
					<strong className="block text-yellow-400 mb-1">Locations:</strong>
					<span>{locations.join(", ") || "N/A"}</span>
				</div>
				<div className="bg-gray-700 py-4 px-6 rounded-3xl">
					<strong className="block text-yellow-400 mb-1">Games:</strong>
					<span>{teamGames.join(", ") || "N/A"}</span>
				</div>
				<div className="bg-gray-700 py-4 px-6 rounded-3xl">
					<strong className="block text-yellow-400 mb-1">CEOs:</strong>
					<span>{ceos.join(", ") || "N/A"}</span>
				</div>
				<div className="bg-gray-700 py-4 px-6 rounded-3xl col-span-1 md:col-span-2">
					<strong className="block text-yellow-400 mb-1">
						Notable Players:
					</strong>
					<span>{notablePlayers.join(", ") || "N/A"}</span>
				</div>
			</div>
			<p
				className="bg-gray-700 py-4 px-6 rounded-3xl leading-relaxed"
				dangerouslySetInnerHTML={{
					__html: highlightGames(abstract || "N/A"),
				}}
			/>
		</div>
	);
};

export default TeamDetails;
