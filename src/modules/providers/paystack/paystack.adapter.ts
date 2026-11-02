import { MarketplacePaymentProvider, InitializePaymentRequest, PaymentInitialization, VerifiedPayment } from "../payment-provider.interface";

export class PaystackProvider implements MarketplacePaymentProvider {
  private secretKey = process.env.PAYSTACK_SECRET_KEY!;
  private baseUrl = "https://api.paystack.co";

  async initializePayment(req: InitializePaymentRequest): Promise<PaymentInitialization> {
    const res = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: req.customerEmail,
        amount: Number(req.amountKobo), // Paystack accepts Kobo directly
        reference: req.reference,
        metadata: {
          customerName: req.customerName,
          description: req.description,
        },
      }),
    });
    
    const data = await res.json();
    if (!data.status) throw new Error(data.message || "Paystack Initialization Failed");

    return {
      checkoutUrl: data.data.authorization_url,
      providerReference: data.data.reference,
    };
  }

  async verifyPayment(reference: string): Promise<VerifiedPayment> {
    const res = await fetch(`${this.baseUrl}/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });
    
    const data = await res.json();
    if (!data.status) throw new Error("Verification Failed");

    const body = data.data;
    return {
      status: body.status === "success" ? "SUCCESS" : body.status === "failed" ? "FAILED" : "PENDING",
      amountKobo: BigInt(body.amount),
      currency: body.currency,
      reference: body.reference,
      providerReference: body.id.toString(),
      paidAt: new Date(body.paid_at || Date.now()),
    };
  }
}