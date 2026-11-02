import { prisma } from "@/lib/prisma";
import { LedgerEntryDirection } from "@prisma/client";

type LedgerLine = {
  accountId: string;
  direction: LedgerEntryDirection;
  amountKobo: bigint;
};

type PostJournalInput = {
  reference: string;
  idempotencyKey: string;
  sourceType: string;
  sourceId: string;
  description: string;
  currency?: string;
  entries: LedgerLine[];
};

export async function postJournal(input: PostJournalInput) {
  // 1. Validate balanced journal
  const debits = input.entries
    .filter(e => e.direction === "DEBIT")
    .reduce((sum, e) => sum + e.amountKobo, 0n);

  const credits = input.entries
    .filter(e => e.direction === "CREDIT")
    .reduce((sum, e) => sum + e.amountKobo, 0n);

  if (debits <= 0n || debits !== credits) {
    throw new Error(`Unbalanced ledger journal: Debits=${debits}, Credits=${credits}`);
  }

  if (input.entries.some(e => e.amountKobo <= 0n)) {
    throw new Error("Invalid ledger entry amount. Must be > 0.");
  }

  // 2. Execute in a transaction with idempotency check
  return prisma.$transaction(async (tx) => {
    const existing = await tx.ledgerJournal.findUnique({
      where: { idempotencyKey: input.idempotencyKey }
    });

    if (existing) return existing;

    return tx.ledgerJournal.create({
      data: {
        reference: input.reference,
        idempotencyKey: input.idempotencyKey,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        description: input.description,
        currency: input.currency || "NGN",
        status: "POSTED",
        postedAt: new Date(),
        entries: {
          create: input.entries.map(entry => ({
            accountId: entry.accountId,
            direction: entry.direction,
            amountKobo: entry.amountKobo
          }))
        }
      }
    });
  });
}