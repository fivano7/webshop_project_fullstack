import { useState } from "react";

const CreateDeliveryDetailForm = ({ onCreate }) => {
  const [newDetail, setNewDetail] = useState({
    country: "",
    city: "",
    postalCode: "",
    street: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newDetail);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="firstName"
          value={newDetail.firstName}
          onChange={handleChange}
          required
        />
        <label>First Name:</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="lastName"
          value={newDetail.lastName}
          onChange={handleChange}
          required
        />
        <label>Last Name:</label>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="country"
          value={newDetail.country}
          onChange={handleChange}
          required
        />
        <label>Country:</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="city"
          value={newDetail.city}
          onChange={handleChange}
          required
        />
        <label>City:</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="postalCode"
          value={newDetail.postalCode}
          onChange={handleChange}
          required
        />
        <label>Postal Code:</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="street"
          value={newDetail.street}
          onChange={handleChange}
          required
        />
        <label>Street:</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="phoneNumber"
          value={newDetail.phoneNumber}
          onChange={handleChange}
          required
        />
        <label>Phone Number:</label>
      </div>

      <button className="primary-button" type="submit">
        Create
      </button>
    </form>
  );
};

export default CreateDeliveryDetailForm;
