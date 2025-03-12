import React from "react";
import { PhotoCardProps } from "../../types";

/**
 * Component for displaying an individual photo with metadata
 */
const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <div className="photo-card">
      <div className="photo-image">
        <img src={photo.imageUrl} alt={photo.description || "Archive photo"} />
      </div>

      <div className="photo-info">
        <span className="photo-date">{photo.date}</span>
        <span className="photo-contributor">Added by {photo.contributor}</span>
      </div>
    </div>
  );
};

export default PhotoCard;
