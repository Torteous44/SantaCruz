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
  const [isServerError, setIsServerError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [fileName, setFileName] = useState("No file selected");

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
      setFileName(imageFile.name);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setLocalImageUrl(null);
      setFileName("No file selected");
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
    setIsServerError(false);

    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("contributor", contributor);
      formData.append("floorId", floorId);
      if (roomId) {
        formData.append("roomId", roomId);
      }
      formData.append("imageFile", imageFile);

      // Send data to server with timeout
      const apiUrl = process.env.REACT_APP_API_URL || "/api";

      // Create a controller to be able to abort the fetch if it takes too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      let response;
      try {
        response = await fetch(`${apiUrl}/photos/upload`, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // Network error, CORS error, or abort error
        console.error("Fetch error:", fetchError);
        throw new Error(
          "Network error: Unable to connect to the server. Your contribution will be saved locally for now."
        );
      }

      if (!response.ok) {
        let errorMessage = "Failed to upload photo. ";

        try {
          const errorData = await response.json();
          errorMessage += errorData.error || "";
        } catch (jsonError) {
          // If we can't parse the JSON, just use status text
          errorMessage += response.statusText || "Server error occurred.";
        }

        // Mark as server error
        setIsServerError(true);
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Error parsing server response:", jsonError);
        setIsServerError(true);
        throw new Error(
          "The server responded, but with invalid data. Your contribution will be saved locally for now."
        );
      }

      // Get the Cloudflare URL from response or use local URL for preview
      const photoUrl = data.photo?.imageUrl || localImageUrl;

      // Call the local onSubmit function for immediate display
      const tempPhoto = {
        id: data.photo?._id || `temp-${Date.now()}`,
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

      // If this is a server error, we still want to show the user their contribution locally
      if (isServerError && localImageUrl) {
        // Create a local temporary photo object
        const localTempPhoto = {
          id: `local-temp-${Date.now()}`,
          imageUrl: localImageUrl,
          contributor,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          floorId,
          roomId: roomId || undefined,
          isLocalOnly: true, // Flag to indicate this is only saved locally
        };

        // Submit the local copy to show the user
        onSubmit(localTempPhoto);

        // Clear the form
        setContributor("");
        setFloorId("");
        setRoomId("");
        setImageFile(null);
        setLocalImageUrl(null);

        // Show success with caveat
        setError(
          "The server is currently experiencing issues, but your contribution has been saved locally and will be displayed. It will be submitted to the server when the connection is restored."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Error submitting form. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Option to retry submission if there was a server error
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
      setError("Retrying submission...");
      handleSubmit(new Event("submit") as unknown as FormEvent);
    } else {
      setError("Maximum retry attempts reached. Please try again later.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setLocalImageUrl(null);
    setFileName("No file selected");

    // Reset the file input value
    const fileInput = document.getElementById("imageFile") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <section
      id="contribute"
      className={`contribute-section ${isOpen ? "open" : "closed"}`}
    >
      <div className="contribute-container">
        <div className="contribute-header">
          <h2>CONTRIBUTE</h2>
        </div>

        {success && (
          <div className="success-message">
            Thank you for your contribution! Your photo will be reviewed and
            added to the archive.
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
            {isServerError && retryCount < 3 && (
              <div className="retry-option">
                <button onClick={handleRetry} className="retry-button">
                  Retry Submission
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contribute-form">
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="contributor">Your Name *</label>
              <input
                type="text"
                id="contributor"
                value={contributor}
                onChange={(e) => setContributor(e.target.value)}
                required
                placeholder=""
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
              <label htmlFor="roomId">
                Room {floorId && availableRooms.length > 0 && "*"}
              </label>
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
                <span className="helper-text">
                  No rooms available for this floor
                </span>
              )}
            </div>

            <div className="form-group file-input">
              <label htmlFor="imageFile">Photo *</label>
              <div className="file-input-container">
                <div className="file-input-button">SELECT PHOTO</div>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <div className="file-name-display">
                  {fileName || "No file selected"}
                </div>
              </div>
              <span className="helper-text">
                Supported formats: JPEG, PNG, GIF, WebP, SVG (max 10MB)
              </span>
              {localImageUrl && (
                <div className="image-preview">
                  <img src={localImageUrl} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={handleRemoveImage}
                  >
                    X
                  </button>
                </div>
              )}
            </div>

            <div className="form-group form-submit">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "SUBMITTING..." : "SUBMIT PHOTO"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContributeForm;
