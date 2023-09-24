import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

function NewPasswordPage({ resetPasswordToken }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [showLoginButton, setShowLoginButton] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/resetpassword/${resetPasswordToken}`,
        { password },
      );
      setStatusMessage("Password updated successfully. You can now log in");
      setShowLoginButton(true);
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="new-password-section">
      <Head>
        <title>Reset Password | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>New Password</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>New Password</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm New Password</label>
          </div>
          <button className="primary-button" type="submit">
            Update Password
          </button>
          {showLoginButton && (
            <Link className="primary-button btn-login" href="/user/login">
              Log In
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { resetPasswordToken } = context.query;
  return {
    props: {
      resetPasswordToken,
    },
  };
}

export default NewPasswordPage;
