import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { queryTournamentDetailsByName } from "../utils/dbpediaQueries";
import { ClipLoader } from "react-spinners";

const TournamentDetails = () => {
  const { tournamentName } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const result = await queryTournamentDetailsByName(
          decodeURIComponent(tournamentName)
        );
        setDetails(result);
      } catch (err) {
        setError("Error fetching tournament details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tournamentName]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <ClipLoader color="#ffffff" size={50} />
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;

  if (!details)
    return (
      <p className="text-gray-400 text-center mt-10">No details available.</p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-5 mb-8 bg-gray-800 p-8 rounded-3xl shadow-lg text-white">
      <h3 className="text-3xl font-bold text-yellow-400 text-center mb-6">
        {details.name}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-700 py-4 px-6 rounded-3xl">
          <strong className="block text-yellow-400 mb-1">Game:</strong>
          {details.game ? (
            <Link
              to={`/game/${encodeURIComponent(details.game)}`}
              className="text-blue-400 hover:underline"
            >
              {details.game}
            </Link>
          ) : (
            <span>N/A</span>
          )}
        </div>
        <div className="bg-gray-700 py-4 px-6 rounded-3xl">
          <strong className="block text-yellow-400 mb-1">Most Champions:</strong>
          <span>{details.mostChamps.join(", ") || "N/A"}</span>
        </div>
        <div className="bg-gray-700 py-4 px-6 rounded-3xl">
          <strong className="block text-yellow-400 mb-1">Oldest Founding Year:</strong>
          <span>{details.oldestFoundingYear}</span>
        </div>
        <div className="bg-gray-700 py-4 px-6 rounded-3xl">
          <strong className="block text-yellow-400 mb-1">Venues:</strong>
          <span>{details.venues.join(", ") || "N/A"}</span>
        </div>
        <div className="bg-gray-700 py-4 px-6 rounded-3xl">
          <strong className="block text-yellow-400 mb-1">Motto:</strong>
          <span>{details.mottos.join(", ") || "N/A"}</span>
        </div>
        <div className="bg-gray-700 py-4 px-6 rounded-3xl">
          <strong className="block text-yellow-400 mb-1">Domestic Cups:</strong>
          <span>{details.domesticCups.join(", ") || "N/A"}</span>
        </div>
        <div className="bg-gray-700 py-4 px-6 rounded-3xl">
          <strong className="block text-yellow-400 mb-1">Related Competitions:</strong>
          <span>{details.relatedComps.join(", ") || "N/A"}</span>
        </div>
        <div className="bg-gray-700 py-4 px-6 rounded-3xl">
          <strong className="block text-yellow-400 mb-1">Countries:</strong>
          <span>{details.countries.join(", ") || "N/A"}</span>
        </div>
        <div className="bg-gray-700 py-4 px-6 rounded-3xl col-span-1 md:col-span-2">
          <strong className="block text-yellow-400 mb-1">Website:</strong>
          {details.website ? (
            <a
              href={details.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {details.website}
            </a>
          ) : (
            "N/A"
          )}
        </div>
      </div>
      <p className="bg-gray-700 py-4 px-6 rounded-3xl leading-relaxed">
        <strong className="block text-yellow-400 mb-1">Description:</strong>
        {details.abstract}
      </p>
    </div>
  );
};

export default TournamentDetails;
