export interface Question {
  q: string;
  opts: string[];
  ok: number;
  expl: string;
}

export interface QuizData {
  [level: string]: {
    [category: string]: Question[];
  };
}

export const quizData: QuizData = {
  "CSP": {
    "Principes et valeurs de la République": [
      {q:"Quelle est la devise de la République ?",opts:["Liberté, Égalité, Fraternité","Travail, Famille, Patrie","Honneur et Patrie","Unité, Indivisibilité, Solidarité"],ok:0,expl:"<strong>Liberté, Égalité, Fraternité</strong> (article 2 de la Constitution)."},
      {q:"Que signifie la laïcité ?",opts:["L'interdiction des religions","La séparation des Églises et de l'État","L'obligation d'être athée","Une religion d'État"],ok:1,expl:"La laïcité garantit la <strong>liberté de conscience</strong> et la <strong>séparation des Églises et de l'État</strong> (loi de 1905)."},
      {q:"Quelles sont les couleurs du drapeau français ?",opts:["Bleu, Blanc, Rouge","Vert, Blanc, Rouge","Bleu, Jaune, Rouge","Rouge, Blanc, Bleu"],ok:0,expl:"<strong>Bleu, Blanc, Rouge</strong> (article 2 de la Constitution)."},
      {q:"Qui est Marianne ?",opts:["Une actrice célèbre","Le symbole de la République","La femme du Président","Une sainte"],ok:1,expl:"<strong>Marianne</strong> est une figure allégorique de la République française."},
      {q:"Le droit de vote est accordé aux femmes depuis :",opts:["1789","1848","1944","1981"],ok:2,expl:"Depuis l'ordonnance du <strong>21 avril 1944</strong> (Gouvernement provisoire à Alger)."},
      {q:"La France est une République :",opts:["Indivisible, laïque, démocratique et sociale","Monarchique et catholique","Fédérale et libérale","Communiste"],ok:0,expl:"La France est une République <strong>indivisible, laïque, démocratique et sociale</strong> (article 1er de la Constitution)."},
      {q:"L'hymne national est :",opts:["Le Chant des Partisans","La Marseillaise","L'Ode à la Joie","Douce France"],ok:1,expl:"<strong>La Marseillaise</strong>, écrite par Rouget de Lisle en 1792."},
      {q:"La fête nationale a lieu le :",opts:["8 mai","11 novembre","14 juillet","25 décembre"],ok:2,expl:"Le <strong>14 juillet</strong> (commémoration de la prise de la Bastille en 1789 et de la Fête de la Fédération en 1790)."},
      {q:"En France, on a le droit de croire ou de ne pas croire. C'est :",opts:["La liberté d'expression","La liberté de conscience","L'égalité","La fraternité"],ok:1,expl:"La <strong>liberté de conscience</strong>, garantie par la laïcité."},
      {q:"Les hommes et les femmes ont les mêmes droits. C'est :",opts:["L'égalité","La fraternité","La liberté","La solidarité"],ok:0,expl:"L'<strong>égalité</strong> entre les femmes et les hommes est un principe constitutionnel."}
    ],
    "Histoire, géographie et culture": [
      {q:"Quel fleuve traverse Paris ?",opts:["La Loire","Le Rhône","La Seine","La Garonne"],ok:2,expl:"<strong>La Seine</strong> traverse Paris."},
      {q:"Quelle est la capitale de la France ?",opts:["Lyon","Marseille","Paris","Bordeaux"],ok:2,expl:"<strong>Paris</strong> est la capitale de la France."},
      {q:"Qui était Louis XIV ?",opts:["Le Roi-Soleil","L'Empereur","Le premier Président","Un écrivain"],ok:0,expl:"Louis XIV, dit le <strong>Roi-Soleil</strong>, a régné de 1643 à 1715 (monarchie absolue)."},
      {q:"En quelle année a eu lieu la Révolution française ?",opts:["1789","1830","1848","1870"],ok:0,expl:"La Révolution française a débuté en <strong>1789</strong> (prise de la Bastille le 14 juillet)."},
      {q:"Qui a construit la Tour Eiffel ?",opts:["Gustave Eiffel","Napoléon","Louis XIV","Le Corbusier"],ok:0,expl:"<strong>Gustave Eiffel</strong> pour l'Exposition universelle de 1889."},
      {q:"Quelle guerre a eu lieu de 1914 à 1918 ?",opts:["La Guerre de Cent Ans","La Première Guerre mondiale","La Seconde Guerre mondiale","La Guerre d'Algérie"],ok:1,expl:"La <strong>Première Guerre mondiale</strong> (Grande Guerre)."},
      {q:"Quelle guerre a eu lieu de 1939 à 1945 ?",opts:["La Première Guerre mondiale","La Seconde Guerre mondiale","La Guerre froide","La Guerre du Golfe"],ok:1,expl:"La <strong>Seconde Guerre mondiale</strong>."},
      {q:"Qui était Charles de Gaulle ?",opts:["Un roi","Un empereur","Le chef de la France Libre et fondateur de la Ve République","Un peintre"],ok:2,expl:"Le général <strong>de Gaulle</strong> a lancé l'appel du 18 juin 1940 et fondé la Ve République en 1958."},
      {q:"Le Mont Saint-Michel se trouve en :",opts:["Bretagne","Normandie","Provence","Alsace"],ok:1,expl:"En <strong>Normandie</strong> (département de la Manche)."},
      {q:"Quel pays est frontalier de la France ?",opts:["Le Portugal","L'Allemagne","La Grèce","La Pologne"],ok:1,expl:"L'<strong>Allemagne</strong> partage une frontière avec la France."}
    ]
  },
  "CR": {
    "Principes et valeurs de la République": [
      {q:"La liberté consiste à :",opts:["Faire tout ce qui ne nuit pas à autrui","Faire tout ce qu'on veut","Ne rien faire","Obéir aveuglément"],ok:0,expl:"« La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui » (article 4 DDHC)."},
      {q:"L'école est obligatoire de :",opts:["3 à 16 ans","6 à 16 ans","3 à 18 ans","6 à 14 ans"],ok:0,expl:"L'instruction est obligatoire de <strong>3 à 16 ans</strong> (depuis la loi de 2019)."},
      {q:"Le suffrage universel signifie que :",opts:["Seuls les hommes votent","Seuls les riches votent","Tous les citoyens majeurs peuvent voter","Seuls les diplômés votent"],ok:2,expl:"Tous les citoyens français majeurs (18 ans) jouissant de leurs droits civils et politiques peuvent voter."},
      {q:"La Constitution actuelle date de :",opts:["1789","1946","1958","2000"],ok:2,expl:"La Constitution de la <strong>Ve République</strong> a été adoptée le 4 octobre 1958."},
      {q:"Qui garantit l'indépendance de la justice ?",opts:["Le Président de la République","Le Premier ministre","Le Parlement","Le Conseil constitutionnel"],ok:0,expl:"Le <strong>Président de la République</strong> est garant de l'indépendance de l'autorité judiciaire (article 64 Constitution)."}
    ],
    "Histoire, géographie et culture": [
      {q:"Qui a peint 'La Liberté guidant le peuple' ?",opts:["Monet","Eugène Delacroix","Cézanne","Renoir"],ok:1,expl:"<strong>Eugène Delacroix</strong> (1830)."},
      {q:"Quand Paris a-t-elle été libérée ?",opts:["6 juin 1944","25 août 1944","8 mai 1945","18 juin 1940"],ok:1,expl:"Le <strong>25 août 1944</strong>."},
      {q:"Quel est le 101e département depuis 2011 ?",opts:["La Guyane","La Réunion","Mayotte","La Martinique"],ok:2,expl:"<strong>Mayotte</strong>."},
      {q:"À quelle occasion la tour Eiffel a-t-elle été construite ?",opts:["Les Jeux Olympiques 1900","L'Exposition universelle de 1889","La Révolution","Le bicentenaire de 1989"],ok:1,expl:"L'<strong>Exposition universelle de 1889</strong>, centenaire de la Révolution."},
      {q:"Quel monument historique est sur une île en Normandie ?",opts:["Le château de Versailles","Le Mont-Saint-Michel","La tour Eiffel","Notre-Dame"],ok:1,expl:"Le <strong>Mont-Saint-Michel</strong>, patrimoine mondial UNESCO."}
    ]
  },
  "NAT": {
    "Principes et valeurs de la République": [
      {q:"Complétez : \"Allons enfants de la patrie...\"",opts:["le jour de fête est arrivé","le jour de gloire est arrivé","le jour de paix est arrivé","le jour de guerre est arrivé"],ok:1,expl:"« <strong>Le jour de gloire est arrivé</strong> » (1er vers de la Marseillaise)."},
      {q:"Lors d'un entretien d'embauche, que peut-on demander au candidat ?",opts:["Sa religion","Ses compétences professionnelles","S'il prévoit d'avoir des enfants","Son orientation sexuelle"],ok:1,expl:"Seules les <strong>compétences professionnelles</strong> peuvent être évaluées. Les questions sur la vie privée, la religion ou la grossesse sont interdites."},
      {q:"Déclarer ses revenus aux services fiscaux est :",opts:["Facultatif","Obligatoire pour toute personne résidant en France","Réservé aux riches","Réservé aux Français"],ok:1,expl:"<strong>Obligatoire</strong>. Chaque année, toute personne résidant en France doit déclarer ses revenus."},
      {q:"Les impôts permettent de financer les dépenses publiques. Quelle proposition est correcte ?",opts:["Seuls les Français paient","Toute personne résidant en France peut être soumise à l'impôt","Les impôts sont facultatifs","Les étrangers sont exonérés"],ok:1,expl:"<strong>Toute personne résidant en France</strong> peut être soumise à l'impôt."},
      {q:"La liberté d'association est :",opts:["Interdite","Un droit garanti par la loi de 1901","Réservée aux Français","Soumise à autorisation du préfet"],ok:1,expl:"<strong>Un droit garanti par la loi de 1901</strong>. Chacun peut créer ou rejoindre une association."}
    ],
    "Histoire, géographie et culture": [
      {q:"Qui a prononcé l'appel du 18 juin 1940 ?",opts:["Pétain","De Gaulle","Mitterrand","Chirac"],ok:1,expl:"Le <strong>général de Gaulle</strong>, depuis Londres."},
      {q:"Quel régime politique fut instauré en 1792 ?",opts:["L'Empire","La monarchie","La Ire République","La dictature"],ok:2,expl:"La <strong>Ire République</strong> (22 septembre 1792)."},
      {q:"Qui était une figure de la Résistance ?",opts:["Pétain","Jean Moulin","Louis XVI","Napoléon"],ok:1,expl:"<strong>Jean Moulin</strong>."},
      {q:"En 1944, qu'a changé pour les femmes ?",opts:["Rien","Droit de vote","Droit de travailler","Droit de divorcer"],ok:1,expl:"Le <strong>droit de vote</strong> (ordonnance 21 avril 1944)."},
      {q:"Quelle organisation créée en 1945 ?",opts:["L'UE","L'ONU","L'OTAN","La Croix-Rouge"],ok:1,expl:"L'<strong>ONU</strong>."}
    ]
  }
};
