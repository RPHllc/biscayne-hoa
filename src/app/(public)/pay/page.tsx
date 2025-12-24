export default function PayPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Pay Dues</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-xl font-bold">Credit / Debit Card</h3>
        <p className="text-slate-600">
          Coming next: Stripe Checkout link (fast, secure, receipts).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-xl font-bold">Zelle</h3>
        <p className="text-slate-600">
          Add Zelle recipient + memo format (e.g., “7700 Biscayne Point Cir – Dues 2026”).
        </p>
      </div>
    </div>
  );
}
