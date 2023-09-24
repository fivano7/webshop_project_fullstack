import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export const sendAuthorizedServerRequest = async (
  context,
  url,
  method = "GET",
  data = null,
) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        Cookie: `_webShopAuthToken=${context.req.cookies._webShopAuthToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error sending authorized server request!");
    throw error;
  }
};

export const sendAuthorizedClientRequest = async (
  authToken,
  url,
  method = "GET",
  data = null,
) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const decodeJwtToken = (jwtToken) => {
  try {
    return jwtToken ? jwt.decode(jwtToken) : null;
  } catch (error) {
    return null;
  }
};

export const decodeJwtTokenFromCookie = () => {
  const jwtToken = Cookies.get("_webShopAuthToken");
  decodeJwtToken(jwtToken);
};
