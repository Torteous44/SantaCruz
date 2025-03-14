import React, { useEffect, useState } from "react";
import { PhotoCardProps } from "../../types/index";

/**
 * Component for displaying an individual photo with metadata
 */
const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  isExpanded = false,
  onExpand,
  floor,
}) => {
  const [roomName, setRoomName] = useState<string | null>(null);

  // Find the room name whenever the photo or floor changes
  useEffect(() => {
    if (photo.roomId && floor && floor.rooms) {
      // First try exact match
      let matchingRoom = floor.rooms.find((room) => room.id === photo.roomId);

      // If no match, try matching by name (in case the API sends room name instead of ID)
      if (!matchingRoom && typeof photo.roomId === "string") {
        matchingRoom = floor.rooms.find(
          (room) => room.name.toLowerCase() === photo.roomId!.toLowerCase()
        );
      }

      // If still no match, just use the roomId as is (it might be the room name)
      const foundRoomName = matchingRoom
        ? matchingRoom.name
        : photo.roomId && photo.roomId.includes("-")
        ? null
        : photo.roomId;

      setRoomName(foundRoomName);
    } else {
      setRoomName(null);
    }
  }, [photo, floor, photo.roomId, isExpanded]);

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
        <span className="photo-date">
          {photo.date || "Unknown date"}
          {isExpanded && roomName && (
            <>
              <span className="dot-separator"> • </span>
              <span className="photo-room">{roomName}</span>
            </>
          )}
        </span>
        <span className="photo-contributor">
          {photo.contributor ? `Added by ${photo.contributor}` : "Anonymous"}
        </span>
      </div>
    </div>
  );
};

export default PhotoCard;
