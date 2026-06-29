export function calculateDiscountedPrice(price, discount) {
  if (!discount || !discount.is_active) return price;
  
  const now = new Date();
  if (discount.start_date && new Date(discount.start_date) > now) return price;
  if (discount.end_date && new Date(discount.end_date) < now) return price;

  let finalPrice = price;
  if (discount.discount_type === 'percentage') {
    finalPrice = price - (price * (discount.discount_value / 100));
  } else if (discount.discount_type === 'fixed') {
    finalPrice = price - discount.discount_value;
  }
  
  return Math.max(0, finalPrice);
}

export function formatRs(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}
