import fs from 'node:fs';
import path from 'node:path';

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type GalleryCollection = {
  title: string;
  description?: string;
  items: GalleryItem[];
};

export type GalleryContent = {
  collections: GalleryCollection[];
};

export function getGalleryContent(): GalleryContent {
  const filePath = path.join(process.cwd(), 'content', 'gallery.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as GalleryContent;
}
