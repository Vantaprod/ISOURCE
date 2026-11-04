const PAYSTACK_BASE = "https://api.paystack.co";

function getSecretKey(): string {
  const k = process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET;
  if (!k) throw new Error("PAYSTACK_SECRET_KEY not set in .env");
  return k;
}

export type InitResult = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export async function paystackInit(args: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<InitResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: args.email,
      amount: args.amountKobo,
      reference: args.reference,
      callback_url: args.callbackUrl,
      metadata: args.metadata,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(`Paystack init failed: ${json.message || res.statusText}`);
  }
  return json.data as InitResult;
}

export type VerifyResult = {
  status: "success" | "failed" | "abandoned" | "ongoing";
  reference: string;
  amount: number;
  metadata: Record<string, unknown> | null;
};

export async function paystackVerify(reference: string): Promise<VerifyResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(`Paystack verify failed: ${json.message || res.statusText}`);
  }
  return {
    status: json.data.status,
    reference: json.data.reference,
    amount: json.data.amount,
    metadata: json.data.metadata || null,
  };
}