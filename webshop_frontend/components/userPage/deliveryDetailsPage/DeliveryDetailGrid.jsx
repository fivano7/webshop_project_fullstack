import { useState } from "react";

function DeliveryDetailGrid({ deliveryDetail, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetail, setEditedDetail] = useState(deliveryDetail);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    if (isEditing) {
      e.preventDefault();
      onUpdate(editedDetail);
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
          name="firstName"
          value={editedDetail.firstName}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>First Name</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="lastName"
          value={editedDetail.lastName}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>Last Name</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="country"
          value={isEditing ? editedDetail.country : deliveryDetail.country}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>Country</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="city"
          value={editedDetail.city}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>City</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="postalCode"
          value={editedDetail.postalCode}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>Postal Code</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="street"
          value={editedDetail.street}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>Street</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="phoneNumber"
          value={editedDetail.phoneNumber}
          onChange={handleInputChange}
          required
          disabled={!isEditing}
        />
        <label>Phone Number</label>
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

export default DeliveryDetailGrid;
