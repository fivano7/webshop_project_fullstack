import CategoryGrid from "@/components/categoriesPage/CategoryGrid";
import axios from "axios";
import Head from "next/head";

const AllCategoriesPage = ({ categories }) => {
  return (
    <div className="categories-section">
      <Head>
        <title>Categories | Smith Pottery</title>
      </Head>
      <div className="section-container">
        <h2>Categories</h2>
        {categories.map((category) => (
          <CategoryGrid key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`,
    );
    const categories = response.data.data;

    return {
      props: {
        categories,
      },
      revalidate: 5,
    };
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return {
      props: {
        categories: [],
      },
    };
  }
}

export default AllCategoriesPage;
