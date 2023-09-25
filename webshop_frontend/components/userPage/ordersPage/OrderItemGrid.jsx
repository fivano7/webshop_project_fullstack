import { displayPrice } from "@/utils/priceUtils";

function OrderItemGrid({ orderItem }) {
  return (
    <div className="single-order-item">
      <div className="content">
        <h6>{orderItem.product.name}</h6>
        <h6>{displayPrice(orderItem.product.price)}€</h6>
        <h6>Quantity: {orderItem.quantity}</h6>
      </div>
    </div>
  );
}

export default OrderItemGrid;
