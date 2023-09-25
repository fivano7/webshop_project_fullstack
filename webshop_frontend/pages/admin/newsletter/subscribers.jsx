import SearchBar from "@/components/adminPage/categoriesPage/SearchBar";
import AdminSubscriberGrid from "@/components/adminPage/newsletterPage/AdminSubscriberGrid";
import withAuthServer from "@/components/hocs/withAuthServer";
import { useAuth } from "@/store/AuthContext";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

function NewsletterSubscribersPage({ initialSubscribers }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [statusMessage, setStatusMessage] = useState("");
  const { jwtToken } = useAuth();
  const [filterValue, setFilterValue] = useState("");

  const handleDeleteSubscriber = async (subscriberId) => {
    setStatusMessage("");
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newslettersubscribers/${subscriberId}`,
        "DELETE",
      );

      setSubscribers(
        subscribers.filter((subscriber) => subscriber._id !== subscriberId),
      );
      setStatusMessage("Subscriber deleted");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleFilterChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setFilterValue(inputValue);

    if (inputValue) {
      const filteredSubscribers = initialSubscribers.filter((subscriber) =>
        subscriber.email.toLowerCase().includes(inputValue),
      );
      setSubscribers(filteredSubscribers);
    } else {
      setSubscribers(initialSubscribers);
    }
  };

  const clearFilter = () => {
    setFilterValue("");
    setSubscribers(initialSubscribers);
  };

  return (
    <div className="admin-newsletter-subscribers-section">
      <Head>
        <title>Newsletter Subscribers Management | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Newsletter Subscribers</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <div className="upper-buttons-wrapper">
          <SearchBar
            value={filterValue}
            onChange={handleFilterChange}
            text={"Clear"}
            placeholder={"Search..."}
            disabled={filterValue.length === 0}
            onClick={clearFilter}
          />
        </div>

        <div className="subscribers-list">
          {subscribers.length === 0 ? (
            <p>No subscribers available</p>
          ) : (
            subscribers.map((subscriber) => (
              <AdminSubscriberGrid
                key={subscriber._id}
                subscriber={subscriber}
                onDelete={() => handleDeleteSubscriber(subscriber._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthServer(
  async (context) => {
    const initialSubscribers = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newslettersubscribers`,
    );

    return { props: { initialSubscribers } };
  },
  ["admin"],
);

export default NewsletterSubscribersPage;
