import PayDuesForm from '@/components/pay/PayDuesForm';
import { getDuesConfig } from '@/lib/content/dues';
import { getStreets } from '@/lib/content/streets';

export default function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  // Next App Router sometimes provides searchParams async; unwrap defensively
  const _ = searchParams;
  const streets = getStreets();
  const dues = getDuesConfig();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Pay HOA Dues</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-xl font-bold">Pay Online</h3>
        <p className="text-slate-600">
          Annual dues are ${dues.annualDues}. You can pay the minimum or add a
          donation above the required amount.
        </p>
        <PayDuesForm
          minPayment={dues.minPayment}
          suggestedDonation={dues.suggestedDonation}
          streets={streets}
        />
        <p className="text-xs text-slate-500">
          Pay by card with Apple Pay or Google Pay when available. Bank account
          and QR options may appear based on your device and Stripe settings.
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
