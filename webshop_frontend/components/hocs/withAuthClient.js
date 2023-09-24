import { decodeJwtTokenFromCookie } from "@/utils/requestUtils";
import { useRouter } from "next/router";

export default function withAuthClient(
  Component,
  allowedRoles = ["user", "admin"],
) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const decodedToken = decodeJwtTokenFromCookie();

    if (!decodedToken) {
      router.push("/user/login");
      return <h1>Loading...</h1>;
    }

    if (!allowedRoles.includes(decodedToken.role)) {
      router.push("/user/login");
      return <h1>Loading...</h1>;
    }

    return <Component {...props} />;
  };
}
