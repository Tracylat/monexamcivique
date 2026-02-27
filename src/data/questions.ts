export const questionsByLevel = {
  CSP: [
    { q: "Quelle est la durée du mandat présidentiel ?", answers: ["4 ans", "5 ans", "6 ans", "7 ans"], correct: 1, theme: "Institutions" },
    { q: "Combien de départements en France (total) ?", answers: ["96", "101", "105", "110"], correct: 1, theme: "Géographie" },
    { q: "Année création Sécurité Sociale ?", answers: ["1919", "1936", "1945", "1958"], correct: 2, theme: "Histoire" },
    { q: "Qui vote aux élections municipales ?", answers: ["Tous résidents", "Français + Européens", "Français seuls", "Tous majeurs"], correct: 1, theme: "Droits" },
    { q: "Devise de la République française ?", answers: ["Unité, Indivisibilité, Laïcité", "Liberté, Égalité, Fraternité", "Justice, Paix, Liberté", "Force, Honneur, Patrie"], correct: 1, theme: "Valeurs" },
    { q: "Fleuve le plus long de France ?", answers: ["Seine", "Rhône", "Loire", "Garonne"], correct: 2, theme: "Géographie" },
    { q: "Femmes : droit de vote en ?", answers: ["1936", "1944", "1946", "1958"], correct: 1, theme: "Histoire" },
    { q: "Régions en France métropolitaine ?", answers: ["12", "13", "18", "22"], correct: 1, theme: "Géographie" },
    { q: "Qu'est-ce que la laïcité ?", answers: ["Religion obligatoire", "Séparation État-religion", "Interdiction religions", "Religion d'État"], correct: 1, theme: "Valeurs" },
    { q: "Loi séparation Église-État ?", answers: ["1789", "1881", "1905", "1946"], correct: 2, theme: "Histoire" }
  ],
  Résident: [
    { q: "Qui a instauré le Code Civil ?", answers: ["Louis XIV", "Napoléon", "De Gaulle", "Mitterrand"], correct: 1, theme: "Histoire" },
    { q: "Ville française océan Indien ?", answers: ["Cayenne", "Saint-Denis", "Pointe-à-Pitre", "Nouméa"], correct: 1, theme: "Géographie" },
    { q: "Qui a instauré Ve République ?", answers: ["Pompidou", "Mitterrand", "De Gaulle", "Giscard"], correct: 2, theme: "Institutions" },
    { q: "Traité Maastricht (UE) ?", answers: ["1986", "1992", "1999", "2002"], correct: 1, theme: "Histoire" },
    { q: "Rôle Conseil constitutionnel ?", answers: ["Voter lois", "Contrôler constitutionnalité", "Élire président", "Juger crimes"], correct: 1, theme: "Institutions" },
    { q: "Appel 18 juin 1940 ?", answers: ["Pétain", "De Gaulle", "Moulin", "Pompidou"], correct: 1, theme: "Histoire" },
    { q: "Symbole de la République ?", answers: ["Marianne", "Jeanne d'Arc", "Napoléon", "Louis XIV"], correct: 0, theme: "Valeurs" },
    { q: "Hymne national ?", answers: ["Chant des Partisans", "La Marseillaise", "L'Internationale", "Ode à la Joie"], correct: 1, theme: "Valeurs" },
    { q: "Capitale européenne (Parlement) ?", answers: ["Bruxelles", "Strasbourg", "Luxembourg", "Francfort"], correct: 1, theme: "Institutions" },
    { q: "Droit du sol ?", answers: ["Automatique", "Sous conditions", "Inexistant", "Payant"], correct: 1, theme: "Droits" }
  ],
  Naturalisation: [
    { q: "Qui a écrit les Misérables ?", answers: ["Zola", "Hugo", "Balzac", "Dumas"], correct: 1, theme: "Culture" },
    { q: "Guerre d'Algérie (fin) ?", answers: ["1958", "1962", "1968", "1974"], correct: 1, theme: "Histoire" },
    { q: "Président actuel Sénat ?", answers: ["Larcher", "Braun-Pivet", "Borne", "Attal"], correct: 0, theme: "Institutions" },
    { q: "Sommet de l'Europe (montagne) ?", answers: ["Mont Blanc", "Pic du Midi", "Barre des Écrins", "Vignemale"], correct: 0, theme: "Géographie" },
    { q: "Peintre impressionniste ?", answers: ["Picasso", "Monet", "Dali", "Warhol"], correct: 1, theme: "Culture" },
    { q: "Abolition peine de mort ?", answers: ["1974", "1981", "1988", "1995"], correct: 1, theme: "Histoire" },
    { q: "Ministre de la Justice (titre) ?", answers: ["Garde des Sceaux", "Premier Ministre", "Procureur", "Juge"], correct: 0, theme: "Institutions" },
    { q: "Fleuve passant à Bordeaux ?", answers: ["Loire", "Garonne", "Rhône", "Seine"], correct: 1, theme: "Géographie" },
    { q: "Devise de l'UE ?", answers: ["Unie dans la diversité", "Force et Honneur", "Liberté et Paix", "Union fait la force"], correct: 0, theme: "Institutions" },
    { q: "Droit de grève (année) ?", answers: ["1864", "1905", "1936", "1946"], correct: 0, theme: "Histoire" }
  ]
};

