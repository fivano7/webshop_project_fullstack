import FeaturedProductGrid from "./FeaturedProductGrid";

const FeaturedProducts = ({ featuredItem }) => {
  const { promoMessage, featuredProducts } = featuredItem;

  return (
    <div
      className={`featured-products-list ${
        promoMessage.length === 0 ? "" : "has-promo"
      }`}
    >
      {/* <div className='left-navigation'>
        {"◀"}
      </div>
      <div className='right-navigation'>
        {"▶"}
      </div> */}

      {featuredProducts.map((product) => (
        <FeaturedProductGrid key={product._id} product={product} />
      ))}
      {promoMessage.length > 0 && (
        <div className="promo-message">
          <p>{promoMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
