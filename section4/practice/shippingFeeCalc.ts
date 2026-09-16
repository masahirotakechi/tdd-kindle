export const shippingFeeCalc = (price: number): number | string => {
  if (price <= 0) {
    throw new Error('価格は0より大きい必要があります');
  }
  return price >= 1000 ? 0 : 500;
};
