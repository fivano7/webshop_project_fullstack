import axios from "axios";
import Head from "next/head";
import Link from "next/link";

function SubscriptionConfirmationPage({ success }) {
  return (
    <div className="newsletter-confirmation-section">
      <Head>
        <title>Confirmation | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Subscription Confirmation</h2>
        {success ? (
          <p>Newsletter subscription successfully confirmed</p>
        ) : (
          <p>
            Error confirming newsletter subscription. Please contact support
          </p>
        )}
        <Link href="/" className="primary-button">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { subscriptionConfirmToken } = context.query;
  let success = false;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newslettersubscribers/confirmemail/${subscriptionConfirmToken}`,
    );
    success = response.data.success;
  } catch (error) { }

  return {
    props: {
      success,
    },
  };
}

export default SubscriptionConfirmationPage;
