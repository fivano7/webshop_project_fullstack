import FaqGrid from "@/components/faqsPage/FaqGrid";
import axios from "axios";
import Head from "next/head";

const FaqPage = ({ faqs }) => {
  return (
    <div className="faq-section">
      <Head>
        <title>FAQs | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq) => (
          <FaqGrid key={faq._id} faq={faq} />
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/faqs`,
    );
    const faqs = response.data.data;

    return {
      props: {
        faqs,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Error fetching FAQs:", error.message);
    return {
      props: {
        faqs: [],
      },
    };
  }
}

export default FaqPage;
