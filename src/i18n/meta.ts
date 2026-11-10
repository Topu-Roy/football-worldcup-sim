import type { Locale } from "./config";

export type PageMeta = { title: string; description: string };

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
      title: "My World Cup XI - Draft Historical Squads, Simulate the World Cup",
      description:
        "Build your fantasy World Cup dream team from 86 historical squads (1970-2026), then watch them face the all-time greats in a simulated knockout tournament. Free browser-based fantasy football simulator - no download, no sign-up.",
    },
    about: {
      title: "What Is My World Cup XI? - Free Fantasy Football World Cup Game",
      description:
        "My World Cup XI is a free browser game where you draft a fantasy World Cup XI from 86 historical squads (1970-2026) and run them through a simulated knockout tournament. Draft, simulate, replay.",
    },
    howToPlay: {
      title: "How to Play My World Cup XI - Free Guide",
      description:
        "Learn how to draft a fantasy World Cup XI from historical squads, pick a formation, and run your team through a simulated knockout tournament with penalty shootouts. Step-by-step guide for the My World Cup XI soccer simulator.",
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
      description: `Browse all ${count} historical World Cup teams from 1970 to 2026 with player ratings, from Brazil 1970 to Argentina 2022. Draft any squad in the My World Cup XI simulator.`,
    }),
  },
  de: {
    home: {
      title: "My World Cup XI - Historische Kader draften, WM simulieren",
      description:
        "Stelle dein Fantasy-WM-Team aus über 100 historischen Mannschaften (1970-2026) zusammen und sieh ihm in einem simulierten K.-o.-Turnier gegen die Besten aller Zeiten zu. Kostenloser Browser-basierter Fußballsimulator - kein Download, keine Anmeldung.",
    },
    about: {
      title: "Was ist My World Cup XI? - Kostenloses Fantasy-WM-Spiel",
      description:
        "My World Cup XI ist ein kostenloses Browser-Spiel, in dem du ein Fantasy-World-Cup-Team aus über 100 historischen Mannschaften (1970-2026) aufstellst und in einem simulierten K.-o.-Turnier antreten lässt. Draften, simulieren, wiederholen.",
    },
    howToPlay: {
      title: "So spielst du My World Cup XI - Kostenlose Anleitung",
      description:
        "Lerne, wie du ein Fantasy-WM-Team aus historischen Mannschaften aufstellst, eine Formation wählst und dein Team in einem simulierten K.-o.-Turnier mit Elfmeterschießen antreten lässt. Schritt-für-Schritt-Anleitung für den My World Cup XI Fußballsimulator.",
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
      description: `Stöbere durch alle ${count} historischen World-Cup-Mannschaften von 1970 bis 2026 mit Spielerbewertungen, von Brasilien 1970 bis Argentinien 2022. Stelle jede Mannschaft im My World Cup XI Simulator auf.`,
    }),
  },
  fr: {
    home: {
      title:
        "My World Cup XI - Composez votre équipe, simulez la Coupe du Monde",
      description:
        "Composez votre équipe de rêve de Coupe du Monde fantasy parmi plus de 100 équipes historiques (1970-2026), puis regardez-la affronter les plus grands dans un tournoi à élimination simulé. Simulateur de football fantasy gratuit dans le navigateur - sans téléchargement, sans inscription.",
    },
    about: {
      title:
        "Qu'est-ce qu'My World Cup XI ? - Jeu de Coupe du Monde fantasy gratuit",
      description:
        "My World Cup XI est un jeu gratuit dans le navigateur où vous composez un onze de Coupe du Monde fantasy parmi plus de 100 équipes historiques (1970-2026) et le faites jouer dans un tournoi simulé. Draft, simulez, rejouez.",
    },
    howToPlay: {
      title: "Comment jouer à My World Cup XI - Guide gratuit",
      description:
        "Découvrez comment composer un onze de Coupe du Monde fantasy à partir d'équipes historiques, choisir une formation et faire jouer votre équipe dans un tournoi simulé avec tirs au but. Guide étape par étape pour le simulateur My World Cup XI.",
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
      description: `Parcourez toutes les ${count} équipes historiques de Coupe du Monde de 1970 à 2026 avec les notes des joueurs, du Brésil 1970 à l'Argentine 2022. Composez n'importe quelle équipe dans le simulateur My World Cup XI.`,
    }),
  },
  ja: {
    home: {
      title:
        "My World Cup XI - 歴代チームをドラフト、ワールドカップをシミュレート",
      description:
        "1970〜2026年の歴代チーム100以上からワールドカップの夢のチームを作り、シミュレートされた決勝トーナメントで史上最強チームと対戦。ブラウザで遊べる無料のファンタジーフットボールシミュレーター。ダウンロード不要、登録不要。",
    },
    about: {
      title: "My World Cup XIとは？ - 無料のファンタジー・ワールドカップゲーム",
      description:
        "My World Cup XIは無料のブラウザゲーム。1970〜2026年の歴代チーム100以上からワールドカップの夢のチームをドラフトし、シミュレートされたトーナメントで戦わせます。ドラフト、シミュレート、リプレイ。",
    },
    howToPlay: {
      title: "My World Cup XI の遊び方 - 無料ガイド",
      description:
        "歴代チームからワールドカップの夢のチームをドラフトする方法、フォーメーションの選び方、PK付きのシミュレートされたトーナメントの進め方を学びます。My World Cup XIサッカーシミュレーターのステップバイステップガイド。",
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
      description: `1970年から2026年までの歴代ワールドカップチーム${count}を選手レーティング付きで見る。ブラジル1970からアルゼンチン2022まで。My World Cup XIシミュレーターで任意のチームをドラフト。`,
    }),
  },
  es: {
    home: {
      title: "My World Cup XI - Arma tu equipo, simula el Mundial",
      description:
        "Arma tu equipo de ensueño de la Copa del Mundo fantasy con más de 100 equipos históricos (1970-2026) y míralo enfrentarse a los mejores de la historia en un torneo de eliminación simulado. Simulador de fútbol fantasy gratis en el navegador - sin descargas, sin registro.",
    },
    about: {
      title: "Qué es My World Cup XI - Juego de Copa del Mundo fantasy gratis",
      description:
        "My World Cup XI es un juego gratuito en el navegador donde armas un once de la Copa del Mundo fantasy con más de 100 equipos históricos (1970-2026) y lo enfrentas en un torneo simulado. Draft, simula, repite.",
    },
    howToPlay: {
      title: "Cómo jugar a My World Cup XI - Guía gratis",
      description:
        "Aprende a armar un once de la Copa del Mundo fantasy con equipos históricos, elegir una formación y enfrentar a tu equipo en un torneo simulado con penales. Guía paso a paso para el simulador My World Cup XI.",
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
      description: `Explora los ${count} equipos históricos del Mundial de 1970 a 2026 con valoraciones, del Brasil 1970 a la Argentina 2022. Arma cualquier equipo en el simulador My World Cup XI.`,
    }),
  },
};
