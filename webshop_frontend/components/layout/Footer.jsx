import Link from "next/link";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="section-container">
        <div className="col">
          <h3>Quick Access</h3>
          <ul>
            <li>
              <Link href="/categories">Categories</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="faqs">FAQs</Link>
            </li>
          </ul>
        </div>
        <div className="col">
          <h3>User data</h3>
          <ul>
            <li>
              <Link href="/user">Profile</Link>
            </li>
            <li>
              <Link href="/cart">Cart</Link>
            </li>
            <li>
              <Link href="/favourites">Favourites</Link>
            </li>
          </ul>
        </div>
        <div className="col">
          <h3>Contact</h3>
          <ul>
            <li>
              <Link href="/#number">Number</Link>
            </li>
            <li>
              <Link href="/#email">Email</Link>
            </li>
            <li>
              <Link href="/#working-hours">Working Hours</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
