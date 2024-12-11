import React, { useState, useEffect } from "react";
import { queryGames } from "../utils/dbpediaQueries";

const Games = () => {
  const [games, setGames] = useState([]); // Stocke les jeux
  const [loading, setLoading] = useState(true); // Gestion du chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  useEffect(() => {
    // Récupère les jeux au chargement du composant
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await queryGames();
        setGames(data);
      } catch (err) {
        setError("Erreur lors de la récupération des jeux eSport.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Chargement des jeux...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 style={{ color: "white", textAlign: "center" }}></h2>
      <div style={styles.gridContainer}>
        {games.map((game, index) => (
          <div key={index} style={styles.gridItem}>
            {/* Affiche le logo ou un placeholder */}
            <img
              src={game.logo}
              alt={`Logo of ${game.name}`}
              style={styles.logo}
            />
            <span style={styles.gameName}>{game.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 2 colonnes
    gap: "20px", // Espacement entre les items
    padding: "20px",
  },
  gridItem: {
    backgroundColor: "#2d2d2d",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
  },
  logo: {
    width: "80px", // Largeur réduite
    height: "80px", // Hauteur réduite
    margin: "0 auto", // Centre l'image horizontalement
    borderRadius: "5px",
    objectFit: "cover", // Ajuste l'image pour qu'elle remplisse l'espace
  },
  gameName: {
    marginTop: "10px",
    display: "block",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  },
};


export default Games;
