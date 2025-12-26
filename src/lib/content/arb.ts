import arbData from '../../../content/arb.json';

export type ArbQuickCheckItem = {
  question: string;
  answer: string;
};

export type ArbUsefulLink = {
  label: string;
  href: string;
  description?: string;
};

export type ArbContent = {
  title: string;
  intro: string;
  disclaimer?: string;
  quickCheck: {
    title: string;
    items: ArbQuickCheckItem[];
  };
  usefulLinks: {
    title: string;
    items: ArbUsefulLink[];
  };
};

export function getArbContent(): ArbContent {
  return arbData as ArbContent;
}
