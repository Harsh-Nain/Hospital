import React from 'react';
import { Link } from 'react-router-dom'; // for client-side routing

export default function Nav() {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>HealthCare Portal</h2>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        <li>
          <Link to="/doctor" style={styles.link}>Doctor</Link>
        </li>
        <li>
          <Link to="/patient" style={styles.link}>Patient</Link>
        </li>
        <li>
          <Link to="/about" style={styles.link}>About</Link>
        </li>
        <li>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#2c3e50',
    color: 'white',
  },
  logo: {
    margin: 0,
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};