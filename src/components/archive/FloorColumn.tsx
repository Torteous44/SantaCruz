import React from "react";
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
