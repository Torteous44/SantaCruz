import React from "react";
import { FloorColumnProps } from "../../types";
import PhotoCard from "./PhotoCard";

/**
 * Component for displaying a column of photos for a specific floor
 */
const FloorColumn: React.FC<FloorColumnProps> = ({ floor }) => {
  return (
    <div className="floor-photos">
      {floor.images.length > 0 ? (
        floor.images.map((photo) => <PhotoCard key={photo.id} photo={photo} />)
      ) : (
        <div className="no-photos">
          <p>!</p>
        </div>
      )}
    </div>
  );
};

export default FloorColumn;
