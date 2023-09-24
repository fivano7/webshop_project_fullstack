import SearchBar from "@/components/adminPage/categoriesPage/SearchBar";
import AdminProductGrid from "@/components/adminPage/productsPage/AdminProductGrid";
import withAuthServer from "@/components/hocs/withAuthServer";
import { useAuth } from "@/store/AuthContext";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const AdminProductsPage = ({ initialProducts }) => {
  const { jwtToken } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  const message =
    router.query.message === "added"
      ? "Product successfully added"
      : router.query.message === "updated"
        ? "Product successfully updated"
        : "";
  const [statusMessage, setStatusMessage] = useState(message);
  const [filterValue, setFilterValue] = useState("");

  const handleDeleteProduct = async (productId) => {
    setStatusMessage("");
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}`,
        "DELETE",
      );

      setProducts(products.filter((product) => product._id !== productId));
      setStatusMessage("Product deleted!");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleFilterChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    const filteredProducts = initialProducts.filter((product) =>
      product.name.toLowerCase().includes(inputValue),
    );
    setFilterValue(inputValue);
    setProducts(filteredProducts);
  };

  const clearFilter = () => {
    setFilterValue("");
    setProducts(initialProducts);
  };

  return (
    <div className="admin-products-section">
      <Head>
        <title>Products Management | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Products</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <div className="upper-buttons-wrapper">
          <button
            className="primary-button"
            onClick={() => router.push("products/add")}
          >
            Add New Product
          </button>
          <SearchBar
            value={filterValue}
            onChange={handleFilterChange}
            text={"Clear"}
            placeholder={"Search.."}
            disabled={filterValue.length === 0}
            onClick={clearFilter}
          />
        </div>
        <div className="products-list">
          {products.length === 0 ? (
            <p>No products to display.</p>
          ) : (
            products.map((product) => (
              <AdminProductGrid
                key={product._id}
                product={product}
                onDelete={() => handleDeleteProduct(product._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withAuthServer(
  async (context) => {
    const initialProducts = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
    );

    return { props: { initialProducts } };
  },
  ["admin"],
);

export default AdminProductsPage;
