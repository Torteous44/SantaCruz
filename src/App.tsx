import React, { useState, useEffect } from "react";
import "./App.css";
// Import global styles
import "./styles/global.css";
// Import contribution styles
import "./styles/contribute.css";
// Import admin styles
import "./styles/admin.css";

// Import components
import NavBar from "./components/layout/NavBar";
import AboutSection from "./components/layout/AboutSection";
import FloorColumn from "./components/archive/FloorColumn";
import ContributeForm from "./components/archive/ContributeForm";
import AdminPanel from "./components/admin/AdminPanel";

// Import types and data
import { Photo, Floor } from "./types";
import { floors as initialFloors, aboutContent } from "./utils/data";

function App() {
  // State for toggling the About and Contribute sections
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  // Add state to track which floor is expanded
  const [expandedFloor, setExpandedFloor] = useState<string | null>(null);

  // Toggle functions with exclusive behavior - no nested conditionals
  const toggleAbout = () => {
    // If about is already open, close it, otherwise open it and ensure contribute is closed
    if (isAboutOpen) {
      setIsAboutOpen(false);
    } else {
      setIsAboutOpen(true);
      setIsContributeOpen(false); // Always close contribute when opening about
      setIsAdminPanelOpen(false); // Always close admin panel when opening about
    }
  };

  const toggleContribute = () => {
    // If contribute is already open, close it, otherwise open it and ensure about is closed
    if (isContributeOpen) {
      setIsContributeOpen(false);
    } else {
      setIsContributeOpen(true);
      setIsAboutOpen(false); // Always close about when opening contribute
      setIsAdminPanelOpen(false); // Always close admin panel when opening contribute
    }
  };

  const toggleAdminPanel = () => {
    // If admin is already open, close it, otherwise open it and ensure other panels are closed
    if (isAdminPanelOpen) {
      setIsAdminPanelOpen(false);
    } else {
      setIsAdminPanelOpen(true);
      setIsAboutOpen(false);
      setIsContributeOpen(false);
    }
  };

  // State for managing floors and photos
  const [archiveFloors, setArchiveFloors] = useState<Floor[]>(initialFloors);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch approved photos from server
  useEffect(() => {
    const fetchApprovedPhotos = async () => {
      try {
        // Check if we're in development mode with no server
        if (process.env.REACT_APP_USE_MOCK_DATA === "true") {
          console.log("Using mock data instead of server");
          return;
        }

        setLoading(true);

        // Use environment variable for API URL with fallback
        const apiUrl =
          process.env.REACT_APP_API_URL || "http://localhost:5001/api";
        console.log("Using API URL:", apiUrl);

        try {
          const response = await fetch(`${apiUrl}/photos?status=approved`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch approved photos: Status ${response.status}`
            );
          }

          let photos: Photo[];
          try {
            photos = await response.json();
            console.log(`Successfully fetched ${photos.length} photos`);
          } catch (jsonError: any) {
            console.error("Failed to parse JSON response:", jsonError);
            const text = await response.text();
            console.error("Raw response:", text);
            throw new Error(`Invalid JSON response: ${jsonError.message}`);
          }

          // Group photos by floor
          const updatedFloors = archiveFloors.map((floor) => {
            const floorPhotos = photos
              .filter((photo: Photo) => photo.floorId === floor.id)
              .map((photo: Photo) => ({
                ...photo,
                // Use imageUrl directly from response
                imageUrl: photo.imageUrl || "",
              }));

            // If we have server photos for this floor, use them, otherwise keep existing ones
            if (floorPhotos.length > 0) {
              return {
                ...floor,
                images: floorPhotos,
              };
            }

            return floor;
          });

          setArchiveFloors(updatedFloors);
        } catch (fetchError: any) {
          console.error("Error fetching photos:", fetchError);
          throw fetchError; // Re-throw to be caught by outer try/catch
        }
      } catch (err: any) {
        console.error("Error in photo fetching process:", err);
        setError(
          `Failed to load photos from server: ${err.message || "Unknown error"}`
        );

        // If we're in production and the API is not found (404 error),
        // just use the initial floor data silently without showing an error to users
        if (
          err.message &&
          (err.message.includes("Status 404") ||
            err.message.includes("Invalid JSON"))
        ) {
          console.log(
            "API endpoint issue, using initial floor data as fallback"
          );
          setError(null); // Clear the error so it doesn't show to end users
          // Keep using initialFloors data that was loaded at startup
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPhotos();
  }, []);

  // Listen for hash changes in URL to toggle Contribute form
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#contribute") {
        setIsContributeOpen(true);
        setIsAboutOpen(false);
        setIsAdminPanelOpen(false);
      } else if (hash === "#admin") {
        setIsAdminPanelOpen(true);
        setIsAboutOpen(false);
        setIsContributeOpen(false);
      }
    };

    // Check hash on component mount
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handler for adding a new photo contribution
  const handleContribute = (photoData: Omit<Photo, "id">) => {
    const newPhoto: Photo = {
      ...photoData,
      id: `photo-${Date.now()}`, // Simple ID generation
    };

    setArchiveFloors((prevFloors) =>
      prevFloors.map((floor) =>
        floor.id === newPhoto.floorId
          ? { ...floor, images: [...floor.images, newPhoto] }
          : floor
      )
    );

    // Close the contribute form after submission
    setIsContributeOpen(false);
  };

  // Function to toggle a floor's expanded state
  const toggleFloorExpansion = (floorId: string) => {
    setExpandedFloor(expandedFloor === floorId ? null : floorId);
  };

  // Function to scroll to a specific floor column
  const scrollToFloor = (floorId: string) => {
    const element = document.getElementById(`floor-${floorId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="app">
      {/* NavBar component with updated handlers */}
      <NavBar
        isAboutOpen={isAboutOpen}
        toggleAbout={toggleAbout}
        isContributeOpen={isContributeOpen}
        toggleContribute={toggleContribute}
        floors={archiveFloors}
      />

      {/* About section */}
      <AboutSection isOpen={isAboutOpen} content={aboutContent} />

      {/* Contribute form */}
      <ContributeForm
        isOpen={isContributeOpen}
        onSubmit={handleContribute}
        floors={archiveFloors}
      />

      {/* Admin Panel */}
      {isAdminPanelOpen && <AdminPanel />}

      {!isAdminPanelOpen && (
        <div className="main-content">
          {/* Main content area with columns */}
          <div className="floor-columns">
            {archiveFloors.map((floor) => (
              <div key={floor.id} className="floor-plan-container">
                {/* Floor title that can be clicked to expand */}
                <div
                  className={`floor-plan-item ${
                    expandedFloor === floor.id ? "expanded" : ""
                  }`}
                  onClick={() => toggleFloorExpansion(floor.id)}
                >
                  <div className="floor-name">{floor.name}</div>
                </div>

                {/* Display rooms for this floor (always in DOM for animation) */}
                <div
                  className={`floor-rooms ${
                    expandedFloor === floor.id ? "expanded" : "collapsed"
                  }`}
                >
                  {floor.rooms && (
                    <>
                      <h3>Spaces</h3>
                      <ul className="room-list">
                        {floor.rooms.map((room) => (
                          <li key={room.id} className="room-item">
                            {room.name}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Floor column with photos */}
                <FloorColumn key={`col-${floor.id}`} floor={floor} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
