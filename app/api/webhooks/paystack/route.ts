import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  const signature = req.headers.get('x-paystack-signature');

  // Verify that the request is genuinely from Paystack
  if (hash !== signature) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Handle the 'charge.success' event
  if (event.event === 'charge.success') {
    const { reference, amount, customer } = event.data;

    // 1. Idempotency check: Ensure you haven't processed this reference before
    // 2. Update your database: mark the order as paid, update finance ledgers, etc.
    // 3. Trigger fulfillment (e.g., create shipments, send emails).
  }

  // Always return a 200 OK to acknowledge receipt
  return NextResponse.json({ status: 'success' });
}