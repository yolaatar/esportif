import React, { useState, useEffect } from "react";
import { queryPopularTeams } from "../utils/dbpediaQueries";

const Teams = () => {
  const [teams, setTeams] = useState([]); // Stores teams
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch teams on component mount
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

  if (loading) return <p style={{ color: "white" }}>Loading teams...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 style={{ color: "white", textAlign: "center" }}>eSport Teams</h2>
      <div style={styles.gridContainer}>
        {teams.map((team, index) => (
          <div key={index} style={styles.gridItem}>
            <div style={styles.logoContainer}>
              {team.logo ? (
                <img src={team.logo} alt={team.name} style={styles.logo} />
              ) : (
                <div style={styles.placeholder}></div>
              )}
            </div>
            <span style={styles.teamName}>{team.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 2 columns
    gap: "20px", // Spacing between items
    padding: "20px",
  },
  gridItem: {
    backgroundColor: "#2d2d2d",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
  },
  logo: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  placeholder: {
    width: "80px",
    height: "80px",
    backgroundColor: "gray",
    borderRadius: "8px",
  },
  teamName: {
    marginTop: "10px",
    display: "block",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default Teams;
