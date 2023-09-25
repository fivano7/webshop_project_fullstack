const RatingStars = ({ rating }) => {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i}>★</span>);
  }

  if (hasHalfStar) {
    stars.push(<span key={i}>X</span>);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={i}>☆</span>);
  }

  return (
    <>
      {stars.map((star, index) => (
        <span className="star" key={index}>
          {star}
        </span>
      ))}
    </>
  );
};

export default RatingStars;
