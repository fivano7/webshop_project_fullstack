import { useAuth } from "@/store/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function CheckoutLoginPage() {
  const [email, setEmail] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatusMessage, setLoginStatusMessage] = useState("");
  const [guestStatusMessage, setGuestStatusMessage] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/checkout/delivery");
    }
  }, [isLoggedIn]);

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
        setLoginStatusMessage(`Login successful!`);
        router.push("/checkout/delivery");
      } else {
        setLoginStatusMessage(`Invalid credentials!`);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginStatusMessage("Login failed. Please check your credentials.");
    }
  };

  const handleGuestEmail = async (e) => {
    e.preventDefault();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(guestEmail)) {
      setGuestStatusMessage(`Please enter a valid email address`);
      return;
    }
    router.push({
      pathname: "/checkout/delivery",
      query: { guestEmail },
    });
  };

  return (
    <div className="login-section">
      <Head>
        <title>Checkout - Login | Smith Pottery</title>
      </Head>
      <div className="section-container two-column">
        <div className="col-left">
          <h2>Continue As User</h2>
          {loginStatusMessage && (
            <p className="status-message">{loginStatusMessage}</p>
          )}
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
            <Link href="/user/forgot-password" className="secondary-text">
              Forgot Password?
            </Link>
            <button className="primary-button" type="submit">
              Checkout As User
            </button>
          </form>
        </div>
        <div className="col-right">
          <h2 className="id-header">Continue as Guest</h2>
          {guestStatusMessage && (
            <p className="status-message">{guestStatusMessage}</p>
          )}
          <form onSubmit={handleGuestEmail}>
            <div className="form-group secondary">
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <button className="secondary-button" type="submit">
              Checkout As Guest
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutLoginPage;
