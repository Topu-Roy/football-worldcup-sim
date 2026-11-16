import type { Locale } from "./config";

export type PageMeta = { title: string; description: string };

/**
 * Page titles and descriptions. Descriptions also feed `og:description` and the
 * JSON-LD `description` fields, so keep every one at 160 characters or less to
 * avoid SERP truncation.
 */
export const meta: Record<
  Locale,
  {
    home: PageMeta;
    about: PageMeta;
    howToPlay: PageMeta;
    contact: PageMeta;
    privacy: PageMeta;
    terms: PageMeta;
    teams: (count: number) => PageMeta;
  }
> = {
  en: {
    home: {
      title: "World Cup Draft Game — Build a Fantasy XI | My World Cup XI",
      description:
        "Draft a fantasy World Cup XI from 77 squads, then simulate the tournament. Free browser world cup draft game. No download, no sign-up.",
    },
    about: {
      title: "What Is My World Cup XI? Free World Cup Draft Game",
      description:
        "My World Cup XI is a free browser game. Draft a fantasy XI from 77 World Cup squads, build chemistry and simulate the cup. No download, no sign-up.",
    },
    howToPlay: {
      title: "How to Play — World Cup Draft Rules & Simulator Guide",
      description:
        "Learn the world cup draft rules: formations, eleven picks, three rerolls, chemistry, group stage and penalty shootouts. Free browser game.",
    },
    contact: {
      title: "Contact - My World Cup XI",
      description:
        "Get in touch with My World Cup XI for feedback, bug reports, and questions about the fantasy football World Cup draft simulation game.",
    },
    privacy: {
      title: "Privacy Policy - My World Cup XI",
      description:
        "Privacy policy for My World Cup XI. Explains what data is collected when you use the fantasy football draft simulator website.",
    },
    terms: {
      title: "Terms & Conditions - My World Cup XI",
      description:
        "Terms and conditions for using My World Cup XI, the fantasy football World Cup draft and tournament simulation game.",
    },
    teams: (count) => ({
      title: "World Cup Squads & Ratings — Every Team to Draft",
      description: `Browse ${count} World Cup squads from 1970 to 2026 with player ratings, formations and full rosters. Scout every team before you draft.`,
    }),
  },
  de: {
    home: {
      title: "WM-Draft-Spiel — Traumelf bauen | My World Cup XI",
      description:
        "Draft eine Fantasy-WM-Elf aus 77 Kadern und simuliere das Turnier. Kostenloses WM-Draft-Spiel im Browser. Kein Download, keine Anmeldung.",
    },
    about: {
      title: "Was ist My World Cup XI? Kostenloses WM-Draft-Spiel",
      description:
        "My World Cup XI ist ein kostenloses Browserspiel. Draft eine Fantasy-Elf aus 77 WM-Kadern, baue Chemie und simuliere den Pokal.",
    },
    howToPlay: {
      title: "So spielst du — WM-Draft-Regeln & Simulator-Guide",
      description:
        "Lerne die WM-Draft-Regeln: Formationen, elf Picks, drei Neuwürfe, Chemie, Gruppenphase und Elfmeterschießen. Kostenloses Browserspiel.",
    },
    contact: {
      title: "Kontakt - My World Cup XI",
      description:
        "Kontaktiere My World Cup XI mit Feedback, Fehlermeldungen und Fragen zum Fantasy-Football-World-Cup-Draft-Simulationsspiel.",
    },
    privacy: {
      title: "Datenschutz - My World Cup XI",
      description:
        "Datenschutzerklärung für My World Cup XI. Erklärt, welche Daten beim Nutzen der Fantasy-Football-Draft-Simulator-Website erhoben werden.",
    },
    terms: {
      title: "AGB - My World Cup XI",
      description:
        "Allgemeine Geschäftsbedingungen für die Nutzung von My World Cup XI, dem Fantasy-Football-Draft- und Turnier-Simulationsspiel.",
    },
    teams: (count) => ({
      title: "WM-Kader & Bewertungen — Jedes Team zum Draften",
      description: `Alle ${count} WM-Kader von 1970 bis 2026 mit Spielerbewertungen, Formationen und Kadern. Scoute jedes Team vor dem Draft.`,
    }),
  },
  fr: {
    home: {
      title: "Jeu de draft Coupe du Monde — Créez votre XI | My World Cup XI",
      description:
        "Draftez une XI fantasy parmi 77 effectifs et simulez la Coupe du Monde. Jeu de draft gratuit dans le navigateur, sans inscription.",
    },
    about: {
      title: "Qu'est-ce que My World Cup XI ? Jeu de draft gratuit",
      description:
        "My World Cup XI est un jeu gratuit dans le navigateur. Draftez une XI parmi 77 effectifs, construisez la chimie et simulez la coupe.",
    },
    howToPlay: {
      title: "Comment jouer — Règles du draft & guide du simulateur",
      description:
        "Apprenez les règles du draft : formations, onze choix, trois relances, chimie, phase de groupes et tirs au but. Jeu gratuit.",
    },
    contact: {
      title: "Contacter My World Cup XI",
      description:
        "Contactez My World Cup XI pour vos retours, bugs et questions sur le jeu de simulation de draft de Coupe du Monde fantasy.",
    },
    privacy: {
      title: "Confidentialité - My World Cup XI",
      description:
        "Politique de confidentialité de My World Cup XI. Explique les données collectées sur le site de simulation de draft de Coupe du Monde fantasy.",
    },
    terms: {
      title: "Conditions - My World Cup XI",
      description:
        "Conditions générales d'utilisation de My World Cup XI, le jeu de simulation de draft et de tournoi de Coupe du Monde fantasy.",
    },
    teams: (count) => ({
      title: "Effectifs & notes de Coupe du Monde — Chaque équipe",
      description: `Tous les ${count} effectifs de Coupe du Monde de 1970 à 2026 avec notes, formations et listes. Observez chaque équipe avant de drafter.`,
    }),
  },
  ja: {
    home: {
      title:
        "ワールドカップ・ドラフトゲーム｜歴代チームでXI作成 | My World Cup XI",
      description:
        "1970〜2026年の77チームからワールドカップの夢のXIをドラフトし、大会をシミュレート。ブラウザで遊べる無料ゲーム。",
    },
    about: {
      title: "My World Cup XIとは？無料のワールドカップ・ドラフトゲーム",
      description:
        "My World Cup XIは無料のブラウザゲーム。77の歴代チームからXIをドラフトし、ケミストリーを組んで大会をシミュレートします。",
    },
    howToPlay: {
      title: "遊び方 — ワールドカップ・ドラフトのルールとガイド",
      description:
        "フォーメーション、11回の指名、3回のリロール、ケミストリー、グループステージ、PK戦。ワールドカップ・ドラフトのルールを説明します。",
    },
    contact: {
      title: "お問い合わせ - My World Cup XI",
      description:
        "My World Cup XIのファンタジーフットボール・ワールドカップ・ドラフトシミュレーションゲームについてのフィードバック、不具合報告、質問は My World Cup XI へ。",
    },
    privacy: {
      title: "プライバシー - My World Cup XI",
      description:
        "My World Cup XI のプライバシーポリシー。Fantasy Football ドラフトシミュレーターサイトの利用時に収集するデータを説明します。",
    },
    terms: {
      title: "利用規約 - My World Cup XI",
      description:
        "My World Cup XI（ファンタジーフットボール・ワールドカップのドラフト・トーナメントシミュレーションゲーム）の利用規約。",
    },
    teams: (count) => ({
      title: "ワールドカップのチームと評価 — ドラフトできる全チーム",
      description: `1970〜2026年のワールドカップ${count}チームを選手評価、フォーメーション、ロースター付きで紹介。ドラフト前に全チームをスカウト。`,
    }),
  },
  es: {
    home: {
      title: "Juego de draft del Mundial — Arma tu XI | My World Cup XI",
      description:
        "Draftea una XI fantasy de 77 plantillas y simula la Copa del Mundo. Juego de draft gratis en el navegador, sin registro.",
    },
    about: {
      title: "¿Qué es My World Cup XI? Juego de draft gratis",
      description:
        "My World Cup XI es un juego gratis en el navegador. Draftea una XI de 77 plantillas, construye química y simula la copa.",
    },
    howToPlay: {
      title: "Cómo jugar — Reglas del draft y guía del simulador",
      description:
        "Aprende las reglas del draft: formaciones, once elecciones, tres rerolls, química, fase de grupos y penales. Juego gratis.",
    },
    contact: {
      title: "Contacto - My World Cup XI",
      description:
        "Contacta con My World Cup XI con comentarios, errores y preguntas sobre el juego de simulación de draft de la Copa del Mundo fantasy.",
    },
    privacy: {
      title: "Privacidad - My World Cup XI",
      description:
        "Política de privacidad de My World Cup XI. Explica qué datos se recogen al usar el sitio del simulador de draft de la Copa del Mundo fantasy.",
    },
    terms: {
      title: "Términos - My World Cup XI",
      description:
        "Términos y condiciones de uso de My World Cup XI, el juego de simulación de draft y torneo de la Copa del Mundo fantasy.",
    },
    teams: (count) => ({
      title: "Plantillas y valoraciones del Mundial — Cada equipo",
      description: `Las ${count} plantillas del Mundial de 1970 a 2026 con valoraciones, formaciones y listas. Observa cada equipo antes de draftear.`,
    }),
  },
};
