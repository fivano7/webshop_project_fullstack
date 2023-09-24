import withAuthServer from "@/components/hocs/withAuthServer";
import { sendAuthorizedServerRequest } from "@/utils/requestUtils";
import Head from "next/head";
import Link from "next/link";

function UserPage({ user }) {
  return (
    <div className="user-profile-section">
      <Head>
        <title>Profile | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Welcome back {user.firstName}.</h2>
        <ul>
          <li>
            <Link href="/user/orders">Your Orders</Link>
          </li>
          <li>
            <Link href="/user/delivery-details">Delivery Details</Link>
          </li>
          <li>
            <Link href="/user/settings">User Settings</Link>
          </li>
          <li>
            <Link href="/user/change-password">Change Password</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthServer(
  async (context) => {
    const user = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
    );
    return { props: { user } };
  },
  ["admin", "user"],
);

export default UserPage;
