import { useAuth } from "@/store/AuthContext";
import { sendAuthorizedClientRequest } from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

function ChangePasswordPage() {
  const { jwtToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (newPassword !== confirmNewPassword) {
      setStatusMessage("New passwords don't match.");
      return;
    }

    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/updatepassword`,
        "PUT",
        { currentPassword, newPassword },
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setStatusMessage("Password changed successfully.");
    } catch (error) {
      if (error.response) {
        setStatusMessage(error.response.data.error);
      }
    }
  };

  return (
    <div className="change-password-section">
      <Head>
        <title>Change Password | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Change Password</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <label>Current Password</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label>New Password</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <label>Confirm New Password</label>
          </div>

          <button className="primary-button" type="submit">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
