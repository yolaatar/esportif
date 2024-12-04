import React from "react";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div>
      {/* Titre principal */}
      <header style={styles.header}>
        <h1 style={styles.title}>Esport'IF</h1>
      </header>

      {/* Menu horizontal */}
      <Navbar />

      {/* Contenu de la page */}
      <main style={styles.main}>
        <p>Explorez des données enrichies à partir de DBpedia et Wikidata.</p>
      </main>
    </div>
  );
};

// Styles pour le composant
const styles = {
  header: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 0",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "2.5rem",
  },
  main: {
    padding: "20px",
    textAlign: "center",
  },
};

export default App;
