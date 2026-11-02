import { MarketplacePaymentProvider, InitializePaymentRequest, PaymentInitialization, VerifiedPayment } from "../payment-provider.interface";

export class MonnifyProvider implements MarketplacePaymentProvider {
  private apiKey = process.env.MONNIFY_API_KEY!;
  private secretKey = process.env.MONNIFY_SECRET_KEY!;
  private contractCode = process.env.MONNIFY_CONTRACT_CODE!;
  private baseUrl = process.env.MONNIFY_BASE_URL || "https://sandbox.monnify.com";

  private async getToken() {
    const basicAuth = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString("base64");
    const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { Authorization: `Basic ${basicAuth}`, "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!data.requestSuccessful) throw new Error("Monnify Auth Failed");
    return data.responseBody.accessToken;
  }

  async initializePayment(req: InitializePaymentRequest): Promise<PaymentInitialization> {
    const token = await this.getToken();
    // Note: Monnify accepts amounts in Naira, not Kobo. Convert BigInt to Number.
    const amountNaira = Number(req.amountKobo) / 100;

    const res = await fetch(`${this.baseUrl}/api/v1/merchant/transactions/init-transaction`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountNaira,
        customerName: req.customerName,
        customerEmail: req.customerEmail,
        paymentReference: req.reference,
        paymentDescription: req.description,
        currencyCode: "NGN",
        contractCode: this.contractCode,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/verify?reference=${req.reference}`,
      }),
    });
    
    const data = await res.json();
    if (!data.requestSuccessful) throw new Error(data.responseMessage);

    return {
      checkoutUrl: data.responseBody.checkoutUrl,
      providerReference: data.responseBody.transactionReference,
    };
  }

  async verifyPayment(reference: string): Promise<VerifiedPayment> {
    const token = await this.getToken();
    const res = await fetch(`${this.baseUrl}/api/v2/transactions/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await res.json();
    if (!data.requestSuccessful) throw new Error("Verification Failed");

    const body = data.responseBody;
    return {
      status: body.paymentStatus === "PAID" ? "SUCCESS" : body.paymentStatus === "FAILED" ? "FAILED" : "PENDING",
      amountKobo: BigInt(body.amountPaid * 100),
      currency: body.currencyCode,
      reference: body.paymentReference,
      providerReference: body.transactionReference,
      paidAt: new Date(body.paidOn || Date.now()),
    };
  }
}