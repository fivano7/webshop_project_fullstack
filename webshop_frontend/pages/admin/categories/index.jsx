import AdminCategoryGrid from "@/components/adminPage/categoriesPage/AdminCategoryGrid";
import CreateCategoryForm from "@/components/adminPage/categoriesPage/CreateCategoryForm";
import SearchBar from "@/components/adminPage/categoriesPage/SearchBar";
import withAuthServer from "@/components/hocs/withAuthServer";
import { useAuth } from "@/store/AuthContext";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

const AdminCategoriesPage = ({ initialCategories }) => {
  const { jwtToken } = useAuth();
  const [categories, setCategories] = useState(initialCategories);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const handleDeleteCategory = async (categoryId) => {
    setStatusMessage("");
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${categoryId}`,
        "DELETE",
      );

      setCategories(
        categories.filter((category) => category._id !== categoryId),
      );
      setStatusMessage("Category deleted");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleCreateCategory = async (name, image) => {
    setStatusMessage("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryImage", image);
      const response = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`,
        "POST",
        formData,
      );

      setCategories([...categories, response]);
      setShowCreateForm(false);
      setStatusMessage("Category created");
      return true; //So newCategory doesn't get reset
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    setStatusMessage("");
    try {
      const formData = new FormData();
      formData.append("name", updatedCategory.name);
      formData.append("categoryImage", updatedCategory.image);
      const response = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${updatedCategory._id}`,
        "PUT",
        formData,
      );

      const updatedIndex = categories.findIndex(
        (category) => category._id === response._id,
      );
      const updatedCategories = [...categories];
      updatedCategories[updatedIndex] = response;

      setCategories(updatedCategories);
      setStatusMessage("Category updated");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleFilterChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    const filteredCategories = initialCategories.filter((category) =>
      category.name.toLowerCase().includes(inputValue),
    );
    setFilterValue(inputValue);
    setCategories(filteredCategories);
  };

  const clearFilter = () => {
    setFilterValue("");
    setCategories(initialCategories);
  };

  return (
    <div className="admin-categories-section">
      <Head>
        <title>Categories Management | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Categories</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <div className="upper-buttons-wrapper">
          <button
            className="primary-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Hide form" : "Create New Category"}
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

        {showCreateForm && (
          <CreateCategoryForm onCreate={handleCreateCategory} />
        )}
        <div className="categories-list">
          {categories.length === 0 ? (
            <p>No categories available</p>
          ) : (
            categories.map((category) => (
              <AdminCategoryGrid
                key={category._id}
                category={category}
                onDelete={() => handleDeleteCategory(category._id)}
                onUpdate={handleUpdateCategory}
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
    const categoriesResponse = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`,
    );
    const initialCategories = categoriesResponse;

    return { props: { initialCategories } };
  },
  ["admin"],
);

export default AdminCategoriesPage;
