import React from "react";
import MobileNavbar from "./MobileNavbar";
import FloorColumn from "../archive/FloorColumn";
import { Floor } from "../../types";

interface MobileViewProps {
  floors: Floor[];
  expandedFloor: string | null;
  toggleFloorExpansion: (floorId: string) => void;
  isAboutOpen: boolean;
  toggleAbout: () => void;
  isContributeOpen: boolean;
  toggleContribute: (e: React.MouseEvent) => void;
}

/**
 * Component that manages the mobile layout with sidebar navigation and content area
 */
const MobileView: React.FC<MobileViewProps> = ({
  floors,
  expandedFloor,
  toggleFloorExpansion,
  isAboutOpen,
  toggleAbout,
  isContributeOpen,
  toggleContribute,
}) => {
  // Don't show the mobile view content when About or Contribute are open
  // This prevents Content from showing behind these sections
  const shouldShowContent = !isAboutOpen && !isContributeOpen;

  // Get the currently visible floor data
  const activeFloorData = expandedFloor
    ? floors.find((floor) => floor.id === expandedFloor)
    : null;

  return (
    <div className={`mobile-view ${shouldShowContent ? "" : "content-hidden"}`}>
      {/* Left sidebar navigation */}
      <MobileNavbar
        floors={floors}
        activeFloor={expandedFloor}
        onSelectFloor={toggleFloorExpansion}
        onAboutClick={toggleAbout}
        onContributeClick={toggleContribute}
        isAboutOpen={isAboutOpen}
        isContributeOpen={isContributeOpen}
      />

      {/* Right content area - shows the selected floor */}
      <div className="mobile-content">
        {activeFloorData ? (
          <div className="mobile-floor-content">
            <h2 className="mobile-floor-title">{activeFloorData.name}</h2>

            {/* Display rooms if available */}
            {activeFloorData.rooms && activeFloorData.rooms.length > 0 && (
              <div className="mobile-floor-rooms">
                <h3>Spaces</h3>
                <ul className="room-list">
                  {activeFloorData.rooms.map((room) => (
                    <li key={room.id} className="room-item">
                      {room.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display photos for the selected floor */}
            <FloorColumn floor={activeFloorData} />
          </div>
        ) : (
          <div className="mobile-select-prompt">
            <p>Please select a floor from the menu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileView;