export const sampleCards = [
  { theme: "Valeurs", question: "Quelle est la devise de la République française ?", answer: "Liberté, Égalité, Fraternité", explanation: "Cette devise est inscrite dans la Constitution de 1958." },
  { theme: "Valeurs", question: "Qu'est-ce que la laïcité ?", answer: "La séparation de l'État et de la religion", explanation: "Principe inscrit dans la loi de 1905." },
  { theme: "Institutions", question: "Quelle est la durée du mandat présidentiel ?", answer: "5 ans (quinquennat)", explanation: "Depuis la réforme de 2000." },
  { theme: "Histoire", question: "En quelle année a eu lieu la Révolution française ?", answer: "1789", explanation: "Début le 14 juillet 1789 avec la prise de la Bastille." },
  { theme: "Géographie", question: "Combien de régions en France métropolitaine ?", answer: "13 régions", explanation: "Depuis la réforme de 2016." },
  { theme: "Histoire", question: "Année création Sécurité Sociale ?", answer: "1945", explanation: "Créée après la Seconde Guerre mondiale." },
  { theme: "Institutions", question: "Renouvellement mandat présidentiel ?", answer: "Une seule fois consécutivement", explanation: "Maximum deux mandats de 5 ans." },
  { theme: "Géographie", question: "Fleuve le plus long ?", answer: "La Loire (1 012 km)", explanation: "Prend sa source en Ardèche." },
  { theme: "Droits", question: "Âge du droit de vote ?", answer: "18 ans", explanation: "Pour tous les citoyens français." },
  { theme: "Valeurs", question: "Loi séparation Église-État ?", answer: "1905", explanation: "Loi du 9 décembre 1905." }
];

export const encouragementMessages = [
  { trigger: 'cards-10', text: "Excellent début !", subtext: "Vous avez maîtrisé 10 cartes. Continuez comme ça !" },
  { trigger: 'cards-25', text: "Vous progressez vite !", subtext: "25 cartes maîtrisées. Vous êtes sur la bonne voie !" },
  { trigger: 'cards-50', text: "Bravo, vous débloquez les examens blancs !", subtext: "50 cartes maîtrisées. Vous êtes prêt pour les examens !" },
  { trigger: 'cards-75', text: "Presque au sommet !", subtext: "75 cartes maîtrisées. Plus que 25 et vous aurez tout vu !" },
  { trigger: 'cards-100', text: "Félicitations champion !", subtext: "100 cartes maîtrisées ! Vous êtes vraiment bien préparé !" },
  { trigger: 'exam-1', text: "Premier examen réussi !", subtext: "Les statistiques sont débloquées. Encore 2 pour le certificat !" },
  { trigger: 'exam-2', text: "Incroyable progression !", subtext: "2 examens réussis ! Plus qu'un pour débloquer le certificat !" },
  { trigger: 'exam-3', text: "🏆 VOUS ÊTES PRÊT !", subtext: "3 examens réussis ! Téléchargez votre certificat maintenant !" }
];
