import AdminFaqGrid from "@/components/adminPage/faqsPage/AdminFaqGrid";
import CreateFaqForm from "@/components/adminPage/faqsPage/CreateFaqForm";
import withAuthServer from "@/components/hocs/withAuthServer";
import { useAuth } from "@/store/AuthContext";
import {
  sendAuthorizedClientRequest,
  sendAuthorizedServerRequest,
} from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

function AdminFaqsPage({ initialFaqs }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const { jwtToken } = useAuth();

  const handleCreateFaq = async (question, answer) => {
    setStatusMessage("");
    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("answer", answer);
      const response = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/faqs`,
        "POST",
        formData,
      );

      setFaqs([...faqs, response]);
      setShowCreateForm(false);
      setStatusMessage("FAQ created");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleUpdateFaq = async (updatedFaq) => {
    setStatusMessage("");
    try {
      const response = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/faqs/${updatedFaq._id}`,
        "PUT",
        updatedFaq,
      );

      const updatedIndex = faqs.findIndex((faq) => faq._id === response._id);
      const updatedFaqs = [...faqs];
      updatedFaqs[updatedIndex] = response;

      setFaqs(updatedFaqs);
      setStatusMessage("FAQ updated");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  const handleDeleteFaq = async (faqId) => {
    setStatusMessage("");

    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/faqs/${faqId}`,
        "DELETE",
      );

      setFaqs(faqs.filter((faq) => faq._id !== faqId));
      setStatusMessage("FAQ deleted");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="admin-faqs-section">
      <Head>
        <title>FAQs Management | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Frequently Asked Questions</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <div className="upper-buttons-wrapper">
          <button
            className="primary-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Hide form" : "Create New FAQ"}
          </button>
        </div>

        {showCreateForm && <CreateFaqForm onCreate={handleCreateFaq} />}

        {faqs.length === 0 ? (
          <p>You don't have any FAQs yet</p>
        ) : (
          faqs.map((faq) => (
            <AdminFaqGrid
              key={faq._id}
              faq={faq}
              onDelete={() => handleDeleteFaq(faq._id)}
              onUpdate={handleUpdateFaq}
            />
          ))
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthServer(
  async (context) => {
    const initialFaqs = await sendAuthorizedServerRequest(
      context,
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/faqs`,
    );
    return { props: { initialFaqs } };
  },
  ["admin"],
);

export default AdminFaqsPage;
