export const GST_RATES = [0, 5, 12, 18, 28];

export const withLineItemAmounts = (items = []) =>
  items.map((item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return {
      ...item,
      quantity,
      rate,
      amount: Number((quantity * rate).toFixed(2)),
    };
  });

export const calculateInvoiceTotals = (items = [], gstRate = 0) => {
  const lineItems = withLineItemAmounts(items);
  const subtotal = Number(lineItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
  const gstAmount = Number(((subtotal * Number(gstRate || 0)) / 100).toFixed(2));
  const total = Number((subtotal + gstAmount).toFixed(2));
  return { lineItems, subtotal, gstAmount, total };
};
