import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h4>HealthCare Portal</h4>
          <p>Your trusted health partner for doctors and patients.</p>
        </div>
        <div style={styles.section}>
          <h4>Quick Links</h4>
          <ul style={styles.list}>
            <li><a href="/" style={styles.link}>Home</a></li>
            <li><a href="/doctor" style={styles.link}>Doctor</a></li>
            <li><a href="/patient" style={styles.link}>Patient</a></li>
            <li><a href="/about" style={styles.link}>About</a></li>
            <li><a href="/contact" style={styles.link}>Contact</a></li>
          </ul>
        </div>
        <div style={styles.section}>
          <h4>Contact</h4>
          <p>Email: support@healthcare.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div>
      <div style={styles.bottom}>
        &copy; {new Date().getFullYear()} HealthCare Portal. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px 0',
    marginTop: 'auto',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    flex: '1 1 200px',
    margin: '10px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  bottom: {
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '0.9em',
    borderTop: '1px solid #444',
    paddingTop: '10px',
  },
};