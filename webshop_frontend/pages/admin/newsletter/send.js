import { useAuth } from "@/store/AuthContext";
import { sendAuthorizedClientRequest } from "@/utils/requestUtils";
import Head from "next/head";
import { useState } from "react";

function SendNewsletterPage() {
  const { jwtToken } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newslettersubscribers/sendemail`,
        "POST",
        { subject, message },
      );

      setStatusMessage("Emails sent successfully.");
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="admin-newsletter-send-section">
      <Head>
        <title>Send Newsletter | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Send Newsletter</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <form onSubmit={handleSendEmail} className="new-faq-form">
          <div className="form-group">
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <label>Subject</label>
          </div>

          <div className="form-group">
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <label>Message (plain text or HTML)</label>
          </div>

          <button className="primary-button" type="submit">
            Send Newsletter
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendNewsletterPage;
