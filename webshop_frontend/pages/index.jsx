import FeaturedProducts from "@/components/homePage/FeaturedProducts";
import NewsletterSignup from "@/components/homePage/NewsletterSignup";
import axios from "axios";
import {
  faCreditCard,
  faRotateLeft,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const HomePage = ({ featuredItem }) => {
  return (
    <div className="home-section">
      <Head>
        <title>Home | Smith Pottery</title>
      </Head>

      <div className="section-container">
        {featuredItem.featuredProducts.length !== 0 && (
          <FeaturedProducts featuredItem={featuredItem} />
        )}

        <div className="webshop-features">
          <div className="single-feature">
            <div className="icon-container">
              <FontAwesomeIcon className="icon" icon={faTruck} />
            </div>
            <div className="text">
              <p>Free delivery</p>
              <p>For all products</p>
            </div>
          </div>
          <div className="single-feature">
            <div className="icon-container">
              <FontAwesomeIcon className="icon" icon={faRotateLeft} />
            </div>
            <div className="text">
              <p>Return</p>
              <p>Up to 14 days</p>
            </div>
          </div>
          <div className="single-feature">
            <div className="icon-container">
              <FontAwesomeIcon className="icon" icon={faCreditCard} />
            </div>
            <div className="text">
              <p>Payment</p>
              <p>Up to 6 installments</p>
            </div>
          </div>
        </div>

        <div className="image-text-item">
          <div className="text">
            <h2>Welcome to Smith Pottery!</h2>
            <p>
              Discover the world of ceramics where tradition and modern design
              unite. At Smith Pottery, we craft unique ceramic pieces that add
              charm to your home.
            </p>
            <p>
              Explore our collection, hand-painted with care, to find the
              perfect addition to your space. Enjoy the allure of ceramics and
              shop with ease, as we deliver our creations directly to your
              doorstep.
            </p>
          </div>
          <div className="image">
            <Image
              width={400}
              height={400}
              src="/assets/pottery6.jpg"
              alt="pottery"
            />
          </div>
        </div>

        <div className="explore-button">
          <Link className="primary-button" href="categories">
            Explore Our Products
          </Link>
        </div>

        <div className="newsletter-contact">
          <NewsletterSignup />
          <div className="contact">
            <p className="heading">Customer Support</p>
            <h5 id="number">0800 9876</h5>
            <p id="email">
              <a href="mailto:admin@webshop.hr">admin@webshop.hr</a>
            </p>
            <p id="working-hours">Mon-Fri: 8am - 4pm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/featureditem`,
  );
  const featuredItem = response.data.data;

  return {
    props: {
      featuredItem,
    },
  };
}

export default HomePage;
