export const runtime = 'edge';
export default async function PaySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-900">Payment received</h1>
      <p className="mt-3 text-slate-600">
        Thank you! Your payment was processed successfully.
      </p>

      {session_id ? (
        <p className="mt-6 text-sm text-slate-500">
          Confirmation ID: <span className="font-mono">{session_id}</span>
        </p>
      ) : null}
    </div>
  );
}
