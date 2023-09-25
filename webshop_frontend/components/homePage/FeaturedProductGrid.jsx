import { displayPrice, formatPercentage } from "@/utils/priceUtils";
import Link from "next/link";

const FeaturedProductGrid = ({ product }) => {
  return (
    <Link className="featured-product-item" href={`/products/${product._id}`}>
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${
          product.images[0] ? product.images[0] : "no-image.jpg"
        }`}
        alt="Featured Product"
      />

      {product.discountPrice ? (
        <div className="discount">
          <p>{formatPercentage(product.price, product.discountPrice)}% OFF</p>
        </div>
      ) : (
        <></>
      )}

      <div className="name-price">
        <h6>
          {displayPrice(product.discountPrice ? product.discountPrice : product.price)}€
        </h6>
        <p className="product-name">{product.name}</p>
      </div>
    </Link>
  );
};

export default FeaturedProductGrid;
