import { getDocuments } from '@/lib/content/documents';

export default function DocumentsPage() {
  const documents = getDocuments();
  const grouped = documents.reduce<Record<string, typeof documents>>(
    (acc, doc) => {
      const key = doc.category ?? 'Other';
      acc[key] = acc[key] ? [...acc[key], doc] : [doc];
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Documents</h2>
        <p className="text-slate-600">
          Official HOA documents, applications, and reference materials.
        </p>
      </section>

      {categories.length === 0 ? (
        <p className="text-slate-600">No documents available.</p>
      ) : (
        categories.map((category) => (
          <section key={category} className="space-y-4">
            <h3 className="text-2xl font-bold">{category}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {grouped[category].map((doc) => (
                <div
                  key={doc.file}
                  className="bg-white border border-slate-200 rounded-xl p-5"
                >
                  <div className="text-lg font-semibold text-slate-900">
                    {doc.title}
                  </div>
                  {doc.description ? (
                    <p className="text-sm text-slate-600 mt-2">
                      {doc.description}
                    </p>
                  ) : null}
                  <a
                    href={doc.file}
                    className="mt-3 inline-flex text-sm font-semibold text-teal-700 hover:underline"
                  >
                    Download PDF
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
