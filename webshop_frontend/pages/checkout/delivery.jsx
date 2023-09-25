import CheckoutCreateDeliveryDetails from "@/components/checkoutPage/CheckoutCreateDeliveryDetails";
import ExistingAddressGrid from "@/components/checkoutPage/ExistingAddressGrid";
import { useAuth } from "@/store/AuthContext";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CheckoutDeliveryPage = () => {
  const { userId } = useAuth();

  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();
  const { guestEmail } = router.query;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    postalCode: "",
    street: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (userId) {
      fetchDeliveryDetails();
    }
  }, [userId]);

  const fetchDeliveryDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/deliverydetails?user=${userId}`,
      );
      setDeliveryDetails(response.data.data);
      if (response.data.count > 0) {
        setSelectedDetailId(response.data.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching delivery details:", error);
    }
  };

  const handleRadioNewAddress = () => {
    setSelectedDetailId(null);
    setShowForm(true);
  };

  const handleRadioExistingAddress = (detailId) => {
    setSelectedDetailId(detailId);
    setShowForm(false);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    if (selectedDetailId) {
      router.push({
        pathname: "/checkout/payment",
        query: {
          deliveryDetailId: selectedDetailId,
        },
      });
      return;
    }

    const formDataEmpty = Object.values(formData).some(
      (value) => value.length === 0,
    );
    if (formDataEmpty) {
      setStatusMessage("All fields are required");
      return;
    }

    try {
      let response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/deliverydetails`,
        { user: userId, ...formData },
      );

      const queryParams = { deliveryDetailId: response.data.data._id };
      if (guestEmail) {
        queryParams.guestEmail = guestEmail;
      }

      router.push({
        pathname: "/checkout/payment",
        query: queryParams,
      });
    } catch (error) {
      console.error("Error creating new delivery details:", error);
    }
  };

  return (
    <div className="order-delivery-details-section">
      <Head>
        <title>Checkout - Delivery Details | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Delivery Details</h2>
        {/* EXISTING DELIVERY ADDRESSES RB*/}
        {deliveryDetails.map((detail) => (
          <ExistingAddressGrid
            key={detail._id}
            detail={detail}
            selectedDetailId={selectedDetailId}
            handleRadioExistingAddress={handleRadioExistingAddress}
          />
        ))}
        {/* ADD NEW ADDRESS RB*/}
        <label
          className={`checkout-delivery-detail-item ${(showForm || deliveryDetails.length === 0) && "checked"
            }`}
        >
          <input
            type="radio"
            checked={showForm || deliveryDetails.length === 0}
            onChange={handleRadioNewAddress}
          />
          <p>Add a New Delivery Address</p>
        </label>
        {/* ADD NEW ADDRESS FORM */}
        {(showForm || deliveryDetails.length === 0) && (
          <CheckoutCreateDeliveryDetails
            statusMessage={statusMessage}
            formData={formData}
            handleChangeForm={handleChangeForm}
          />
        )}
        {/* SUBMIT */}
        <div className="checkout-btn">
          <button className="primary-button" onClick={handleProceedToPayment}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDeliveryPage;
