import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <a href="#home" style={styles.navLink}>
            Accueil
          </a>
        </li>
        <li style={styles.navItem}>
          <a href="#explore" style={styles.navLink}>
            Explorer
          </a>
        </li>
        <li style={styles.navItem}>
          <a href="#about" style={styles.navLink}>
            À propos
          </a>
        </li>
        <li style={styles.navItem}>
          <a href="#contact" style={styles.navLink}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

// Styles pour le composant
const styles = {
  nav: {
    backgroundColor: "#333",
    padding: "10px 0",
  },
  navList: {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
  },
  navItem: {
    margin: "0 15px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.2rem",
  },
};

export default Navbar;
