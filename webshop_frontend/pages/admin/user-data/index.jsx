import SearchBar from "@/components/adminPage/categoriesPage/SearchBar";
import AdminUserGrid from "@/components/adminPage/userDataPage/AdminUserGrid";
import withAuthServer from "@/components/hocs/withAuthServer";
import { useAuth } from "@/store/AuthContext";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";

function UserDataPage({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [statusMessage, setStatusMessage] = useState("");
  const { jwtToken } = useAuth();
  const [filterValue, setFilterValue] = useState("");

  const handleDeleteUser = async (userId) => {
    setStatusMessage("");
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`,
        "DELETE",
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isDeleted: true } : user,
        ),
      );
      setStatusMessage("User deleted");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleActivateProfile = async (userId) => {
    setStatusMessage("");
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`,
        "PUT",
        { confirmEmailToken: null },
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, confirmEmailToken: null } : user,
        ),
      );
      setStatusMessage("User activated");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleResetPassword = async (email) => {
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

  const handleFilterChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setFilterValue(inputValue);

    if (inputValue) {
      const filteredUsers = initialUsers.filter((user) =>
        user.email.toLowerCase().includes(inputValue),
      );
      setUsers(filteredUsers);
    } else {
      setUsers(initialUsers);
    }
  };

  const clearFilter = () => {
    setFilterValue("");
    setUsers(initialUsers);
  };

  return (
    <div className="admin-users-section">
      <Head>
        <title>User Management | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>User Management</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <div className="upper-buttons-wrapper">
          <SearchBar
            value={filterValue}
            onChange={handleFilterChange}
            text={"Clear"}
            placeholder={"Search email..."}
            disabled={filterValue.length === 0}
            onClick={clearFilter}
          />
        </div>

        <div className="admin-users-list">
          {users.map((user) => (
            <AdminUserGrid
              key={user._id}
              user={user}
              onDelete={() => handleDeleteUser(user._id)}
              onResetPassword={handleResetPassword}
              onActivateProfile={handleActivateProfile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthServer(
  async (context) => {
    const initialUsers = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`,
    );

    return { props: { initialUsers } };
  },
  ["admin"],
);

export default UserDataPage;
