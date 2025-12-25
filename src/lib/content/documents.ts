import fs from 'node:fs';
import path from 'node:path';

export type DocumentItem = {
  title: string;
  description?: string;
  category?: string;
  file: string;
};

export function getDocuments(): DocumentItem[] {
  const filePath = path.join(process.cwd(), 'content', 'documents.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as DocumentItem[];
}
