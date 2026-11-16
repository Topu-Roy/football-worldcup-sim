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
      title:
        "My World Cup XI - Draft Historical Squads, Simulate the World Cup",
      description:
        "Draft a fantasy World Cup XI from 86 historical squads (1970-2026) and simulate the cup. Free browser football game - no download, no sign-up.",
    },
    about: {
      title: "What Is My World Cup XI? - Free Fantasy Football World Cup Game",
      description:
        "My World Cup XI is a free browser game: draft a fantasy World Cup XI from 86 historical squads and simulate the tournament. Draft, simulate, replay.",
    },
    howToPlay: {
      title: "How to Play My World Cup XI - Free Guide",
      description:
        "Learn how to draft a fantasy World Cup XI, pick a formation, and simulate the tournament with penalty shootouts. Step-by-step guide.",
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
      title: "All Historical Squads - My World Cup XI",
      description: `Browse all ${count} historical World Cup squads (1970-2026) with player ratings, from Brazil 1970 to Argentina 2022. Draft any team.`,
    }),
  },
  de: {
    home: {
      title: "My World Cup XI - Historische Kader draften, WM simulieren",
      description:
        "Stelle dein Fantasy-WM-Team aus 86 historischen Kadern (1970-2026) zusammen und simuliere das Turnier. Kostenlos im Browser, ohne Anmeldung.",
    },
    about: {
      title: "Was ist My World Cup XI? - Kostenloses Fantasy-WM-Spiel",
      description:
        "My World Cup XI ist ein kostenloses Browserspiel: Fantasy-WM-Team aus 86 historischen Kadern draften und das Turnier simulieren.",
    },
    howToPlay: {
      title: "So spielst du My World Cup XI - Kostenlose Anleitung",
      description:
        "Lerne, wie du ein Fantasy-WM-Team aus 86 historischen Kadern aufstellst, eine Formation wählst und das Turnier mit Elfmeterschießen simulierst.",
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
      title: "Alle historischen Mannschaften - My World Cup XI",
      description: `Alle ${count} historischen WM-Mannschaften (1970-2026) mit Spielerbewertungen, von Brasilien 1970 bis Argentinien 2022. Draft jede Mannschaft.`,
    }),
  },
  fr: {
    home: {
      title:
        "My World Cup XI - Composez votre équipe, simulez la Coupe du Monde",
      description:
        "Composez votre XI fantasy parmi 86 équipes historiques (1970-2026) et simulez la Coupe du Monde. Jeu gratuit dans le navigateur, sans inscription.",
    },
    about: {
      title:
        "Qu'est-ce qu'My World Cup XI ? - Jeu de Coupe du Monde fantasy gratuit",
      description:
        "My World Cup XI est un jeu gratuit dans le navigateur : composez un XI fantasy parmi 86 équipes historiques et simulez la Coupe du Monde.",
    },
    howToPlay: {
      title: "Comment jouer à My World Cup XI - Guide gratuit",
      description:
        "Découvrez comment composer un XI fantasy, choisir une formation et simuler la Coupe du Monde avec tirs au but. Guide étape par étape.",
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
      title: "Toutes les équipes historiques - My World Cup XI",
      description: `Parcourez les ${count} équipes historiques du Mondial (1970-2026) avec notes des joueurs, du Brésil 1970 à l'Argentine 2022.`,
    }),
  },
  ja: {
    home: {
      title:
        "My World Cup XI - 歴代チームをドラフト、ワールドカップをシミュレート",
      description:
        "1970〜2026年の歴代86チームからワールドカップの夢のXIを作り、トーナメントをシミュレート。ブラウザで遊べる無料ゲーム。",
    },
    about: {
      title: "My World Cup XIとは？ - 無料のファンタジー・ワールドカップゲーム",
      description:
        "My World Cup XIは無料のブラウザゲーム。歴代86チームからワールドカップの夢のXIをドラフトし、トーナメントをシミュレートします。",
    },
    howToPlay: {
      title: "My World Cup XI の遊び方 - 無料ガイド",
      description:
        "歴代86チームから夢のXIをドラフトし、フォーメーションを選んでPK戦付きのトーナメントをシミュレートする方法を紹介します。",
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
      title: "すべての歴代チーム - My World Cup XI",
      description: `1970〜2026年の歴代ワールドカップチーム${count}を選手レーティング付きで紹介。ブラジル1970からアルゼンチン2022まで。`,
    }),
  },
  es: {
    home: {
      title: "My World Cup XI - Arma tu equipo, simula el Mundial",
      description:
        "Arma tu XI fantasy con 86 equipos históricos (1970-2026) y simula la Copa del Mundo. Juego gratis en el navegador, sin registro.",
    },
    about: {
      title: "Qué es My World Cup XI - Juego de Copa del Mundo fantasy gratis",
      description:
        "My World Cup XI es un juego gratis en el navegador: arma un XI fantasy con 86 equipos históricos y simula la Copa del Mundo.",
    },
    howToPlay: {
      title: "Cómo jugar a My World Cup XI - Guía gratis",
      description:
        "Aprende a armar un XI fantasy, elegir una formación y simular la Copa del Mundo con penales. Guía paso a paso.",
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
      title: "Todos los equipos históricos - My World Cup XI",
      description: `Explora los ${count} equipos históricos del Mundial (1970-2026) con valoraciones, del Brasil 1970 a la Argentina 2022.`,
    }),
  },
};
