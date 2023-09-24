import AddReview from "@/components/productsPage/AddReview";
import AddToCartButton from "@/components/productsPage/AddToCartButton";
import ProductReviews from "@/components/productsPage/ProductReviews";
import ToggleFavourite from "@/components/productsPage/ToggleFavourite";
import { displayPrice, formatPercentage } from "@/utils/priceUtils";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";

const ProductDetailPage = ({ product }) => {
  const [reviews, setReviews] = useState(product.reviews);
  const [statusMessage, setStatusMessage] = useState("");
  const [displayedImage, setDisplayedImage] = useState(
    product.images.length > 0 ? product.images[0] : "no-image.jpg",
  );

  const handleReviewAdded = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  const handleReviewDeleted = async (deletedReviewId) => {
    setReviews(reviews.filter((review) => review._id !== deletedReviewId));
  };

  return (
    <div className="product-section">
      <Head>
        <title>{product.name} | Smith Pottery</title>
      </Head>
      <div className="section-container ">
        <div className="two-column">
          <div className="col-left">
            <img
              className="displayed-image"
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${displayedImage}`}
              alt="Product"
            />

            <div className="other-images">
              {product.images.length > 0 &&
                product.images.map((img, index) => (
                  <img
                    alt="Product"
                    key={index}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
                    onClick={() => setDisplayedImage(img)}
                  />
                ))}
            </div>
          </div>
          <div className="col-right">
            <div className="title-favourite">
              <h2>{product.name}</h2>
              <ToggleFavourite
                productId={product._id}
                setStatusMessage={setStatusMessage}
              />
            </div>

            {statusMessage && <p className="status-message">{statusMessage}</p>}
            <p>{product.description}</p>

            <div className="order-details">
              <div className="single-detail">
                <p>Brand</p>
                <p>{product.brand}</p>
              </div>
              <div className="single-detail">
                <p>Category</p>
                <p>{product.category.name}</p>
              </div>
              <div className="single-detail">
                <p>Availability</p>
                <p>{product.isAvailable ? "Available" : "Out of stock"}</p>
              </div>
              <div className="single-detail">
                <p>Average Rating: </p>
                <p>
                  {product.averageRating !== 0 ? (
                    <span>
                      {product.averageRating} <span className="star">★</span>
                    </span>
                  ) : (
                    "No Reviews Yet"
                  )}
                </p>
              </div>
            </div>

            <div className="price">
              {product.discountPrice ? (
                <>
                  <h6 className="line-trough">Was {displayPrice(product.price)}€</h6>
                  <h2>{displayPrice(product.discountPrice)}€</h2>
                  <h6>
                    {formatPercentage(product.price, product.discountPrice)}%
                    save
                  </h6>
                </>
              ) : (
                <h2>{displayPrice(product.price)}€</h2>
              )}
            </div>

            <AddToCartButton
              productId={product._id}
              setStatusMessage={setStatusMessage}
            />
          </div>
        </div>
        <AddReview
          productId={product._id}
          onReviewAdded={handleReviewAdded}
          reviews={reviews}
        />
        <ProductReviews
          reviews={reviews}
          onReviewDeleted={handleReviewDeleted}
        />
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
  );
  const products = response.data.data;

  const paths = products.map((product) => ({
    params: { productId: product._id },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  try {
    const { productId } = params;
    const productResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}`,
    );
    const product = productResponse.data.data;

    return {
      props: {
        product,
      },
      revalidate: 5,
    };
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return {
      props: {
        product: null,
      },
    };
  }
}

export default ProductDetailPage;
