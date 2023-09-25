import { useState } from "react";

function AdminFaqGrid({ faq, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFaq, setEditedFaq] = useState(faq);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFaq((prevFaq) => ({
      ...prevFaq,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    if (isEditing) {
      e.preventDefault();
      onUpdate(editedFaq);
      setIsEditing(false);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className={`delivery-detail-item ${isEditing && "selected"}`}
    >
      <p>{isEditing && "Editing Delivery Detail"}</p>
      <div className="form-group">
        <input
          type="text"
          name="question"
          value={editedFaq.question}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>Question</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="answer"
          value={editedFaq.answer}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>Answer</label>
      </div>

      {isEditing ? (
        <>
          <button className="primary-button" type="submit">
            Save
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button className="primary-button" type="button" onClick={onDelete}>
            Delete
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </>
      )}
    </form>
  );
}

export default AdminFaqGrid;
