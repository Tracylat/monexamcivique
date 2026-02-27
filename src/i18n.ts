import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      language: {
        fr: 'Francais',
        en: 'Anglais',
      },
      header: {
        brandMain: 'Examen Civique',
        brandAccent: 'Etrangers',
      },
      nav: {
        parcours: 'Parcours',
        niveaux: 'Niveaux',
        faq: 'FAQ',
        start: 'Commencer - 20 EUR',
      },
      landing: {
        urgencyMain: 'Examen civique OBLIGATOIRE depuis janvier 2026',
        urgencyCost: "Echec = 225 EUR + 6 mois d'attente",
        heroTitle1: 'Reussissez votre',
        heroTitle2: 'examen civique',
        heroTitle3: 'du premier coup',
        heroSubtitle:
          '641 questions, examens blancs chronometres et mises en situation reelles. La preparation la plus complete pour obtenir votre titre de sejour.',
        statQuestions: '641 questions',
        statSuccess: '97 % de reussite',
        statReady: 'Pret en 3 semaines',
        ctaStart: 'Commencer maintenant',
        ctaPath: 'Voir le parcours',
      },
      auth: {
        badge: 'Mon Examen Civique',
        loginTitle: 'Connexion securisee',
        signupTitle: 'Creer votre compte',
        loginSubtitle: 'Retrouvez votre progression et continuez votre preparation.',
        signupSubtitle: 'Inscrivez-vous en moins de 30 secondes.',
        fullName: 'Nom complet',
        fullNamePlaceholder: 'Votre nom',
        email: 'Email',
        emailPlaceholder: 'exemple@email.com',
        password: 'Mot de passe',
        passwordPlaceholder: 'Votre mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
        submitLoading: 'Veuillez patienter...',
        submitLogin: 'Se connecter',
        submitSignup: "S'inscrire",
        switchToSignup: 'Pas encore de compte ? Creer un compte',
        switchToLogin: 'Deja un compte ? Se connecter',
        passwordMismatch: 'Les mots de passe ne correspondent pas.',
        accountCreated: 'Compte cree. Vous pouvez maintenant vous connecter.',
        genericError: 'Une erreur est survenue.',
        backendUnreachable: 'Impossible de joindre le serveur backend.',
        backendCheck: 'Impossible de joindre le serveur. Verifie que le backend tourne.',
      },
    },
  },
  en: {
    translation: {
      language: {
        fr: 'French',
        en: 'English',
      },
      header: {
        brandMain: 'Civic Exam',
        brandAccent: 'Foreigners',
      },
      nav: {
        parcours: 'Path',
        niveaux: 'Levels',
        faq: 'FAQ',
        start: 'Start - EUR 20',
      },
      landing: {
        urgencyMain: 'Civic exam MANDATORY since January 2026',
        urgencyCost: 'Fail = EUR 225 + 6 months waiting',
        heroTitle1: 'Pass your',
        heroTitle2: 'civic exam',
        heroTitle3: 'on the first try',
        heroSubtitle:
          '641 questions, timed mock exams, and real-life scenarios. The most complete prep to get your residence permit.',
        statQuestions: '641 questions',
        statSuccess: '97% success rate',
        statReady: 'Ready in 3 weeks',
        ctaStart: 'Start now',
        ctaPath: 'See the path',
      },
      auth: {
        badge: 'My Civic Exam',
        loginTitle: 'Secure login',
        signupTitle: 'Create your account',
        loginSubtitle: 'Get back to your progress and continue your preparation.',
        signupSubtitle: 'Sign up in less than 30 seconds.',
        fullName: 'Full name',
        fullNamePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'example@email.com',
        password: 'Password',
        passwordPlaceholder: 'Your password',
        confirmPassword: 'Confirm password',
        confirmPasswordPlaceholder: 'Confirm your password',
        submitLoading: 'Please wait...',
        submitLogin: 'Log in',
        submitSignup: 'Sign up',
        switchToSignup: "Don't have an account? Create one",
        switchToLogin: 'Already have an account? Log in',
        passwordMismatch: 'Passwords do not match.',
        accountCreated: 'Account created. You can now log in.',
        genericError: 'Something went wrong.',
        backendUnreachable: 'Unable to reach backend server.',
        backendCheck: 'Unable to reach server. Check that backend is running.',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
