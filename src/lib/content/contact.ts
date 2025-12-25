import fs from 'node:fs';
import path from 'node:path';

export type ContactPerson = {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
};

export type ContactContent = {
  email: string;
  address?: string;
  phoneNumbers: string[];
  contacts: ContactPerson[];
};

export function getContactContent(): ContactContent {
  const filePath = path.join(process.cwd(), 'content', 'contact.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as ContactContent;
}
