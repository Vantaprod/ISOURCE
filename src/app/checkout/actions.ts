"use server";
import { createCheckout } from "@/app/actions/checkout";

export async function placeOrder(
  items: { productId: string; quantity: number; unitPriceKobo: number }[],
  customerState: string,
  isPickup: boolean,
  pickupStationId: string | null
) {
  try {
    const res = await createCheckout(items, customerState, isPickup, pickupStationId);
    if (!res.ok) return { error: "Failed to create checkout" };
    return { ok: true, redirectUrl: `/checkout/confirmation/${res.orderId}` };
  } catch (err: any) {
    return { error: err.message };
  }
}