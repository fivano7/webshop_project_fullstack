import Head from "next/head";
import Link from "next/link";

function NewsletterPage() {
  return (
    <div className="user-profile-section">
      <Head>
        <title>Newsletter Management | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Newsletter</h2>
        <ul>
          <li>
            <Link href="/admin/newsletter/subscribers">
              Newsletter Subscribers
            </Link>
          </li>
          <li>
            <Link href="/admin/newsletter/send">Send Newsletter</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NewsletterPage;
