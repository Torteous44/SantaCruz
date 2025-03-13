import React from "react";
import { Floor } from "../../types";

interface MobileNavbarProps {
  floors: Floor[];
  activeFloor: string | null;
  onSelectFloor: (floorId: string) => void;
  onAboutClick: () => void;
  onContributeClick: (e: React.MouseEvent) => void;
  isAboutOpen: boolean;
  isContributeOpen: boolean;
}

/**
 * Mobile navigation component that displays floors in a vertical sidebar
 * Only renders on mobile screens
 */
const MobileNavbar: React.FC<MobileNavbarProps> = ({
  floors,
  activeFloor,
  onSelectFloor,
  onAboutClick,
  onContributeClick,
  isAboutOpen,
  isContributeOpen,
}) => {
  // Helper to handle floor selection and close any open sections
  const handleFloorSelect = (floorId: string) => {
    // First select the floor
    onSelectFloor(floorId);
  };

  return (
    <div className="mobile-navbar">
      {floors.map((floor) => (
        <div
          key={floor.id}
          className={`mobile-nav-item ${
            activeFloor === floor.id ? "active" : ""
          }`}
          onClick={() => handleFloorSelect(floor.id)}
        >
          <span className="floor-name">{floor.name}</span>
        </div>
      ))}

      <a
        href="#contribute"
        className={`mobile-nav-item ${isContributeOpen ? "active" : ""}`}
        onClick={onContributeClick}
      >
        <span className="floor-name">CONTRIBUTE</span>
      </a>

      <div
        className={`mobile-nav-item ${isAboutOpen ? "active" : ""}`}
        onClick={onAboutClick}
      >
        <span className="floor-name">ABOUT</span>
      </div>
    </div>
  );
};

export default MobileNavbar;
