import PortalLoginForm from '@/components/portal/PortalLoginForm';
import { getStreets } from '@/lib/content/streets';

export default function PortalLoginPage() {
  const streets = getStreets();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Resident Portal Access</h2>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Enter your email and address. If your dues are current for this year
          (with a 3-month grace period into the next year), we’ll send you a
          secure access link.
        </p>
      </div>

      <PortalLoginForm streets={streets} />
    </div>
  );
}
