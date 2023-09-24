import SearchBar from "@/components/adminPage/categoriesPage/SearchBar";
import AdminOrderGrid from "@/components/adminPage/ordersPage/AdminOrderGrid";
import withAuthServer from "@/components/hocs/withAuthServer";
import { sendAuthorizedServerRequest } from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

function AdminOrdersPage({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    const filteredOrders = initialOrders.filter((order) =>
      order.orderId.toLowerCase().includes(inputValue),
    );
    setFilterValue(inputValue);
    setOrders(filteredOrders);
  };

  const clearFilter = () => {
    setFilterValue("");
    setOrders(initialOrders);
  };

  return (
    <div className="orders-section">
      <Head>
        <title>Orders | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Orders</h2>
        <div className="upper-buttons-wrapper">
          <SearchBar
            value={filterValue}
            onChange={handleFilterChange}
            text={"Clear"}
            placeholder={"Search order ID..."}
            disabled={filterValue.length === 0}
            onClick={clearFilter}
          />
        </div>

        {orders.length > 0 ? orders.map((order) => (
          <AdminOrderGrid key={order._id} order={order} />
        )) : <p>No orders yet...</p>}
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthServer(
  async (context) => {
    const initialOrders = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`,
    );
    return { props: { initialOrders } };
  },
  ["admin"],
);

export default AdminOrdersPage;
