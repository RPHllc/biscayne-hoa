import PayCheckoutButton from '@/components/pay/PayCheckoutButton';

export default function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  // Next App Router sometimes provides searchParams async; unwrap defensively
  const _ = searchParams;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Pay HOA Dues</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-xl font-bold">Credit / Debit Card</h3>
        <p className="text-slate-600">
          Secure online payment processed by Stripe.
        </p>
        <PayCheckoutButton />
        <p className="text-xs text-slate-500">
          You will be redirected to Stripe to complete payment.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-xl font-bold">Zelle (Optional)</h3>
        <p className="text-slate-600">
          If you prefer Zelle, send payment to the HOA’s Zelle address and
          include your home address in the memo.
        </p>
      </div>
    </div>
  );
}
