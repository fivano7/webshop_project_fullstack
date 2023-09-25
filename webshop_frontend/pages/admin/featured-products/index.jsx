import AdminFeaturedProductGrid from "@/components/featuredProductsPage/AdminFeaturedProductGrid";
import withAuthServer from "@/components/hocs/withAuthServer";
import { useAuth } from "@/store/AuthContext";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

function AdminFeaturedProductsPage({ featuredItem, allProducts }) {
  const [selectedProducts, setSelectedProducts] = useState(
    featuredItem.featuredProducts.map((product) => product._id),
  );
  const [promoMessage, setPromoMessage] = useState(
    featuredItem.promoMessage || "",
  );
  const [statusMessage, setStatusMessage] = useState("");
  const { jwtToken } = useAuth();

  const handleToggleSelectedProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleUpdateFeaturedProducts = async () => {
    setStatusMessage("");

    if (selectedProducts.length > 5) {
      setStatusMessage("You can select up to 5 featured products");
      return;
    }

    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/featureditem`,
        "PUT",
        { featuredProducts: selectedProducts },
      );
      setStatusMessage("Featured products updated.");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleUpdatePromoMessage = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/featureditem`,
        "PUT",
        { promoMessage },
      );
      setStatusMessage("Promo message updated.");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="admin-featured-products-section">
      <Head>
        <title>Featured Products Management | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Promotional Content</h2>
        <form onSubmit={handleUpdatePromoMessage}>
          <div className="form-group">
            <input
              type="text"
              value={promoMessage}
              onChange={(e) => setPromoMessage(e.target.value)}
            />
            <label>Featured Message (empty to remove)</label>
          </div>
          <button className="primary-button" type="submit">
            Save Featured Message
          </button>
        </form>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <h4>Featured Products</h4>
        {allProducts.map((product) => (
          <AdminFeaturedProductGrid
            key={product._id}
            product={product}
            isSelected={selectedProducts.includes(product._id)}
            onToggle={() => handleToggleSelectedProduct(product._id)}
          />
        ))}

        <div className="featured-products-btn">
          <button
            className="primary-button"
            onClick={handleUpdateFeaturedProducts}
          >
            Update products
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthServer(
  async (context) => {
    const featuredItem = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/featureditem`,
    );
    const allProducts = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
    );
    return { props: { featuredItem, allProducts } };
  },
  ["admin"],
);

export default AdminFeaturedProductsPage;
