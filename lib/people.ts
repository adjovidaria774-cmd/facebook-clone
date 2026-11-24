// Les personnes proposées en suggestions d'amis (personnages d'exemple).
// Leurs stories et leurs publications n'apparaissent qu'une fois la personne ajoutée en ami.
import type { Post } from "@/components/PostCard";

export type Person = {
  id: string;
  name: string;
  subtitle: string;
  icon: "music" | "trophy" | "utensils" | "clapperboard" | "camera" | "gamepad";
  from: string; // couleurs de sa story
  to: string;
  posts: Post[];
};

export const PEOPLE: Person[] = [
  {
    id: "amina",
    name: "Amina Kossou",
    subtitle: "Aime la musique",
    icon: "music",
    from: "#7C3AED",
    to: "#DB2777",
    posts: [
      {
        id: 101,
        author: "Amina Kossou",
        time: "Il y a 2 h",
        text: "Quelle ambiance hier soir au concert à Cotonou ! La musique, la danse, tout le monde chantait. Soirée inoubliable.",
        likes: 24,
        liked: false,
        comments: [{ id: 1, author: "Koffi Mensah", text: "J’étais là aussi, c’était magnifique !" }],
      },
    ],
  },
  {
    id: "koffi",
    name: "Koffi Mensah",
    subtitle: "Fan de football",
    icon: "trophy",
    from: "#047857",
    to: "#0EA5E9",
    posts: [
      {
        id: 201,
        author: "Koffi Mensah",
        time: "Il y a 4 h",
        text: "Quel match ce soir ! Tout le quartier devant l’écran, on a crié jusqu’à la dernière minute.",
        likes: 18,
        liked: false,
        comments: [{ id: 1, author: "Yves Agbodjan", text: "Le meilleur match de la saison !" }],
      },
    ],
  },
  {
    id: "senami",
    name: "Sènami Dossou",
    subtitle: "Passionnée de cuisine",
    icon: "utensils",
    from: "#EA580C",
    to: "#DC2626",
    posts: [
      {
        id: 301,
        author: "Sènami Dossou",
        time: "Hier",
        text: "Dimanche détente avec les amis : maïs grillé, poisson braisé et bonne musique.",
        likes: 31,
        liked: false,
        comments: [],
      },
    ],
  },
  {
    id: "yves",
    name: "Yves Agbodjan",
    subtitle: "Accro aux séries",
    icon: "clapperboard",
    from: "#1D4ED8",
    to: "#7C3AED",
    posts: [
      {
        id: 401,
        author: "Yves Agbodjan",
        time: "Hier",
        text: "Quelle série regardez-vous en ce moment ? Je cherche quelque chose de bien pour ce soir.",
        likes: 9,
        liked: false,
        comments: [{ id: 1, author: "Grâce Tchibozo", text: "Regarde un bon film nigérian, ça change !" }],
      },
    ],
  },
  {
    id: "grace",
    name: "Grâce Tchibozo",
    subtitle: "Photographe amateur",
    icon: "camera",
    from: "#BE185D",
    to: "#F59E0B",
    posts: [
      {
        id: 501,
        author: "Grâce Tchibozo",
        time: "Il y a 2 jours",
        text: "Les couchers de soleil sur la plage de Cotonou, rien de plus beau pour finir la journée.",
        likes: 42,
        liked: false,
        comments: [],
      },
    ],
  },
  {
    id: "marc",
    name: "Marc Adjovi",
    subtitle: "Joueur de jeux vidéo",
    icon: "gamepad",
    from: "#0F766E",
    to: "#4F46E5",
    posts: [
      {
        id: 601,
        author: "Marc Adjovi",
        time: "Il y a 3 jours",
        text: "Qui est partant pour une partie de jeux vidéo ce soir ? Je lance le défi !",
        likes: 15,
        liked: false,
        comments: [],
      },
    ],
  },
  {
    id: "fatou",
    name: "Fatou Diallo",
    subtitle: "Danseuse",
    icon: "music",
    from: "#9333EA",
    to: "#EC4899",
    posts: [
      {
        id: 701,
        author: "Fatou Diallo",
        time: "Il y a 3 jours",
        text: "Répétition de danse terminée ! Merci à toute l’équipe pour l’énergie.",
        likes: 27,
        liked: false,
        comments: [],
      },
    ],
  },
  {
    id: "kwame",
    name: "Kwame Asante",
    subtitle: "Amateur de cinéma",
    icon: "clapperboard",
    from: "#0369A1",
    to: "#14B8A6",
    posts: [
      {
        id: 801,
        author: "Kwame Asante",
        time: "Il y a 4 jours",
        text: "Je viens de voir un super film africain au cinéma. Je le recommande à tout le monde.",
        likes: 12,
        liked: false,
        comments: [],
      },
    ],
  },
];
