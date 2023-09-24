import { displayPrice } from "@/utils/priceUtils";
import NumberInput from "../productsPage/NumberInput";

const CartItemGrid = ({ cartItem, updateCart }) => {
  const handleQuantityChange = async (newQuantity) => {
    await updateCart(cartItem.product._id, newQuantity);
  };

  return (
    <div className="cart-item">
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${cartItem.product.images[0]
          ? cartItem.product.images[0]
          : "no-image.jpg"
          }`}
        alt="Product"
      />
      <h5>{cartItem.product.name}</h5>
      <h6>{displayPrice(cartItem.product.price)}€</h6>
      <div className="cart-quantity">
        <NumberInput
          quantity={cartItem.quantity}
          setQuantity={handleQuantityChange}
        />
      </div>
      <h6>{displayPrice(cartItem.product.price * cartItem.quantity)}€</h6>
      <div className="btn-delete">
        <button
          className="primary-button "
          onClick={() => handleQuantityChange(0)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemGrid;
