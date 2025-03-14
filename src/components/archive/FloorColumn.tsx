import React, { useEffect } from "react";
import { FloorColumnProps } from "../../types/index";
import PhotoCard from "./PhotoCard";

/**
 * Component for displaying a column of photos for a specific floor
 */
const FloorColumn: React.FC<FloorColumnProps> = ({
  floor,
  expandedImageId = null,
  onImageExpand,
}) => {
  // Add a className based on whether there are images
  const hasImages = floor.images.length > 0;

  // Handle image click
  const handleImageClick = (photoId: string) => {
    if (onImageExpand) {
      onImageExpand(photoId, floor.id);
    }
  };

  // Verify that photos have valid roomIds that match rooms in this floor
  useEffect(() => {
    if (floor.rooms && floor.images.length > 0) {
      // Get all valid room IDs for this floor
      const validRoomIds = floor.rooms.map((room) => room.id);

      // Check each photo's roomId
      floor.images.forEach((photo) => {
        if (photo.roomId) {
          const isValidRoom = validRoomIds.includes(photo.roomId);
          if (!isValidRoom) {
            console.warn(
              `Photo ${photo.id} has roomId ${
                photo.roomId
              } that doesn't match any room in floor ${floor.id}. 
              Valid room IDs are: ${validRoomIds.join(", ")}`
            );
          }
        }
      });
    }
  }, [floor]);

  return (
    <div
      className={`floor-photos ${
        hasImages ? "has-photos" : "no-photos-container"
      }`}
    >
      {hasImages ? (
        floor.images.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            floor={floor}
            isExpanded={photo.id === expandedImageId}
            onExpand={() => handleImageClick(photo.id)}
          />
        ))
      ) : (
        <div className="no-photos">
          <p>!</p>
        </div>
      )}
    </div>
  );
};

export default FloorColumn;
