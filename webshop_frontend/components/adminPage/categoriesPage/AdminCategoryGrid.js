import { useState } from "react";

function AdminCategoryGrid({ category, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedImage, setEditedImage] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setEditedCategory((prevCategory) => ({
      ...prevCategory,
      image: imageFile,
    }));

    setEditedImage(URL.createObjectURL(imageFile));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdate(editedCategory);
    setIsEditing(false);
  };

  return (
    <div className="category-item">
      <h5>{category.name}</h5>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="editing">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={editedCategory.name}
              onChange={handleInputChange}
              required
            />
            <label>Name</label>
          </div>

          <div className="image-display-upload">
            <img
              src={
                editedImage
                  ? editedImage
                  : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${category.image}`
              }
              alt={editedCategory.name}
            />
            <div className="file-input">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="category-image-upload"
              />
              <label htmlFor="category-image-upload" className="primary-button">
                Change
              </label>
            </div>
          </div>

          <div className="buttons">
            <button className="primary-button" onClick={handleUpdate}>
              Save
            </button>
            <button
              className="primary-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="displaying">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${category.image}`}
            alt={category.name}
          />
          <div className="buttons">
            <button
              className="primary-button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button className="primary-button" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategoryGrid;
