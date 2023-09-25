import axios from "axios";
import Head from "next/head";
import { useState } from "react";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgotpassword`,
        { email },
      );
      setStatusMessage(response.data.data);
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="forgot-password-section">
      <Head>
        <title>Forgot Password | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Forgot Password</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <button type="submit" className="primary-button">
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
