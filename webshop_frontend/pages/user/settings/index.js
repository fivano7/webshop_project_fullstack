import withAuthServer from "@/components/hocs/withAuthServer";
import { useAuth } from "@/store/AuthContext";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

function UserSettingsPage({ user }) {
  const { jwtToken } = useAuth();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [statusMessage, setStatusMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/updatedetails`,
        "PUT",
        { firstName, lastName, email },
      );

      setStatusMessage("Profile updated successfully.");
    } catch (error) {
      if (error.response) {
        setStatusMessage(error.response.data.error);
      }
    }
  };

  return (
    <div className="user-settings-section">
      <Head>
        <title>User Settings | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>User Settings</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label>First Name</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <label>Last Name</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <button className="primary-button" type="submit">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthServer(
  async (context) => {
    const user = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
    );

    return { props: { user } };
  },
  ["admin", "user"],
);

export default UserSettingsPage;
