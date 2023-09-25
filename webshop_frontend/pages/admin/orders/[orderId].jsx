import CreateOrderStatusForm from "@/components/adminPage/ordersPage/CreateOrderStatusForm";
import withAuthServer from "@/components/hocs/withAuthServer";
import OrderItemGrid from "@/components/userPage/ordersPage/OrderItemGrid";
import OrderStatusGrid from "@/components/userPage/ordersPage/OrderStatusGrid";
import { useAuth } from "@/store/AuthContext";
import { displayPrice } from "@/utils/priceUtils";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const AdminOrderDetailPage = ({ initialOrder }) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [order, setOrder] = useState(initialOrder);
  const [showAddStatusForm, setShowAddStatusForm] = useState(false);
  const { jwtToken } = useAuth();

  const handleCancelOrder = async () => {
    setStatusMessage("");
    try {
      const cancelledOrder = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${order._id}/cancel`,
        "PUT",
      );
      setOrder(cancelledOrder);
      setStatusMessage("Order cancelled");
    } catch (error) {
      setStatusMessage("Error cancelling order");
    }
  };

  const handleAddOrderStatus = async (status, comment) => {
    setStatusMessage("");
    try {
      const newOrderStatus = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orderstatuses`,
        "POST",
        { status, comment, orderId: order._id },
      );
      const updatedOrderStatuses = [...order.orderStatuses, newOrderStatus];
      setOrder({ ...order, orderStatuses: updatedOrderStatuses });
      setStatusMessage("Order status created");
      setShowAddStatusForm(false);
    } catch (error) {
      setStatusMessage("Error creating order status");
    }
  };

  const handleMarkedAsPaid = async () => {
    setStatusMessage("");
    try {
      const paidOrder = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${order._id}`,
        "PUT",
        { isPaid: true },
      );
      setOrder(paidOrder);
      setStatusMessage("Order marked as paid");
    } catch (error) {
      setStatusMessage("Error marking order as paying");
    }
  };

  return (
    <div className="single-order-section">
      <Head>
        <title>Order Details Management | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Order ID #{order.orderId}</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <div className="details-list">
          <h4>Ordered Items:</h4>
          {order.orderItems.map((item) => (
            <OrderItemGrid key={item._id} orderItem={item} />
          ))}
        </div>

        <div className="details-list">
          <h4 className="order-status">Order Status:</h4>

          <div className="upper-buttons-wrapper">
            <button
              className="primary-button"
              onClick={() => setShowAddStatusForm(!showAddStatusForm)}
            >
              {showAddStatusForm ? "Hide Form" : "Create New Order Status"}
            </button>
          </div>

          {showAddStatusForm && (
            <CreateOrderStatusForm onCreate={handleAddOrderStatus} />
          )}

          {order.orderStatuses.map((status) => (
            <OrderStatusGrid key={status._id} orderStatus={status} />
          ))}
        </div>

        <div className="order-details-wrapper">
          <div className="order-details">
            <h4>Delivery Details:</h4>
            <div className="single-detail">
              <p>Country</p>
              <p>{order.deliveryDetail.country}</p>
            </div>
            <div className="single-detail">
              <p>City</p>
              <p>{order.deliveryDetail.city}</p>
            </div>
            <div className="single-detail">
              <p>Postal Code</p>
              <p>{order.deliveryDetail.postalCode}</p>
            </div>
            <div className="single-detail">
              <p>Street</p>
              <p>{order.deliveryDetail.street}</p>
            </div>
            <div className="single-detail">
              <p>First Name</p>
              <p>{order.deliveryDetail.firstName}</p>
            </div>
            <div className="single-detail">
              <p>Last Name</p>
              <p>{order.deliveryDetail.lastName}</p>
            </div>
            <div className="single-detail">
              <p>Phone Number</p>
              <p>{order.deliveryDetail.phoneNumber}</p>
            </div>
          </div>
          <div className="order-details">
            <h4>Order Details:</h4>
            <div className="single-detail">
              <p>Total Price</p>
              <p>{displayPrice(order.totalPrice)}€</p>
            </div>
            <div className="single-detail">
              <p>Order Paid</p>
              <p>{order.isPaid ? "yes" : "no"}</p>
            </div>
            <div className="single-detail">
              <p>Payment Method</p>
              <p>{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {order.stripeReceiptUrl && (
          <Link
            className="primary-button"
            href={order.stripeReceiptUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Receipt
          </Link>
        )}
        {!order.isCancelled && (
          <button className="primary-button" onClick={handleCancelOrder}>
            Cancel Order
          </button>
        )}

        {!order.isPaid && !order.isCancelled && (
          <button
            className="primary-button"
            onClick={() => handleMarkedAsPaid()}
          >
            Mark as paid
          </button>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = withAuthServer(
  async (context) => {
    const { orderId } = context.params;
    const initialOrder = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderId}`,
    );
    return { props: { initialOrder } };
  },
  ["admin"],
);

export default AdminOrderDetailPage;
