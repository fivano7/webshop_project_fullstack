import withAuthServer from "@/components/hocs/withAuthServer";
import { useAuth } from "@/store/AuthContext";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const AddProductPage = ({ categories }) => {
  const router = useRouter();
  const { jwtToken } = useAuth();
  const [statusMessage, setStatusMessage] = useState("");
  const [images, setImages] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: 0,
    brand: "",
    categoryId: "",
    stock: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      setStatusMessage(`You can upload maximum of 5 images`);
      return;
    }
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (!images || images.length === 0) {
      setStatusMessage("You must upload at least one image");
      return;
    }

    if (formData.discountPrice >= formData.price) {
      setStatusMessage("Discount price must be lower than price");
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      }

      for (let i = 0; i < images.length; i++) {
        data.append("productImages", images[i]);
      }

      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
        "POST",
        data,
      );

      router.push("/admin/products?message=added");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="admin-add-product-section">
      <Head>
        <title>Product Creation | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Add Product</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
            <label>Name</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
            />
            <label>Description</label>
          </div>
          <div className="form-group">
            <input
              type="number"
              step="0.01"
              min={0.01}
              name="price"
              required
              value={formData.price}
              onChange={handleInputChange}
            />
            <label>Price</label>
          </div>
          <div className="form-group">
            <input
              type="number"
              step="0.01"
              min={0}
              name="discountPrice"
              required
              value={formData.discountPrice}
              onChange={handleInputChange}
            />
            <label>Discount Price (0 to remove)</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="brand"
              required
              value={formData.brand}
              onChange={handleInputChange}
            />
            <label>Brand</label>
          </div>

          <div className="form-group">
            <input
              type="number"
              step="1"
              min={0}
              name="stock"
              required
              value={formData.stock}
              onChange={handleInputChange}
            />
            <label>Stock</label>
          </div>

          <div className="form-group">
            <select
              className="dropdown"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="uploaded-images">
            {images &&
              Array.from(images).map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Image ${index}`}
                />
              ))}
          </div>

          <div className="file-input">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="files-upload"
              name="images"
              multiple
            />
            <label htmlFor="files-upload" className="primary-button">
              Choose Image(s)
            </label>
          </div>
          <div>
            <button className="primary-button" type="submit">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = withAuthServer(
  async (context) => {
    const categories = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`,
    );

    return { props: { categories } };
  },
  ["admin"],
);

export default AddProductPage;
