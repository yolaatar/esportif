import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { queryTournamentDetailsByName } from "../utils/dbpediaQueries";

const TournamentDetails = () => {
  const { tournamentName } = useParams(); // Get tournament name from URL params
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const result = await queryTournamentDetailsByName(tournamentName);
        setDetails(result);
      } catch (err) {
        setError("Failed to fetch tournament details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tournamentName]);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!details) return <p className="text-gray-400 text-center">No details available.</p>;

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen">
      <h2 className="text-4xl font-bold text-white mb-6">{details.name}</h2>
      <div className="bg-gray-800 rounded-lg p-6 text-white shadow-lg w-full max-w-3xl">
        <p><strong>Game:</strong> {details.game}</p>
        <p><strong>Most Champions:</strong> {details.mostChamps.join(", ") || "N/A"}</p>
        <p><strong>Oldest Founding Year:</strong> {details.oldestFoundingYear}</p>
        <p><strong>Venues:</strong> {details.venues.join(", ") || "N/A"}</p>
        <p><strong>Motto:</strong> {details.mottos.join(", ") || "N/A"}</p>
        <p><strong>Domestic Cups:</strong> {details.domesticCups.join(", ") || "N/A"}</p>
        <p><strong>Related Competitions:</strong> {details.relatedComps.join(", ") || "N/A"}</p>
        <p><strong>Countries:</strong> {details.countries.join(", ") || "N/A"}</p>
        <p><strong>Website:</strong> 
          {details.website ? (
            <a href={details.website} target="_blank" rel="noopener noreferrer" className="text-blue-400">
              {details.website}
            </a>
          ) : " N/A"}
        </p>
        <p className="mt-4"><strong>Description:</strong> {details.abstract}</p>
      </div>
    </div>
  );
};

export default TournamentDetails;
