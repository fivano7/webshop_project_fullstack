import CartItemGrid from "@/components/cartPage/CartItemGrid";
import { useAuth } from "@/store/AuthContext";
import { displayPrice } from "@/utils/priceUtils";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const { cartId, isLoggedIn } = useAuth();

  const updateCart = async (productId, newQuantity) => {
    setStatusMessage("");
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/carts/${cartId}`,
        {
          productId,
          quantity: newQuantity,
        },
      );
      setCartData(response.data.data.cartItems);
      setStatusMessage("Products in cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (cartId) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/carts/${cartId}`,
          );
          setCartData(response.data.data.cartItems);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [cartId]);

  return (
    <div className="cart-section">
      <Head>
        <title>Cart | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Your Cart</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        {cartData && cartData.length > 0 ? (
          cartData.map((cartItem) => (
            <CartItemGrid
              key={cartItem._id}
              cartItem={cartItem}
              updateCart={updateCart}
            />
          ))
        ) : (
          <p>No items in your cart.</p>
        )}

        {cartData && cartData.length > 0 && (
          <div className="subtotal-checkout">
            <h6>Total: {displayPrice(calculateTotal(cartData))}€</h6>
            <Link
              className="primary-button"
              href={isLoggedIn ? "/checkout/delivery" : "/checkout/login"}
            >
              Proceed To Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, cartItem) => {
    return total + cartItem.product.price * cartItem.quantity;
  }, 0);
};

export default CartPage;
