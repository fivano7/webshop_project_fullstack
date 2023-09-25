import { useState } from "react";

function CreateOrderStatusForm({ onCreate }) {
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(status, comment);
    setStatus("");
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="new-category-form">
      <div className="form-group">
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <label>Status</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <label>Comment</label>
      </div>

      <button className="primary-button" type="submit">
        Create
      </button>
    </form>
  );
}

export default CreateOrderStatusForm;
