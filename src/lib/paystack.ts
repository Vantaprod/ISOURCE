export async function initializePaystackTransaction(email: string, amountKobo: number, orderNumber: string, callbackUrl: string) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email, amount: amountKobo, reference: orderNumber, callback_url: callbackUrl,
    }),
  });
  const data = await response.json();
  if (!data.status) throw new Error(data.message || "Failed to initialize payment");
  return data.data.authorization_url as string;
}