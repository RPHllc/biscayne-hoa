import ContactForm from '@/components/contact/ContactForm';
import { getContactContent } from '@/lib/content/contact';

export default function ContactPage() {
  const { email, address, phoneNumbers, contacts } = getContactContent();

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Contact</h2>
        <p className="text-slate-600">
          Reach out to the Biscayne Point HOA team with questions or feedback.
        </p>
      </section>

      <section className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900">Send a Message</h3>
          <p className="text-sm text-slate-600 mt-2">
            Messages are delivered to the HOA inbox. We will respond as soon as
            possible.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-slate-900">HOA Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div>
                Email:{' '}
                <a
                  className="text-teal-700 font-medium hover:underline"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              </div>
              {phoneNumbers.length > 0 ? (
                <div>
                  Phone:{' '}
                  <div className="mt-1 space-y-1">
                    {phoneNumbers.map((phone) => (
                      <div key={phone}>{phone}</div>
                    ))}
                  </div>
                </div>
              ) : null}
              {address ? <div>Address: {address}</div> : null}
            </div>
          </div>

          {contacts.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900">Key Contacts</h3>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                {contacts.map((person) => (
                  <div key={person.name}>
                    <div className="font-semibold text-slate-900">
                      {person.name}
                    </div>
                    {person.role ? <div>{person.role}</div> : null}
                    {person.email ? (
                      <div>
                        <a
                          className="text-teal-700 font-medium hover:underline"
                          href={`mailto:${person.email}`}
                        >
                          {person.email}
                        </a>
                      </div>
                    ) : null}
                    {person.phone ? <div>{person.phone}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
