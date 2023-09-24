import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();
  const returnUrl = router.query["return-url"] || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const guestCartId = Cookies.get("_cartIdWebshop");
      const guestFavouriteId = Cookies.get("_favouriteIdWebshop");

      const queryParams = {};

      if (guestCartId) {
        queryParams.cartId = guestCartId;
      }

      if (guestFavouriteId) {
        queryParams.favouriteId = guestFavouriteId;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          email,
          password,
        },
        {
          params: queryParams,
        },
      );

      const token = response.data.token;

      if (token) {
        Cookies.set("_webShopAuthToken", token);
        Cookies.remove("_cartIdWebshop");
        Cookies.remove("_favouriteIdWebshop");

        setStatusMessage(`Login successful!`);
        router.push(returnUrl);
      } else {
        setStatusMessage(`Invalid credentials!`);
      }
    } catch (error) {
      setStatusMessage(`${error.response.data.error}`);
    }
  };

  return (
    <div className="login-section">
      <Head>
        <title>Log In | Smith Pottery</title>
      </Head>
      <div className="section-container two-column">
        <div className="col-left">
          <h2>Login.</h2>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <div className="form-group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            <Link href="forgot-password" className="secondary-text">
              Forgot Password?
            </Link>
            <button type="submit" className="primary-button">
              Login
            </button>
          </form>
        </div>
        <div className="col-right">
          <h2>Don't have an account? </h2>
          <Link href="register" className="secondary-button">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
