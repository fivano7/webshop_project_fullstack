import { useAuth } from "@/store/AuthContext";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const ToggleFavourite = ({ productId, setStatusMessage }) => {
  const { favouriteId } = useAuth();
  const [productIsFavourite, setProductIsFavourite] = useState(false);

  useEffect(() => {
    const fetchFavourite = async () => {
      try {
        if (favouriteId) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favourites/${favouriteId}/${productId}`,
          );
          setProductIsFavourite(response.data.data.productExistsInFavourite);
        }
      } catch (error) {
        console.error("Error fetching favourites:", error);
      }
    };

    fetchFavourite();
  }, [favouriteId]);

  const handleToggleFavourite = async () => {
    setStatusMessage("");
    try {
      if (!favouriteId) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favourites`,
          {
            productId,
          },
        );
        const newFavouriteId = response.data.data._id;
        setProductIsFavourite(true);
        setStatusMessage("Product added to favourites");
        Cookies.set("_favouriteIdWebshop", newFavouriteId);
      } else {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favourites/${favouriteId}`,
          {
            productId,
          },
        );

        if (response.data.data.favouriteItems.length !== 0) {
          const productExistsInFavourite =
            response.data.data.favouriteItems.some(
              (favouriteItem) => favouriteItem.product === productId,
            );
          if (productExistsInFavourite) {
            setStatusMessage("Product added to favourites");
          } else {
            setStatusMessage("Product removed from favourites");
          }

          setProductIsFavourite(productExistsInFavourite);
        } else {
          setStatusMessage("Product removed from favourites");
          setProductIsFavourite(false);
        }
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  return (
    <div className="toggle-favourite" onClick={handleToggleFavourite}>
      {productIsFavourite ? (
        <FontAwesomeIcon icon={fullHeart} className="heart-icon" />
      ) : (
        <FontAwesomeIcon icon={emptyHeart} className="heart-icon" />
      )}
    </div>
  );
};

export default ToggleFavourite;
