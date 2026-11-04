import { verifyAndCreditFunding } from "@/app/actions/advertising-wallet";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference || params.trxref;

  if (!reference) {
    return (
      <div className="max-w-lg mx-auto rounded-lg border border-danger/30 bg-danger/5 p-6 text-center">
        <p className="text-lg font-bold text-danger">Payment reference missing</p>
        <p className="text-sm text-charcoal mt-2">Return to your wallet to try again.</p>
        <Link href="/vendor/advertising/wallet" className="inline-block mt-4 h-10 px-6 rounded bg-primary text-white text-sm font-bold leading-10">
          Back to Wallet
        </Link>
      </div>
    );
  }

  const result = await verifyAndCreditFunding(reference);

  if ("error" in result) {
    return (
      <div className="max-w-lg mx-auto rounded-lg border border-danger/30 bg-danger/5 p-6 text-center">
        <p className="text-lg font-bold text-danger">Payment verification failed</p>
        <p className="text-sm text-charcoal mt-2">{result.error}</p>
        <p className="text-xs text-muted mt-2 font-mono">{reference}</p>
        <Link href="/vendor/advertising/wallet" className="inline-block mt-4 h-10 px-6 rounded bg-primary text-white text-sm font-bold leading-10">
          Back to Wallet
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto rounded-lg border border-green-300 bg-green-50 p-6 text-center">
      <p className="text-2xl font-extrabold text-green-700">Payment Successful</p>
      <p className="text-sm text-charcoal mt-2">Your advertising wallet has been credited.</p>
      <p className="text-xs text-muted mt-1 font-mono">{reference}</p>
      <Link href="/vendor/advertising/wallet" className="inline-block mt-4 h-10 px-6 rounded bg-primary text-white text-sm font-bold leading-10">
        View Wallet
      </Link>
    </div>
  );
}