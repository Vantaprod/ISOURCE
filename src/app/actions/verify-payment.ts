"use server";

import { generateFinanceDeliveriesForOrder } from "@/app/actions/generate-deliveries";
import { processSuccessfulPayment } from "@/lib/payments/process-payment";
import { redirect } from "next/navigation";

export async function verifyCheckoutPayment(reference: string) {
  try {
    const result = await processSuccessfulPayment(reference);
    
    if (result.success) {
      redirect(`/checkout/success?reference=${reference}`);
    } else {
      redirect(`/checkout/failed?reference=${reference}`);
    }
  } catch (error: any) {
    console.error("Verification Action Error:", error);
    redirect(`/checkout/failed?error=${encodeURIComponent(error.message)}`);
  }
}