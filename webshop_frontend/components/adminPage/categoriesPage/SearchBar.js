function SearchBar({
  value,
  onChange,
  placeholder,
  onClick,
  disabled,
  text,
  dark = false,
}) {
  return (
    <div className={`search-bar ${dark ? "inverse" : ""}`}>
      <input
        type="te
                
                
                xt"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button className="primary-button" onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </div>
  );
}

export default SearchBar;
