import React from "react";
import { NavBarProps } from "../../types";

/**
 * Navigation bar component for the Santa Cruz Archive
 */
const NavBar: React.FC<NavBarProps> = ({
  isAboutOpen,
  toggleAbout,
  isContributeOpen,
  toggleContribute,
}) => {
  // Handle Contribute link click
  const handleContributeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleContribute();
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <a
          href="#contribute"
          className={`nav-link ${isContributeOpen ? "active" : ""}`}
          onClick={handleContributeClick}
        >
          CONTRIBUTE
        </a>
        <button
          className={`nav-link ${isAboutOpen ? "active" : ""}`}
          onClick={toggleAbout}
        >
          ABOUT
        </button>
      </div>

      <div className="navbar-title">
        <h1>Archivo de Santa Cruz la Real</h1>
      </div>

      <div className="navbar-right">
        {/* This is where a Twitter/X button would go in the original */}
        <div className="social-button"></div>
      </div>
    </header>
  );
};

export default NavBar;
