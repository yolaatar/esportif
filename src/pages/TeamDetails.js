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
        setLoading(true);
        const details = await queryTeamDetailsByName(teamName);
        setTeamDetails(details);
      } catch (err) {
        setError("Error fetching team details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [teamName]);

  if (loading) return <p>Loading team details...</p>;
  if (error) return <p>{error}</p>;

  const {
    name,
    abstract,
    foundingYear,
    locations,
    games,
    ceos,
    notablePlayers,
  } = teamDetails;

  return (
    <div className="team-details">
      <h1>{name}</h1>
      <p><strong>Founded:</strong> {foundingYear}</p>
      <p><strong>Locations:</strong> {locations.join(", ")}</p>
      <p><strong>Games:</strong> {games.join(", ")}</p>
      <p><strong>CEOs:</strong> {ceos.join(", ")}</p>
      <p><strong>Notable Players:</strong> {notablePlayers.join(", ")}</p>
      <p><strong>Description:</strong> {abstract}</p>
    </div>
  );
};

export default TeamDetails;
