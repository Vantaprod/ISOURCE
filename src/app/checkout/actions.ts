"use server";

import { prisma } from "@/lib/prisma";
import { checkoutSchema, deliveryFeeKobo, type CheckoutFormData } from "@/lib/checkout-schema";
import type { PaymentProvider } from "@prisma/client";

interface CartLine {
  productId: string;
  variantId?: string;
  qty: number;
}

export async function placeOrder(formData: CheckoutFormData, cartItems: CartLine[]) {
  // 1. Validate form data again on the server
  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Your cart is empty" };
  }

  try {
    // 2. Fetch products from DB to verify price & stock
    const productIds = cartItems.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });

    let subtotalKobo = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      let unitKobo = product.priceKobo;
      let stock = product.stock;
      let variantLabel = undefined;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) throw new Error(`Variant not found: ${item.variantId}`);
        unitKobo = variant.priceKobo;
        stock = variant.stock;
        variantLabel = variant.label;
      }

      if (stock < item.qty) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      const lineTotalKobo = unitKobo * item.qty;
      subtotalKobo += lineTotalKobo;

      orderItemsData.push({
        productId: product.id,
        variantId: item.variantId || null,
        productName: product.name,
        variantLabel,
        sku: product.sku,
        unitKobo,
        qty: item.qty,
        lineTotalKobo,
        vendorId: product.vendorId,
        fulfillmentStatus: "PENDING" as const,
      });
    }

    const deliveryKobo = deliveryFeeKobo(parsed.data.deliveryMethod, subtotalKobo);
    const totalKobo = subtotalKobo + deliveryKobo;
    
    // Generate a short order number like IS-12345678
    const orderNumber = `IS-${Date.now().toString().slice(-8)}`;

    // Map string payment method to Prisma enum
    const paymentMethodMap: Record<string, PaymentProvider> = {
      "paystack": "PAYSTACK",
      "flutterwave": "FLUTTERWAVE",
      "bank-transfer": "BANK_TRANSFER",
      "pay-on-delivery": "PAY_ON_DELIVERY",
    };

    // 3. Create the order in a single atomic transaction
    const order = await prisma.order.create({
      data: {
        orderNumber,
        guestEmail: parsed.data.email,
        guestPhone: parsed.data.phone,
        status: "PENDING",
        paymentStatus: "PENDING",
        shippingFirstName: parsed.data.firstName,
        shippingLastName: parsed.data.lastName,
        shippingPhone: parsed.data.phone,
        shippingStreet: parsed.data.address,
        shippingCity: parsed.data.city,
        shippingState: parsed.data.state,
        shippingInstructions: parsed.data.instructions,
        deliveryMethod: parsed.data.deliveryMethod,
        paymentMethod: paymentMethodMap[parsed.data.paymentMethod] || "PAYSTACK",
        subtotalKobo,
        deliveryKobo,
        totalKobo,
        items: {
          create: orderItemsData,
        },
      },
    });

    return { success: true, orderNumber: order.orderNumber };
  } catch (error: unknown) {
    console.error("Order creation failed:", error);
    const message = error instanceof Error ? error.message : "Failed to place order. Please try again.";
    return { success: false, error: message };
  }
}