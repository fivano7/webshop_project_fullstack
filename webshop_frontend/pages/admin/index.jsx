import withAuthServer from "@/components/hocs/withAuthServer";
import Head from "next/head";
import Link from "next/link";

function AdminPage() {
  return (
    <div className="user-profile-section">
      <Head>
        <title>Admin Panel | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Admin Panel</h2>
        <ul>
          <li>
            <Link href="/admin/categories">Categories Management</Link>
          </li>
          <li>
            <Link href="/admin/products">Products Management</Link>
          </li>
          <li>
            <Link href="/admin/featured-products">
              Featured Products Management
            </Link>
          </li>
          <li>
            <Link href="/admin/faqs">FAQs Management</Link>
          </li>
          <li>
            <Link href="/admin/newsletter">Newsletter</Link>
          </li>
          <li>
            <Link href="/admin/orders">Orders</Link>
          </li>
          <li>
            <Link href="/admin/user-data">User Data</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthServer(async () => {
  return { props: {} };
}, ["admin"]);

export default AdminPage;
