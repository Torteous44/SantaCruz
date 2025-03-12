import React from "react";

/**
 * Footer component for the application
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {currentYear} Santa Cruz Archive</p>
        <p>
          This project was initiated by Student Name, an alumnus of IE
          University, and Professor Name
        </p>
      </div>
    </footer>
  );
};

export default Footer;
