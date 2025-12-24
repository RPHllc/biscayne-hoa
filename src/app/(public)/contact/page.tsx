export default function ContactPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Contact</h2>
      <p className="text-slate-600">For now: mailto link. Later: form + Turnstile + email.</p>
      <a className="text-teal-700 font-medium hover:underline" href="mailto:info@biscaynepointer.org">
        info@biscaynepointer.org
      </a>
    </div>
  );
}
