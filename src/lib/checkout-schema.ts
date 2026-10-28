import { z } from "zod";

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

export type NigerianState = typeof NIGERIAN_STATES[number];

export const PAYMENT_METHODS = ["paystack", "flutterwave", "bank-transfer", "pay-on-delivery"] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export const DELIVERY_METHODS = ["home-delivery", "pickup-station", "express"] as const;
export type DeliveryMethod = typeof DELIVERY_METHODS[number];

export const PAYMENT_LABELS: Record<PaymentMethod, { label: string; description: string }> = {
  "paystack": { label: "Paystack", description: "Card, bank, USSD, transfer — instant verification" },
  "flutterwave": { label: "Flutterwave", description: "Card, bank, USSD — instant verification" },
  "bank-transfer": { label: "Bank transfer", description: "Transfer manually — order held until receipt verified" },
  "pay-on-delivery": { label: "Pay on delivery", description: "Cash or POS on arrival — Lagos, Abuja, PH only" },
};

export const DELIVERY_LABELS: Record<DeliveryMethod, { label: string; description: string }> = {
  "home-delivery": { label: "Home delivery", description: "1–3 working days (Lagos, Abuja, PH); 3–7 days elsewhere" },
  "pickup-station": { label: "Pickup station", description: "Collect at nearest station — 1–2 days" },
  "express": { label: "Express delivery", description: "Same-day or next-day (selected cities)" },
};

export const checkoutSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().trim().regex(/^(\+234|0)(70|80|81|90|91)\d{8}$/, "Enter a valid Nigerian mobile number (e.g., 08012345678)"),
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  address: z.string().trim().min(5, "Street address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z
    .string()
    .trim()
    .min(1, "Please select a state")
    .refine((v) => (NIGERIAN_STATES as readonly string[]).includes(v), "Please select a valid Nigerian state"),
  instructions: z.string().trim().max(500, "Max 500 characters").optional().or(z.literal("")),
  deliveryMethod: z.enum(DELIVERY_METHODS),
  paymentMethod: z.enum(PAYMENT_METHODS),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function deliveryFeeKobo(method: DeliveryMethod, subtotalKobo: number): number {
  if (method === "pickup-station") return 100_000;   // ₦1,000
  if (method === "express") return 500_000;          // ₦5,000
  // home-delivery:
  return subtotalKobo >= 5_000_000 ? 0 : 250_000;    // free over ₦50,000, else ₦2,500
}

export interface OrderDraft {
  orderNumber: string;
  createdAt: string;
  form: CheckoutFormData;
  items: Array<{
    productId: string;
    variantId?: string;
    name: string;
    variantLabel?: string;
    unitKobo: number;
    qty: number;
    lineTotalKobo: number;
  }>;
  subtotalKobo: number;
  deliveryKobo: number;
  totalKobo: number;
}