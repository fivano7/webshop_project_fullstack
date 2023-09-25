import withAuthServer from "@/components/hocs/withAuthServer";
import CreateDeliveryDetailForm from "@/components/userPage/deliveryDetailsPage/CreateDeliveryDetailForm";
import DeliveryDetailGrid from "@/components/userPage/deliveryDetailsPage/DeliveryDetailGrid";
import { useAuth } from "@/store/AuthContext";
import {
  decodeJwtToken,
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

const DeliveryDetailsPage = ({ initialDeliveryDetails }) => {
  const { jwtToken, userId } = useAuth();
  const [deliveryDetails, setDeliveryDetails] = useState(
    initialDeliveryDetails,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleCreateDeliveryDetail = async (newDetail) => {
    try {
      const response = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/deliverydetails`,
        "POST",
        { ...newDetail, userId },
      );

      setDeliveryDetails([...deliveryDetails, response]);
      setShowCreateForm(false);
      setStatusMessage("Delivery detail created");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleUpdateDeliveryDetail = async (updatedDetail) => {
    setStatusMessage("");
    try {
      const response = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/deliverydetails/${updatedDetail._id}`,
        "PUT",
        updatedDetail,
      );

      const updatedIndex = deliveryDetails.findIndex(
        (detail) => detail._id === response._id,
      );
      const updatedDetails = [...deliveryDetails];
      updatedDetails[updatedIndex] = response;

      setDeliveryDetails(updatedDetails);
      setStatusMessage("Delivery detail updated");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleDeleteDeliveryDetail = async (id) => {
    setStatusMessage("");
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/deliverydetails/${id}`,
        "DELETE",
      );

      setDeliveryDetails(deliveryDetails.filter((detail) => detail._id !== id));
      setStatusMessage("Delivery detail deleted");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="delivery-details-section">
      <Head>
        <title>Delivery Details | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Delivery Details</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <button
          className="primary-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Hide form" : "Create New Delivery Detail"}
        </button>
        {showCreateForm && (
          <CreateDeliveryDetailForm onCreate={handleCreateDeliveryDetail} />
        )}
        {deliveryDetails.length === 0 ? (
          <p>You don't have any delivery details yet</p>
        ) : (
          deliveryDetails.map((deliveryDetail) => (
            <DeliveryDetailGrid
              key={deliveryDetail._id}
              deliveryDetail={deliveryDetail}
              onDelete={() => handleDeleteDeliveryDetail(deliveryDetail._id)}
              onUpdate={handleUpdateDeliveryDetail}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = withAuthServer(
  async (context) => {
    const userId = decodeJwtToken(context.req.cookies._webShopAuthToken).id;
    const deliveryDetails = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/deliverydetails?user=${userId}`,
    );
    return { props: { initialDeliveryDetails: deliveryDetails } };
  },
  ["admin", "user"],
);

export default DeliveryDetailsPage;
