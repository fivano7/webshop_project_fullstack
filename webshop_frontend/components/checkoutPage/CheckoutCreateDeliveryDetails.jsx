const CheckoutCreateDeliveryDetails = ({
  formData,
  handleChangeForm,
  statusMessage,
}) => (
  <>
    {statusMessage && <p className="status-message">{statusMessage}</p>}
    <div className="form-group">
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChangeForm}
        required
      />
      <label>First Name</label>
    </div>
    <div className="form-group">
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChangeForm}
        required
      />
      <label>Last Name</label>
    </div>
    <div className="form-group">
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChangeForm}
        required
      />
      <label>Country</label>
    </div>
    <div className="form-group">
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChangeForm}
        required
      />
      <label>City</label>
    </div>
    <div className="form-group">
      <input
        type="text"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChangeForm}
        required
      />
      <label>Postal Code</label>
    </div>
    <div className="form-group">
      <input
        type="text"
        name="street"
        value={formData.street}
        onChange={handleChangeForm}
        required
      />
      <label>Street</label>
    </div>
    <div className="form-group">
      <input
        type="text"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChangeForm}
        required
      />
      <label>Phone Number</label>
    </div>
  </>
);

export default CheckoutCreateDeliveryDetails;
