
export class PaystackTransferAdapter {
  private secretKey = process.env.PAYSTACK_SECRET_KEY!;
  private baseUrl = "https://api.paystack.co";

  async listBanks() {
    const res = await fetch(`${this.baseUrl}/bank?currency=NGN`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
    const data = await res.json();
    if (!data.status) throw new Error("Failed to fetch banks");
    return (data.data as { code: string; name: string }[]).map((b) => ({
      code: b.code, name: b.name,
    }));
  }

  async resolveBankAccount(bankCode: string, accountNumber: string) {
    const res = await fetch(
      `${this.baseUrl}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    );
    const data = await res.json();
    if (!data.status) throw new Error(data.message || "Failed to resolve account");
    return { accountName: data.data.account_name as string, accountNumber: data.data.account_number as string };
  }

  async createRecipient(bankCode: string, accountNumber: string, accountName: string) {
    const res = await fetch(`${this.baseUrl}/transferrecipient`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "nuban", name: accountName, account_number: accountNumber,
        bank_code: bankCode, currency: "NGN",
      }),
    });
    const data = await res.json();
    if (!data.status) throw new Error(data.message || "Failed to create recipient");
    return data.data.recipient_code as string;
  }

  async initiateTransfer(recipientCode: string, amountKobo: bigint, reference: string, reason: string) {
    const res = await fetch(`${this.baseUrl}/transfer`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "balance", amount: Number(amountKobo), recipient: recipientCode,
        reason, reference,
      }),
    });
    const data = await res.json();
    if (!data.status) throw new Error(data.message || "Failed to initiate transfer");
    return { providerReference: data.data.reference as string, transferCode: data.data.transfer_code as string };
  }
}

export const paystackTransfer = new PaystackTransferAdapter();