export type TitleType = 'CSP' | 'Résident' | 'Naturalisation';

export type PlanInfo = {
  id: TitleType;
  icon: string;
  labelFr: string;
  labelEn: string;
  descriptionFr: string;
  descriptionEn: string;
  featuresFr: string[];
  featuresEn: string[];
  price: number;
  durationFr: string;
  durationEn: string;
  cardStyle: string;
  buttonStyle: string;
};

export const plans: PlanInfo[] = [
  {
    id: 'CSP',
    icon: '📋',
    labelFr: 'Carte de Séjour Pluriannuelle',
    labelEn: 'Multi-year Residence Permit',
    descriptionFr: 'Formation complète pour la carte de séjour pluriannuelle.',
    descriptionEn: 'Complete training for the multi-year residence permit.',
    featuresFr: ['Parcours CSP dédié', 'Quiz + examens blancs', 'Fiches de révision ciblées', 'Accès illimité'],
    featuresEn: ['Dedicated CSP path', 'Quiz + mock exams', 'Targeted revision cards', 'Unlimited access'],
    price: 20,
    durationFr: 'Durée : 2 à 4 ans',
    durationEn: 'Duration: 2 to 4 years',
    cardStyle: 'bg-white border-gray-200 hover:border-[#2d6a4f]',
    buttonStyle: 'bg-[#2d6a4f] text-white hover:bg-[#1b4332]',
  },
  {
    id: 'Résident',
    icon: '🏡',
    labelFr: 'Carte de Résident',
    labelEn: 'Resident Card',
    descriptionFr: 'Formation complète pour la carte de résident (10 ans).',
    descriptionEn: 'Complete training for the resident card (10 years).',
    featuresFr: ['Parcours Résident dédié', 'Questions plus avancées', 'Fiches interactives', 'Suivi de progression', 'Accès illimité'],
    featuresEn: ['Dedicated Resident path', 'More advanced questions', 'Interactive cards', 'Progress tracking', 'Unlimited access'],
    price: 20,
    durationFr: 'Durée : 10 ans',
    durationEn: 'Duration: 10 years',
    cardStyle: 'bg-gradient-to-br from-[#ff6b35] to-[#ff8f6b] text-white border-transparent',
    buttonStyle: 'bg-white text-[#ff6b35] hover:bg-gray-100',
  },
  {
    id: 'Naturalisation',
    icon: '🇫🇷',
    labelFr: 'Naturalisation',
    labelEn: 'Naturalization',
    descriptionFr: 'Formation complète pour devenir citoyen français.',
    descriptionEn: 'Complete training to become a French citizen.',
    featuresFr: ['Parcours Naturalisation dédié', 'Niveau expert', 'Examens blancs orientés naturalisation', 'Accès illimité'],
    featuresEn: ['Dedicated Naturalization path', 'Expert level', 'Naturalization-focused mock exams', 'Unlimited access'],
    price: 20,
    durationFr: 'Objectif : Citoyenneté française',
    durationEn: 'Goal: French citizenship',
    cardStyle: 'bg-white border-gray-200 hover:border-[#1a4d8f]',
    buttonStyle: 'bg-[#1a4d8f] text-white hover:bg-[#0f3466]',
  },
];

export const planMap: Record<TitleType, PlanInfo> = plans.reduce(
  (acc, plan) => ({ ...acc, [plan.id]: plan }),
  {} as Record<TitleType, PlanInfo>,
);

export const normalizePlan = (value: string | null): TitleType => {
  if (!value) return 'CSP';
  const plan = decodeURIComponent(value).toLowerCase();
  if (plan === 'resident' || plan === 'résident') return 'Résident';
  if (plan === 'naturalisation' || plan === 'naturalization') return 'Naturalisation';
  return 'CSP';
};

