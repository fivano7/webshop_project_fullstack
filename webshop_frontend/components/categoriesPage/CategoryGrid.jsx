import Link from "next/link";

const CategoryGrid = ({ category }) => {
  return (
    <Link className="category-item" href={`/categories/${category.id}`}>
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${category.image}`}
        alt={category.name}
      />

      <div className="category-name">
        <h6>{category.name}</h6>
      </div>
    </Link>
  );
};

export default CategoryGrid;
