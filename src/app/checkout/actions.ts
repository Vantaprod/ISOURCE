"use server";

import { prisma } from "@/lib/prisma";
import { checkoutSchema, deliveryFeeKobo, type CheckoutFormData } from "@/lib/checkout-schema";
import { getSession } from "@/lib/session";
import { headers } from "next/headers";
import { sendOrderConfirmation } from "@/lib/email";
import { initializePaystackTransaction } from "@/lib/paystack";
import type { PaymentProvider } from "@prisma/client";

interface CartLine { productId: string; variantId?: string; qty: number; }

export async function placeOrder(formData: CheckoutFormData, cartItems: CartLine[]) {
  const session = await getSession();
  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) return { success: false, error: "Invalid form data" };
  if (!cartItems || cartItems.length === 0) return { success: false, error: "Your cart is empty" };

  try {
    const productIds = cartItems.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } }, include: { variants: true } });

    let subtotalKobo = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product not found`);
      let unitKobo = product.priceKobo; let stock = product.stock; let variantLabel = undefined;
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) throw new Error(`Variant not found`);
        unitKobo = variant.priceKobo; stock = variant.stock; variantLabel = variant.label;
      }
      if (stock < item.qty) throw new Error(`Not enough stock for ${product.name}`);
      
      const lineTotalKobo = unitKobo * item.qty;
      subtotalKobo += lineTotalKobo;
      orderItemsData.push({ productId: product.id, variantId: item.variantId || null, productName: product.name, variantLabel, sku: product.sku, unitKobo, qty: item.qty, lineTotalKobo, vendorId: product.vendorId, fulfillmentStatus: "PENDING" as const });
    }

    const deliveryKobo = deliveryFeeKobo(parsed.data.deliveryMethod, subtotalKobo);
    const totalKobo = subtotalKobo + deliveryKobo;
    const orderNumber = `IS-${Date.now().toString().slice(-8)}`;
    const paymentMethodMap: Record<string, PaymentProvider> = { "paystack": "PAYSTACK", "flutterwave": "FLUTTERWAVE", "bank-transfer": "BANK_TRANSFER", "pay-on-delivery": "PAY_ON_DELIVERY" };

    const order = await prisma.order.create({
      data: {
        orderNumber, userId: session?.userId || null,
        guestEmail: session ? null : parsed.data.email, guestPhone: session ? null : parsed.data.phone,
        status: "PENDING", paymentStatus: "PENDING",
        shippingFirstName: parsed.data.firstName, shippingLastName: parsed.data.lastName,
        shippingPhone: parsed.data.phone, shippingStreet: parsed.data.address,
        shippingCity: parsed.data.city, shippingState: parsed.data.state,
        shippingInstructions: parsed.data.instructions,
        deliveryMethod: parsed.data.deliveryMethod, paymentMethod: paymentMethodMap[parsed.data.paymentMethod] || "PAYSTACK",
        subtotalKobo, deliveryKobo, totalKobo,
        items: { create: orderItemsData },
      },
    });

    // Send Email
    const customerEmail = parsed.data.email || session?.email;
    if (customerEmail) await sendOrderConfirmation(customerEmail, order.orderNumber, order.totalKobo);

    // Paystack Integration
    if (parsed.data.paymentMethod === "paystack" && process.env.PAYSTACK_SECRET_KEY) {
      const host = (await headers()).get("host");
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const callbackUrl = `${protocol}://${host}/api/paystack/callback`;
      
      const authorizationUrl = await initializePaystackTransaction(customerEmail || parsed.data.email, totalKobo, order.orderNumber, callbackUrl);
      return { success: true, orderNumber: order.orderNumber, redirectUrl: authorizationUrl };
    }

    return { success: true, orderNumber: order.orderNumber };
  } catch (error: unknown) {
    console.error("Order creation failed:", error);
    const message = error instanceof Error ? error.message : "Failed to place order.";
    return { success: false, error: message };
  }
}