import { getVendorBankAccount } from "@/app/actions/vendor-bank";
import { BankAccountForm } from "@/components/vendor/BankAccountForm";

export const dynamic = "force-dynamic";

export default async function BankAccountPage() {
  const existing = await getVendorBankAccount();
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Bank Account</h1>
        <p className="text-sm text-muted">Add a verified bank account to receive payouts.</p>
      </div>
      <BankAccountForm existing={existing} />
    </div>
  );
}