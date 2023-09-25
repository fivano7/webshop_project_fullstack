import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const AboutPage = () => {
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newslettersubscribers/contactadmin`,
        { email, title, message },
      );

      setStatusMessage("Email successfully sent!");
      setEmail("")
      setTitle("")
      setMessage("")
    } catch (error) {
      setStatusMessage(error.response.data.error);
    }
  };

  return (
    <div className="about-section">
      <Head>
        <title>About Us | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <div className="about-content">
          <div className="image-text-item">
            <div className="text">
              <h2>Pottery's Storied Past</h2>
              <p>
                With a history spanning millennia, pottery has been cherished
                across cultures for its enduring beauty and utility.
              </p>
              <p>
                Our online pottery shop celebrates this heritage, offering a
                curated collection that pays homage to the craft's rich legacy.
              </p>
            </div>
            <div className="image">
              <Image
                width={400}
                height={400}
                src="/assets/pottery2.jpg"
                alt="pottery"
              />
            </div>
          </div>
          <div className="image-text-item">
            <div className="image">
              <Image
                width={400}
                height={400}
                src="/assets/pottery3.jpg"
                alt="pottery"
              />
            </div>
            <div className="text">
              <h2>25 Years of Craftsmanship</h2>
              <p>
                Founded a quarter-century ago by passionate artisans, our
                pottery studio has evolved while maintaining a commitment to
                quality.
              </p>
              <p>
                We've expanded our offerings, ensuring that each piece reflects
                our dedication to excellence.
              </p>
            </div>
          </div>
          <div className="image-text-item">
            <div className="text">
              <h2>Modern Elegance</h2>
              <p>
                In every item we offer, we seamlessly blend the timeless allure
                of pottery with contemporary design.
              </p>
              <p>
                From minimalist vases to sleek dinnerware, our pottery adds
                sophistication and artistry to modern living spaces.
              </p>
            </div>
            <div className="image">
              <Image
                width={400}
                height={400}
                src="/assets/pottery4.jpg"
                alt="pottery"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSendEmail}>
          <h5>Do You Have Any Questions? Contact Us!</h5>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label>Title</label>
          </div>
          <div className="form-group">
            <textarea
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <label>Message</label>
          </div>

          <button className="primary-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default AboutPage;
