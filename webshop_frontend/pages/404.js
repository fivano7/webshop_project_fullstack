import Head from "next/head";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="error-section">
      <Head>
        <title>404 - Not Found | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>404 - Page Not Found</h2>
        <p>The page you're looking for does not exist</p>
        <Link href="/" className="primary-button">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};
export default NotFoundPage;
