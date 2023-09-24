function NumberInput({ quantity, setQuantity }) {
  return (
    <div className="number-input">
      <button
        className="primary-button"
        onClick={() => {
          if (quantity > 1) {
            setQuantity(quantity - 1);
          }
        }}
      >
        -
      </button>
      <input
        min={1}
        step={1}
        type="number"
        value={quantity}
        onChange={(e) => {
          const newQuantity = parseInt(e.target.value, 10);
          if (!isNaN(newQuantity) && newQuantity > 1) {
            setQuantity(newQuantity);
          }
        }}
      />
      <button
        className="primary-button"
        onClick={() => setQuantity(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}

export default NumberInput;
