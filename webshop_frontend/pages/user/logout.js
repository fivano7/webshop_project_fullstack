import { useAuth } from "@/store/AuthContext";
import Cookies from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

const LogoutPage = () => {
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    setIsLoggedIn(false);
    Cookies.remove("_webShopAuthToken");
    Cookies.remove("_cartIdWebshop");
    Cookies.remove("_favouriteIdWebshop");
  }, []);

  return (
    <div className="logout-section">
      <Head>
        <title>Log Out | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>You successfully logged out</h2>
        <Link href="/" className="primary-button">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default LogoutPage;
