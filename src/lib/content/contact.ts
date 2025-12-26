import contactData from '../../../content/contact.json';

export type ContactCard = {
  id: string;
  icon: 'map-pin' | 'shield' | 'mail';
  title: string;
  lines?: string[];
  note?: string;
  email?: string;
};

export type ContactContent = {
  cards: ContactCard[];
  form?: {
    title?: string;
    subtitle?: string;
    subjects?: string[];
    toEmail?: string;
  };
};

export function getContactContent(): ContactContent {
  return contactData as ContactContent;
}
