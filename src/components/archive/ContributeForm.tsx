import React, { useState, FormEvent, useEffect } from "react";
import { ContributeFormProps, Floor, Room } from "../../types";

/**
 * Component for contributing photos to the archive
 */
const ContributeForm: React.FC<
  ContributeFormProps & { floors: Floor[]; isOpen: boolean }
> = ({ onSubmit, floors, isOpen }) => {
  const [contributor, setContributor] = useState("");
  const [floorId, setFloorId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  // Update available rooms when floor selection changes
  useEffect(() => {
    if (floorId) {
      const selectedFloor = floors.find((floor) => floor.id === floorId);
      if (selectedFloor && selectedFloor.rooms) {
        setAvailableRooms(selectedFloor.rooms);
      } else {
        setAvailableRooms([]);
      }
      // Reset room selection when floor changes
      setRoomId("");
    } else {
      setAvailableRooms([]);
    }
  }, [floorId, floors]);

  // Create a local URL for preview when image file is selected
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setLocalImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setLocalImageUrl(null);
    }
  }, [imageFile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!contributor || !floorId || !imageFile) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("contributor", contributor);
      formData.append("floorId", floorId);
      if (roomId) {
        formData.append("roomId", roomId);
      }
      formData.append("imageFile", imageFile);

      // Send data to server
      const apiUrl = process.env.REACT_APP_API_URL || "/api";
      const response = await fetch(`${apiUrl}/photos/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload photo");
      }

      const data = await response.json();

      // Get the Cloudflare URL from response or use local URL for preview
      const photoUrl = data.photo.imageUrl || localImageUrl;

      // Call the local onSubmit function for immediate display
      const tempPhoto = {
        id: data.photo._id || `temp-${Date.now()}`,
        imageUrl: photoUrl || "", // Use the Cloudflare URL
        contributor,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        floorId,
        roomId: roomId || undefined,
      };

      onSubmit(tempPhoto);

      // Reset form
      setContributor("");
      setFloorId("");
      setRoomId("");
      setImageFile(null);
      setLocalImageUrl(null);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error submitting form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contribute"
      className={`contribute-section ${isOpen ? "open" : "closed"}`}
    >
      <div className="contribute-container">
        <h2>CONTRIBUTE</h2>

        {success && (
          <div className="success-message">
            Thank you for your contribution! Your photo will be reviewed and
            added to the archive.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="contribute-form">
          <div className="form-group">
            <label htmlFor="contributor">Your Name *</label>
            <input
              type="text"
              id="contributor"
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="floorId">Floor *</label>
            <select
              id="floorId"
              value={floorId}
              onChange={(e) => setFloorId(e.target.value)}
              required
            >
              <option value="">Select a floor</option>
              {floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="roomId">Room {floorId && "*"}</label>
            <select
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={!floorId || availableRooms.length === 0}
              required={!!(floorId && availableRooms.length > 0)}
            >
              <option value="">Select a room</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            {floorId && availableRooms.length === 0 && (
              <small className="helper-text">
                No rooms available for this floor
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="imageFile">Photo *</label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files ? e.target.files[0] : null)
              }
              required
            />
            {localImageUrl && (
              <div className="image-preview">
                <img src={localImageUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-submit">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "SUBMITTING..." : "SUBMIT PHOTO"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContributeForm;
