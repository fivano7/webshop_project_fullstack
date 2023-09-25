import axios from "axios";
import { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubscribe = async (e) => {
    setStatusMessage("")
    e.preventDefault();
    try {
      if (!email) {
        setStatusMessage("Please enter your email address.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newslettersubscribers`,
        {
          email: email,
        },
      );

      setStatusMessage(response.data.data);
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error.message);
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="home-newsletter">
      <h5>Subscribe To Our Newsletter</h5>
      {statusMessage && <p className="status-message">{statusMessage}</p>}

      <form onSubmit={handleSubscribe}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Email</label>
        </div>
        <button className="primary-button">Subscribe</button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
