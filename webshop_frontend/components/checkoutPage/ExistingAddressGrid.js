const ExistingAddressGrid = ({
  detail,
  selectedDetailId,
  handleRadioExistingAddress,
}) => {
  return (
    <label
      className={`checkout-delivery-detail-item ${
        selectedDetailId === detail._id && "checked"
      }`}
    >
      <input
        type="radio"
        checked={selectedDetailId === detail._id}
        onChange={() => handleRadioExistingAddress(detail._id)}
      />
      <p>
        {detail.firstName} {detail.lastName}, {detail.street},{" "}
        {detail.postalCode} {detail.city}, {detail.country},{" "}
        {detail.phoneNumber}
      </p>
    </label>
  );
};

export default ExistingAddressGrid;
