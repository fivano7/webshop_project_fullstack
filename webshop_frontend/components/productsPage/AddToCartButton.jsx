import { useAuth } from "@/store/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import NumberInput from "./NumberInput";

const AddToCartButton = ({ productId, setStatusMessage }) => {
  const { cartId } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    setStatusMessage("");
    try {
      //Creating new cart for guest
      if (!cartId) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/carts`,
          {
            productId,
            quantity,
          },
        );
        const newCartId = response.data.data._id.toString();
        Cookies.set("_cartIdWebshop", newCartId);
      }
      //CartId already exists (either from user or guest)
      else {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/carts/${cartId}`,
          {
            productId,
            quantity,
            addToQuantity: true,
          },
        );
      }
      setStatusMessage("Product added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="add-to-cart">
      <NumberInput quantity={quantity} setQuantity={setQuantity} />
      <button className="primary-button" onClick={handleAddToCart}>
        Add To Cart
      </button>
    </div>
  );
};

export default AddToCartButton;
