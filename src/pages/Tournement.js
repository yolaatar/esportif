import React, { useState, useEffect } from "react";
import {queryTournaments } from "../utils/dbpediaQueries";

const Tournement = () => {
  const [tournement, setTournament] = useState([]); // Stocke les jeux
  const [loading, setLoading] = useState(true); // Gestion du chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  useEffect(() => {
    // Récupère les jeux au chargement du composant
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const data = await queryTournaments();
        setTournament(data);
      } catch (err) {
        setError("Erreur lors de la récupération des jeux eSport.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading tournaments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 style={{ color: "white", textAlign: "center" }}>eSport tournament</h2>
      <div style={styles.gridContainer}>
        {tournement.map((game, index) => (
          <div key={index} style={styles.gridItem}>
            <div style={styles.placeholder}></div>
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
  placeholder: {
    width: "100px",
    height: "100px",
    backgroundColor: "gray",
    margin: "0 auto",
    borderRadius: "5px",
  },
  gameName: {
    marginTop: "10px",
    display: "block",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default Tournement;
