import { useAuth } from "@/store/AuthContext";
import {
  faHeart,
  faShoppingCart,
  faTools,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Navigation = () => {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <nav className="navbar">
      <ul className="menu">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/categories">Categories</Link>
        </li>
        <li>
          <Link href="/about">About Us</Link>
        </li>
        <li>
          <Link href="/faqs">FAQs</Link>
        </li>
      </ul>

      <Link className="logo-link" href="/">
        <img src={`/assets/logo-dark.svg`} id="nav-logo" alt="Logo" />
      </Link>

      <ul className="menu">
        <li>
          <Link href="/cart">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
        </li>
        <li>
          <Link href="/favourites">
            <FontAwesomeIcon icon={faHeart} />
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link href="/user">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            </li>
            {userRole === "admin" && (
              <li>
                <Link href="/admin">
                  <FontAwesomeIcon icon={faTools} />
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/user/logout"
                className="primary-button navbar-button"
              >
                Sign Out
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/user/login" className="primary-button navbar-button">
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
