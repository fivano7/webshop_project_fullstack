import {
  decodeJwtToken,
  sendAuthorizedClientRequest,
} from "@/utils/requestUtils";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [favouriteId, setFavouriteId] = useState(null);

  useEffect(() => {
    const jwtToken = Cookies.get("_webShopAuthToken");
    if (jwtToken) {
      const user = decodeJwtToken(jwtToken);
      setJwtToken(jwtToken);
      setIsLoggedIn(true);
      setUserId(user.id);
      setUserRole(user.role);
    } else {
      setJwtToken(null);
      setIsLoggedIn(false);
      setUserId(null);
      setUserRole(null);
    }
  }, [Cookies.get("_webShopAuthToken")]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userCartId, userFavouriteId;

        if (isLoggedIn) {
          const userData = await sendAuthorizedClientRequest(
            jwtToken,
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
          );
          userCartId = userData.cart;
          userFavouriteId = userData.favourite;
        } else {
          userCartId = Cookies.get("_cartIdWebshop");
          userFavouriteId = Cookies.get("_favouriteIdWebshop");
        }

        setCartId(userCartId);
        setFavouriteId(userFavouriteId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [
    jwtToken,
    isLoggedIn,
    Cookies.get("_cartIdWebshop"),
    Cookies.get("_favouriteIdWebshop"),
  ]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userId,
        userRole,
        jwtToken,
        cartId,
        favouriteId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
