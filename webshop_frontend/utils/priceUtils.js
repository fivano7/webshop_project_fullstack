export const formatPercentage = (originalPrice, discountPrice) => {
  const savings = originalPrice - discountPrice;
  const discountPercentage = (savings / originalPrice) * 100;
  return Math.round(discountPercentage);
};

export const formatAmount = (originalPrice, discountPrice) => {
  return originalPrice - discountPrice;
};

export const displayPrice = (price) => {
  return price.toFixed(2);
};

