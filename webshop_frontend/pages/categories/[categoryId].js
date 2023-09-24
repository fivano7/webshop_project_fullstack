import SearchBar from "@/components/adminPage/categoriesPage/SearchBar";
import ProductGrid from "@/components/categoriesPage/ProductGrid";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";

const ProductsForCategoryPage = ({ category }) => {
  const initialProducts = category.products;
  const [products, setProducts] = useState(initialProducts);
  const [filterValue, setFilterValue] = useState("");
  const [sortingCriteria, setSortingCriteria] = useState("");

  const clearFilter = () => {
    setFilterValue("");
    setProducts(initialProducts);
  };

  const handleSortingChange = (e) => {
    e.preventDefault();
    const selectedCriteria = e.target.value;
    setSortingCriteria(selectedCriteria);

    const sorted = [...products];

    switch (selectedCriteria) {
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setProducts(sorted);
  };

  const handleFilterChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setFilterValue(inputValue);

    if (inputValue) {
      const filteredProducts = initialProducts.filter((product) =>
        product.name.toLowerCase().includes(inputValue),
      );
      setProducts(filteredProducts);
    } else {
      setProducts(initialProducts);
    }
  };

  return (
    <div className="category-products-section">
      <Head>
        <title>{category.name} | Smith Pottery</title>
      </Head>
      <div className="section-container two-column">
        <div className="col-left">
          <SearchBar
            value={filterValue}
            onChange={handleFilterChange}
            text={"Clear"}
            placeholder={"Search..."}
            disabled={filterValue.length === 0}
            className="inverse"
            onClick={clearFilter}
            dark={true}
          />

          <div className="form-group">
            <select
              className="dropdown inverse"
              value={sortingCriteria}
              onChange={handleSortingChange}
              required
            >
              {!sortingCriteria && (
                <option value="">Select Sorting Criteria</option>
              )}
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A-Z</option>
              <option value="nameDesc">Name: Z-A</option>
            </select>
          </div>
        </div>
        <div className="col-right">
          <h2>{category.name}</h2>
          <div className="categories-products-list">
            {products.map((product) => (
              <ProductGrid key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { categoryId } = params;

  try {
    const categoryResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${categoryId}`,
    );

    const category = categoryResponse.data.data;

    return {
      props: {
        category,
      },
    };
  } catch (error) {
    console.error("Error fetching category:", error.message);
    return {
      props: {
        category: null,
      },
    };
  }
}

export default ProductsForCategoryPage;
