import duesData from '../../../content/dues.json';

export type DuesConfig = {
  annualDues: number;
  minPayment: number;
  suggestedDonation?: number;
};

export function getDuesConfig(): DuesConfig {
  return duesData as DuesConfig;
}
