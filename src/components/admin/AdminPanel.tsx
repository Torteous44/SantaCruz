import React, { useState, useEffect } from "react";
import { Photo } from "../../types";
import "../../styles/admin.css";

interface PhotoWithId extends Photo {
  _id: string;
  imageUrl: string; // Cloudflare image URL
  cloudflareId?: string;
}

interface ActionLoading {
  id: string;
  action: "approve" | "reject";
}

const AdminPanel: React.FC = () => {
  const [pendingPhotos, setPendingPhotos] = useState<PhotoWithId[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<ActionLoading | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Hardcoded password
  const ADMIN_PASSWORD = "Torteous4483";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError("Invalid password. Please try again.");
    }
  };

  // Fetch pending photos
  useEffect(() => {
    // Only fetch data if authenticated
    if (!isAuthenticated) return;

    const fetchPendingPhotos = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || "/api";
        const response = await fetch(`${apiUrl}/admin/photos/pending`);

        if (!response.ok) {
          throw new Error("Failed to fetch pending photos");
        }

        const data = await response.json();
        setPendingPhotos(data);
      } catch (err) {
        console.error("Error fetching pending photos:", err);
        setError("Failed to load pending photos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "/api";
        const response = await fetch(`${apiUrl}/admin/photos/stats`);

        if (!response.ok) {
          throw new Error("Failed to fetch photo statistics");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching photo stats:", err);
      }
    };

    fetchPendingPhotos();
    fetchStats();
  }, [isAuthenticated]);

  const handleApprove = async (photoId: string) => {
    try {
      setActionLoading({ id: photoId, action: "approve" });
      const apiUrl = process.env.REACT_APP_API_URL || "/api";
      const response = await fetch(`${apiUrl}/photos/${photoId}/approve`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to approve photo");
      }

      // Remove the approved photo from the pending list
      setPendingPhotos(pendingPhotos.filter((photo) => photo._id !== photoId));

      // Update stats
      setStats({
        ...stats,
        pending: stats.pending - 1,
        approved: stats.approved + 1,
      });
    } catch (err) {
      console.error("Error approving photo:", err);
      setError("Failed to approve photo. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (photoId: string) => {
    try {
      setActionLoading({ id: photoId, action: "reject" });
      const apiUrl = process.env.REACT_APP_API_URL || "/api";
      const response = await fetch(`${apiUrl}/photos/${photoId}/reject`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to reject photo");
      }

      // Remove the rejected photo from the pending list
      setPendingPhotos(pendingPhotos.filter((photo) => photo._id !== photoId));

      // Update stats
      setStats({
        ...stats,
        pending: stats.pending - 1,
        rejected: stats.rejected + 1,
      });
    } catch (err) {
      console.error("Error rejecting photo:", err);
      setError("Failed to reject photo. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <h1>Admin Login</h1>
        {loginError && <div className="admin-error">{loginError}</div>}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-btn">
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <div className="stat-value">{stats.approved}</div>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <div className="stat-value">{stats.rejected}</div>
        </div>
        <div className="stat-card">
          <h3>Total</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
      </div>

      <h2>Pending Photos</h2>

      {pendingPhotos.length === 0 ? (
        <div className="no-pending">No pending photos to review</div>
      ) : (
        <div className="pending-photos-grid">
          {pendingPhotos.map((photo) => (
            <div key={photo._id} className="photo-card-admin">
              <div className="photo-image-admin">
                <img
                  src={photo.imageUrl}
                  alt={`Submitted by ${photo.contributor}`}
                />
              </div>
              <div className="photo-info-admin">
                <div>
                  <strong>Contributor:</strong> {photo.contributor}
                </div>
                <div>
                  <strong>Date:</strong> {photo.date}
                </div>
                <div>
                  <strong>Floor:</strong> {photo.floorId}
                </div>
                {photo.roomId && (
                  <div>
                    <strong>Room:</strong> {photo.roomId}
                  </div>
                )}
              </div>
              <div className="photo-actions">
                <button
                  onClick={() => handleApprove(photo._id)}
                  className="approve-btn"
                  disabled={actionLoading?.id === photo._id}
                >
                  {actionLoading?.id === photo._id &&
                  actionLoading.action === "approve"
                    ? "Approving..."
                    : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(photo._id)}
                  className="reject-btn"
                  disabled={actionLoading?.id === photo._id}
                >
                  {actionLoading?.id === photo._id &&
                  actionLoading.action === "reject"
                    ? "Rejecting..."
                    : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
