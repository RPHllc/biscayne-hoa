import duesData from '../../../content/dues.json';

export type DuesConfig = {
  annualDues: number;
  minPayment: number;
  suggestedDonation: number;
};

export function getDuesConfig(): DuesConfig {
  const raw = duesData as Partial<DuesConfig>;

  const annualDues = Number(raw.annualDues ?? 350);

  return {
    annualDues,
    minPayment: Number(raw.minPayment ?? annualDues),
    suggestedDonation: Number(raw.suggestedDonation ?? 0),
  };
}
