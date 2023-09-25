import { useAuth } from "@/store/AuthContext";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        setStatusMessage("Passwords do not match.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          firstName,
          lastName,
          email,
          password,
        },
      );

      if (response.data.success) {
        setStatusMessage(
          `Confirmation email sent. Please confirm your email in order to log in :)`,
        );
        router.push("/user/register?success=true");
      } else {
        setStatusMessage(`Signup failed.`);
      }
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="register-section">
      <Head>
        <title>Register | Smith Pottery</title>
      </Head>
      <div className="section-container two-column">
        <div className="col-left">
          <h2>Register.</h2>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
          <form onSubmit={handleSubmit}>
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
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <label>Password</label>
            </div>
            <div className="form-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label>Confirm Password</label>
            </div>
            <button type="submit" className="primary-button">
              Sign Up
            </button>
          </form>
        </div>
        <div className="col-right">
          <h2>Already have an account? </h2>
          <Link href="/user/login" className="secondary-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
