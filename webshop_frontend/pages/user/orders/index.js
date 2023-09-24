import withAuthServer from "@/components/hocs/withAuthServer";
import OrderGrid from "@/components/userPage/ordersPage/OrderGrid";
import {
  decodeJwtToken,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";

const OrdersPage = ({ orders }) => {
  return (
    <div className="orders-section">
      <Head>
        <title>Orders | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Your Orders</h2>
        {orders.length > 0 ? orders.map((order) => (
          <OrderGrid key={order._id} order={order} />
        )) : <p>You don't have any orders yet...</p>}
      </div>
    </div>
  );
};

export const getServerSideProps = withAuthServer(
  async (context) => {
    const userId = decodeJwtToken(context.req.cookies._webShopAuthToken).id;
    const orders = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders?user=${userId}`,
    );
    return { props: { orders } };
  },
  ["admin", "user"],
);

export default OrdersPage;
