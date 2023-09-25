import { useState } from "react";

function CreateCategoryForm({ onCreate }) {
  const [newCategory, setNewCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (await onCreate(newCategory, categoryImage)) {
      setNewCategory("");
      setCategoryImage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-category-form">
      <div className="form-group">
        <input
          type="text"
          name="firstName"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <label>Category Name</label>
      </div>
      {categoryImage && (
        <div className="uploaded-image">
          <img src={URL.createObjectURL(categoryImage)} alt="Uploaded Image" />
        </div>
      )}
      <div className="file-input">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCategoryImage(e.target.files[0])}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="primary-button">
          Choose {`${categoryImage ? "Another" : ""}`} File
        </label>
      </div>

      <button className="primary-button" type="submit">
        Create
      </button>
    </form>
  );
}

export default CreateCategoryForm;
