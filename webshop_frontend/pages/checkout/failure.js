import Head from "next/head";
import Link from "next/link";

function CheckoutFailurePage() {
  return (
    <div className="checkout-result-section">
      <Head>
        <title>Order Failed | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Your order failed</h2>
        <p>Something went wrong. Please try again or contact support</p>
        <div>
          <Link className="primary-button" href="/cart">
            Return To Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutFailurePage;
