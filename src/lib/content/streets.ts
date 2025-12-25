import streetsData from '../../../content/streets.json';

export function getStreets(): string[] {
  const data = streetsData as string[];
  return data.filter(Boolean);
}
