import { formatDateTime } from "@/utils/dateUtils";

function OrderStatusGrid({ orderStatus }) {
  return (
    <div className="single-order-item">
      <div className="content">
        <h6>{formatDateTime(orderStatus.timestamp)}</h6>
        <h6>{orderStatus.status}</h6>
        <h6>{orderStatus.comment}</h6>
      </div>
    </div>
  );
}

export default OrderStatusGrid;
