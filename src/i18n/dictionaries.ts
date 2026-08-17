import type { Locale } from "./config";

export interface Dictionary {
  nav: {
    projects: string;
    experience: string;
    contact: string;
  };
  home: {
    tagline: string;
    heading: string;
  };
  pitch: {
    heading: string;
    description: string;
    mockupNav: { home: string; about: string; contact: string };
    mockupContent: { home: string; about: string; contact: string };
  };
  showcase: {
    heading: string;
    buttons: { uiux: string; database: string; payment: string };
    descriptions: { uiux: string; database: string; payment: string };
    database: { sidebarTitle: string; queryStatus: string };
    payment: { buyLabel: string; successMessage: string; resetLabel: string };
  };
  footer: {
    brand: string;
    contactTitle: string;
    contactEmail: string;
    faqTitle: string;
    faqItems: { question: string; answer: string }[];
    copyright: string;
  };
}

const en: Dictionary = {
  nav: {
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
  },
  home: {
    tagline: "Anytime",
    heading: "Got an idea? We will make it a website.",
  },
  pitch: {
    heading: "Websites built for real clients, not just demos.",
    description:
      "From first sketch to a live, working site — I handle design, build, and deployment so you get something that actually ships.",
    mockupNav: { home: "Home", about: "About", contact: "Contact" },
    mockupContent: {
      home: "Welcome to your new site.",
      about: "A little about the business.",
      contact: "Let's get in touch.",
    },
  },
  showcase: {
    heading: "You want it? We can make it.",
    buttons: { uiux: "UI/UX", database: "Database", payment: "Payment" },
    descriptions: {
      uiux: "Interfaces that feel good to use, down to the last pixel.",
      database: "Solid data foundations that scale with the business.",
      payment: "Checkout flows that are simple, fast, and trustworthy.",
    },
    database: { sidebarTitle: "Tables", queryStatus: "Success" },
    payment: {
      buyLabel: "Buy now",
      successMessage: "Purchase successful",
      resetLabel: "Try again",
    },
  },
  footer: {
    brand: "DigitalFlamingo",
    contactTitle: "Contact",
    contactEmail: "contact@digitalflamingo.red",
    faqTitle: "FAQ",
    faqItems: [
      { question: "What do you do?", answer: "I build fast, modern web, API experiences." },
      { question: "Are you available for freelance?", answer: "Yes — reach out via email." },
    ],
    copyright: "All rights reserved.",
  },
};

const fr: Dictionary = {
  nav: {
    projects: "Projets",
    experience: "Expérience",
    contact: "Contact",
  },
  home: {
    tagline: "A tout moment",
    heading: "Vous avez une idée ? Nous la concrétiserons",
  },
  pitch: {
    heading: "Des sites conçus pour de vrais clients, pas juste des démos.",
    description:
      "De la première esquisse à un site en ligne fonctionnel — je gère le design, le développement et la mise en ligne.",
    mockupNav: { home: "Accueil", about: "À propos", contact: "Contact" },
    mockupContent: {
      home: "Bienvenue sur votre nouveau site.",
      about: "Quelques mots sur l'entreprise.",
      contact: "Entrons en contact.",
    },
  },
  showcase: {
    heading: "Vous le voulez ? On peut le faire.",
    buttons: { uiux: "UI/UX", database: "Base de données", payment: "Paiement" },
    descriptions: {
      uiux: "Des interfaces agréables à utiliser, jusqu'au moindre pixel.",
      database: "Des fondations de données solides qui évoluent avec l'activité.",
      payment: "Un paiement simple, rapide et fiable.",
    },
    database: { sidebarTitle: "Tables", queryStatus: "Succès" },
    payment: {
      buyLabel: "Acheter",
      successMessage: "Achat réussi",
      resetLabel: "Réessayer",
    },
  },
  footer: {
    brand: "DigitalFlamingo",
    contactTitle: "Contact",
    contactEmail: "contact@digitalflamingo.red",
    faqTitle: "FAQ",
    faqItems: [
      { question: "Que faites-vous ?", answer: "Je crée des expériences web modernes et rapides." },
      { question: "Êtes-vous disponible en freelance ?", answer: "Oui — contactez-moi par email." },
    ],
    copyright: "Tous droits réservés.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, fr };