import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { queryGameDetailsByName } from "../utils/dbpediaQueries";

const GameDetails = () => {
  const { name } = useParams(); // Get name from URL
  const [gameDetails, setGameDetails] = useState(null); // Store game details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch game details on component mount
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

  if (loading) return <p style={{ color: "white" }}>Chargement des détails...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.detailsContainer}>
      {gameDetails && (
        <>
          <h3 style={styles.detailsTitle}>{gameDetails.name}</h3>
          <p><strong>Date de sortie :</strong> {gameDetails.releaseDate}</p>
          <p><strong>Éditeurs :</strong> {gameDetails.publishers.join(", ")}</p>
          <p><strong>Développeurs :</strong> {gameDetails.developers.join(", ")}</p>
          <p><strong>Genres :</strong> {gameDetails.genres.join(", ")}</p>
          <p><strong>Plateformes :</strong> {gameDetails.platforms.join(", ")}</p>
          <p><strong>Description :</strong> {gameDetails.abstract}</p>
        </>
      )}
    </div>
  );
};

const styles = {
  detailsContainer: {
    marginTop: "20px",
    backgroundColor: "#1c1c1c",
    borderRadius: "8px",
    padding: "20px",
    color: "white",
  },
  detailsTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
};

export default GameDetails;
