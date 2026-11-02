export interface InitializePaymentRequest {
  amountKobo: bigint;
  customerName: string;
  customerEmail: string;
  reference: string;
  description: string;
}

export interface PaymentInitialization {
  checkoutUrl: string;
  providerReference: string;
}

export interface VerifiedPayment {
  status: "SUCCESS" | "FAILED" | "PENDING";
  amountKobo: bigint;
  currency: string;
  reference: string;
  providerReference: string;
  paidAt: Date;
}

export interface MarketplacePaymentProvider {
  initializePayment(req: InitializePaymentRequest): Promise<PaymentInitialization>;
  verifyPayment(reference: string): Promise<VerifiedPayment>;
}