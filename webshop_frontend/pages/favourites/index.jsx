import FavouriteItemGrid from "@/components/favouritePage/FavouriteItemGrid";
import { useAuth } from "@/store/AuthContext";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

const FavouritePage = () => {
  const [favouriteData, setFavouriteData] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const { favouriteId } = useAuth();

  const updateFavourite = async (productId) => {
    setStatusMessage("");
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favourites/${favouriteId}`,
        {
          productId,
        },
      );
      setFavouriteData(response.data.data.favouriteItems);
      setStatusMessage("Product removed from favourites");
    } catch (error) {
      console.error("Error updating favourite:", error);
    }
  };

  useEffect(() => {
    const fetchFavouriteData = async () => {
      try {
        if (favouriteId) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favourites/${favouriteId}`,
          );
          setFavouriteData(response.data.data.favouriteItems);
        }
      } catch (error) {
        console.error("Error fetching favourite data:", error);
      }
    };

    fetchFavouriteData();
  }, [favouriteId]);

  return (
    <div className="favourites-section">
      <Head>
        <title>Favourite Products | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Your Favourite Products</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        {favouriteData && favouriteData.length > 0 ? (
          favouriteData.map((favouriteItem) => (
            <FavouriteItemGrid
              key={favouriteItem._id}
              favouriteItem={favouriteItem}
              updateFavourite={updateFavourite}
              setStatusMessage={setStatusMessage}
            />
          ))
        ) : (
          <p>You don't have any favourite products</p>
        )}
      </div>
    </div>
  );
};

export default FavouritePage;
