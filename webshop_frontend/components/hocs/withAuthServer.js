import { decodeJwtToken } from "@/utils/requestUtils";

export default function withAuthServer(gssp, allowedRoles = ["user", "admin"]) {
  return async (context) => {
    const authToken = context.req.cookies._webShopAuthToken;
    const redirectDestination = "/user/login";
    const loginUrl = `${redirectDestination}?return-url=${encodeURIComponent(
      context.resolvedUrl,
    )}`;

    if (
      !authToken ||
      !decodeJwtToken(authToken) ||
      !allowedRoles.includes(decodeJwtToken(authToken).role)
    ) {
      return {
        redirect: {
          destination: loginUrl,
          permanent: false,
        },
      };
    }

    try {
      const gsspData = await gssp(context);

      return {
        props: {
          ...gsspData.props,
        },
      };
    } catch (error) {
      // console.log("CATCH withAuthServer: " + error);
      return {
        redirect: {
          destination: loginUrl,
          permanent: false,
        },
      };
    }
  };
}
