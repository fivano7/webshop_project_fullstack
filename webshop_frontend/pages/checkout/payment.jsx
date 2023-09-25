import { useAuth } from "@/store/AuthContext";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

function CheckoutPaymentPage() {
  const router = useRouter();
  const { deliveryDetailId, guestEmail } = router.query;
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { userId, cartId } = useAuth();

  const handleFinishOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`,
        {
          userId: userId,
          email: guestEmail,
          deliveryDetailId,
          cartId,
          paymentMethod,
        },
      );

      if (paymentMethod === "card" && response.data.data.stripeUrl) {
        router.push(response.data.data.stripeUrl);
      } else if (paymentMethod === "cash") {
        router.push(
          `/checkout/success?paymentMethod=cash&orderId=${response.data.data.order.orderId}`,
        );
      } else {
        router.push("/checkout/failure");
      }
    } catch (error) {
      router.push("/checkout/failure");
    }
  };

  return (
    <div className="payment-method-section">
      <Head>
        <title>Checkout - Payment | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Payment Method</h2>
        <label
          className={`payment-method-item ${paymentMethod === "card" && "checked"
            }`}
        >
          <input
            type="radio"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />
          <p>Credit Card</p>
        </label>

        <label
          className={`payment-method-item ${paymentMethod === "cash" && "checked"
            }`}
        >
          <input
            type="radio"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
          />
          <p>Pay on Delivery</p>
        </label>

        <div className="checkout-btn">
          <button className="primary-button" onClick={handleFinishOrder}>
            Finish order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPaymentPage;
