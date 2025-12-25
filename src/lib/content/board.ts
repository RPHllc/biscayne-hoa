import fs from 'node:fs';
import path from 'node:path';

export type BoardOfficer = {
  name: string;
  title: string;
};

export type BoardMember = {
  name: string;
  note?: string;
};

export type Committee = {
  name: string;
  description: string;
};

export type BoardContent = {
  officers: BoardOfficer[];
  membersAtLarge: BoardMember[];
  committees: Committee[];
};

export function getBoardContent(): BoardContent {
  const filePath = path.join(process.cwd(), 'content', 'board.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as BoardContent;
}
