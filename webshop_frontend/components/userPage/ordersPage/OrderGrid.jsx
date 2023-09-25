import { formatDateTime } from "@/utils/dateUtils";
import { displayPrice } from "@/utils/priceUtils";
import Link from "next/link";

function OrderGrid({ order }) {
  return (
    <div className="single-order-item">
      <h5>#{order.orderId}</h5>
      <div className="content">
        <h6>Order Total: {displayPrice(order.totalPrice)}€</h6>
        <h6>{order.paymentMethod}</h6>
        <h6>{formatDateTime(order.createdAt)}</h6>
        <Link className="primary-button" href={`/user/orders/${order._id}`}>
          Details
        </Link>
      </div>
    </div>
  );
}

export default OrderGrid;
