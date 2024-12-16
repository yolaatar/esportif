import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { queryGameDetailsByName } from "../utils/dbpediaQueries";
import { ClipLoader } from "react-spinners";

const GameDetails = () => {
	const { name } = useParams();
	const [gameDetails, setGameDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				setLoading(true);
				const details = await queryGameDetailsByName(decodeURIComponent(name));
				setGameDetails(details);
			} catch (err) {
				setError("Erreur lors de la récupération des détails du jeu.");
			} finally {
				setLoading(false);
			}
		};

		fetchDetails();
	}, [name]);

	if (loading)
		return (
			<div className="flex justify-center items-center min-h-[80vh]">
				<ClipLoader color="#ffffff" size={50} />
			</div>
		);
	if (error)
		return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;

	return (
		<div className="max-w-4xl mx-auto mt-5 mb-8 bg-gray-800 p-8 rounded-3xl shadow-lg text-white">
			{gameDetails && (
				<>
					<h3 className="text-3xl font-bold text-yellow-400 text-center mb-6">
						{gameDetails.name || "N/A"}
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<div className="bg-gray-700 py-4 px-6 rounded-3xl">
							<strong className="block text-yellow-400 mb-1">
								Release Date :
							</strong>
							<span>{gameDetails.releaseDate || "N/A"}</span>
						</div>
						<div className="bg-gray-700 py-4 px-6 rounded-3xl">
							<strong className="block text-yellow-400 mb-1">Editors :</strong>
							<span>{gameDetails.publishers.join(", ") || "N/A"}</span>
						</div>
						<div className="bg-gray-700 py-4 px-6 rounded-3xl">
							<strong className="block text-yellow-400 mb-1">
								Developers :
							</strong>
							<span>{gameDetails.developers.join(", ") || "N/A"}</span>
						</div>
						<div className="bg-gray-700 py-4 px-6 rounded-3xl">
							<strong className="block text-yellow-400 mb-1">Type :</strong>
							<span>{gameDetails.genres.join(", ") || "N/A"}</span>
						</div>
						<div className="bg-gray-700 py-4 px-6 rounded-3xl col-span-1 md:col-span-2">
							<strong className="block text-yellow-400 mb-1">
								Platforms :
							</strong>
							<span>{gameDetails.platforms.join(", ") || "N/A"}</span>
						</div>
					</div>
					<p className="bg-gray-700 py-4 px-6 rounded-3xl leading-relaxed">
						<strong className="block text-yellow-400 mb-1">
							Description :
						</strong>
						{gameDetails.abstract || "N/A"}
					</p>
				</>
			)}
		</div>
	);
};

export default GameDetails;
