import { getGalleryContent } from '@/lib/content/gallery';

export default function GalleryPage() {
  const { collections } = getGalleryContent();
  const hasImages = collections.some((collection) => collection.items.length > 0);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Gallery</h2>
        <p className="text-slate-600">
          Highlights from community events and neighborhood gatherings.
        </p>
      </section>

      {!hasImages ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          Gallery photos will be posted here soon.
        </div>
      ) : (
        collections.map((collection) => (
          <section key={collection.title} className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{collection.title}</h3>
              {collection.description ? (
                <p className="text-sm text-slate-600 mt-1">
                  {collection.description}
                </p>
              ) : null}
            </div>

            {collection.items.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {collection.items.map((item) => (
                  <figure
                    key={item.src}
                    className="mb-4 break-inside-avoid rounded-xl overflow-hidden bg-white border border-slate-200"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                    {item.caption ? (
                      <figcaption className="px-4 py-3 text-sm text-slate-600">
                        {item.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Photos coming soon for this collection.
              </p>
            )}
          </section>
        ))
      )}
    </div>
  );
}
