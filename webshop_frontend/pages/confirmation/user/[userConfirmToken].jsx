import axios from "axios";
import Head from "next/head";
import Link from "next/link";

function EmailConfirmationPage({ success }) {
  return (
    <div className="email-confirmation-section">
      <Head>
        <title>Confirmation | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>User Email Confirmation</h2>
        {success ? (
          <p>User email address successfully confirmed</p>
        ) : (
          <p>Error confirming user email. Please contact support.</p>
        )}
        <Link href="/" className="primary-button">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { userConfirmToken } = context.query;
  let success = false;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/confirmemail/${userConfirmToken}`,
    );
    success = response.data.success;
  } catch (error) { }

  return {
    props: {
      success,
    },
  };
}

export default EmailConfirmationPage;
