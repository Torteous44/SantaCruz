import React from "react";
import { PhotoCardProps } from "../../types/index";

/**
 * Component for displaying an individual photo with metadata
 */
const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  isExpanded = false,
  onExpand,
}) => {
  return (
    <div
      className={`photo-card ${isExpanded ? "expanded" : ""}`}
      onClick={() => onExpand && onExpand()}
    >
      <div className="photo-image">
        <img
          src={photo.imageUrl}
          alt={photo.description || photo.caption || "Archive photo"}
        />
      </div>

      <div className="photo-info">
        <span className="photo-date">{photo.date || "Unknown date"}</span>
        <span className="photo-contributor">
          {photo.contributor ? `Added by ${photo.contributor}` : "Anonymous"}
        </span>
      </div>
    </div>
  );
};

export default PhotoCard;
