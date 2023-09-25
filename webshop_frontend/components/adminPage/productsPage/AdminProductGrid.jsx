import { displayPrice } from "@/utils/priceUtils";
import Link from "next/link";

function AdminProductGrid({ product, onDelete }) {
  return (
    <div className="admin-product-item">
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${
          product.images[0] ? product.images[0] : "no-image.jpg"
        }`}
        alt="Product"
      />
      <h5>{product.name}</h5>
      <h6>{displayPrice(product.price)}€</h6>
      <div className="btn-delete">
        <Link className="primary-button" href={`products/${product._id}`}>
          Edit
        </Link>
      </div>
      <div className="btn-delete">
        <button className="primary-button" onClick={onDelete}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default AdminProductGrid;
