import { displayPrice } from "@/utils/priceUtils";
import AddToCartButton from "../productsPage/AddToCartButton";

const FavouriteItemGrid = ({
  favouriteItem,
  updateFavourite,
  setStatusMessage,
}) => {
  const handleToggleFavourite = async () => {
    await updateFavourite(favouriteItem.product._id);
  };

  return (
    <div className="favourite-item">
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${
          favouriteItem.product.images[0]
            ? favouriteItem.product.images[0]
            : "no-image.jpg"
        }`}
        alt="Product"
      />
      <h5>{favouriteItem.product.name}</h5>
      <h6>{displayPrice(favouriteItem.product.price)}€</h6>
      <AddToCartButton
        productId={favouriteItem.product._id}
        key={favouriteItem.product._id}
        setStatusMessage={setStatusMessage}
      />
      <div className="btn-remove">
        <button
          className="primary-button "
          onClick={(e) => handleToggleFavourite(e)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default FavouriteItemGrid;
