function AdminFeaturedProductGrid({ product, isSelected, onToggle }) {
  return (
    <label
      className={`checkout-delivery-detail-item ${isSelected && "checked"}`}
    >
      <input type="checkbox" checked={isSelected} onChange={onToggle} />
      <p>{product.name}</p>
    </label>
  );
}

export default AdminFeaturedProductGrid;
