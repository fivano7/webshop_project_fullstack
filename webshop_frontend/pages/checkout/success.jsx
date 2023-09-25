import { useAuth } from "@/store/AuthContext";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

function CheckoutSuccessPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { orderId } = router.query;
  return (
    <div className="checkout-result-section">
      <Head>
        <title>Order Successfull | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Your order is successfull</h2>
        <h5>Order ID: #{orderId}</h5>
        <p>You will shortly receive an email with your order details.</p>
        {isLoggedIn && (
          <div>
            <Link className="primary-button" href="/user/orders">
              Open Orders Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutSuccessPage;
