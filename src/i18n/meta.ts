import type { Locale } from "./config";
import { HISTORICAL_SQUADS } from "../data/historical/index";
import { playerRating } from "../lib/draft/rating";
import { FORMATIONS } from "../lib/types";

export type PageMeta = { title: string; description: string };

function teamExtras(
  nation: string,
  year: string,
): { names: string[]; form: string } {
  const s = HISTORICAL_SQUADS.find(
    (x) =>
      x.name.replace(/\s+\d{4}$/, "") === nation && String(x.wcYear) === year,
  );
  if (!s) return { names: [], form: "4-3-3" };
  const names = [...s.players]
    .sort((a, b) => playerRating(b) - playerRating(a))
    .slice(0, 3)
    .map((p) => p.name);
  let form = "4-3-3";
  for (const k of Object.keys(FORMATIONS)) {
    const v = FORMATIONS[k];
    if (
      v.GK === s.formation.GK &&
      v.DEF === s.formation.DEF &&
      v.MID === s.formation.MID &&
      v.ATT === s.formation.ATT
    ) {
      form = k;
      break;
    }
  }
  return { names, form };
}

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
    team: (nation: string, year: string) => PageMeta;
  }
> = {
  en: {
    home: {
      title: "Eleven Fantasy - Draft Historical Squads, Simulate the World Cup",
      description:
        "Build your fantasy World Cup dream team from 100+ historical squads (1970-2026), then watch them face the all-time greats in a simulated knockout tournament. Free browser-based fantasy football simulator - no download, no sign-up.",
    },
    about: {
      title: "What Is Eleven Fantasy? - Free Fantasy Football World Cup Game",
      description:
        "Eleven Fantasy is a free browser game where you draft a fantasy World Cup XI from 100+ historical squads (1970-2026) and run them through a simulated knockout tournament. Draft, simulate, replay.",
    },
    howToPlay: {
      title: "How to Play Eleven Fantasy - Free Guide",
      description:
        "Learn how to draft a fantasy World Cup XI from historical squads, pick a formation, and run your team through a simulated knockout tournament with penalty shootouts. Step-by-step guide for the Eleven Fantasy soccer simulator.",
    },
    contact: {
      title: "Contact - Eleven Fantasy",
      description:
        "Get in touch with Eleven Fantasy for feedback, bug reports, and questions about the fantasy football World Cup draft simulation game.",
    },
    privacy: {
      title: "Privacy Policy - Eleven Fantasy",
      description:
        "Privacy policy for Eleven Fantasy. Explains what data is collected when you use the fantasy football draft simulator website.",
    },
    terms: {
      title: "Terms & Conditions - Eleven Fantasy",
      description:
        "Terms and conditions for using Eleven Fantasy, the fantasy football World Cup draft and tournament simulation game.",
    },
    teams: (count) => ({
      title: "All Historical Squads - Eleven Fantasy",
      description: `Browse all ${count} historical World Cup teams from 1970 to 2026 with player ratings, from Brazil 1970 to Argentina 2022. Draft any squad in the Eleven Fantasy simulator.`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `${nation} ${year} Squad - Eleven Fantasy`,
        description: `See the ${nation} ${year} World Cup squad${names.length ? `: ${names.join(", ")}` : ""}. Full roster, player ratings and a ${form} formation. Draft this historical team in Eleven Fantasy.`,
      };
    },
  },
  de: {
    home: {
      title: "Eleven Fantasy - Historische Kader draften, WM simulieren",
      description:
        "Stelle dein Fantasy-WM-Team aus über 100 historischen Mannschaften (1970-2026) zusammen und sieh ihm in einem simulierten K.-o.-Turnier gegen die Besten aller Zeiten zu. Kostenloser Browser-basierter Fußballsimulator - kein Download, keine Anmeldung.",
    },
    about: {
      title: "Was ist Eleven Fantasy? - Kostenloses Fantasy-WM-Spiel",
      description:
        "Eleven Fantasy ist ein kostenloses Browser-Spiel, in dem du ein Fantasy-World-Cup-Team aus über 100 historischen Mannschaften (1970-2026) aufstellst und in einem simulierten K.-o.-Turnier antreten lässt. Draften, simulieren, wiederholen.",
    },
    howToPlay: {
      title: "So spielst du Eleven Fantasy - Kostenlose Anleitung",
      description:
        "Lerne, wie du ein Fantasy-WM-Team aus historischen Mannschaften aufstellst, eine Formation wählst und dein Team in einem simulierten K.-o.-Turnier mit Elfmeterschießen antreten lässt. Schritt-für-Schritt-Anleitung für den Eleven Fantasy Fußballsimulator.",
    },
    contact: {
      title: "Kontakt - Eleven Fantasy",
      description:
        "Kontaktiere Eleven Fantasy mit Feedback, Fehlermeldungen und Fragen zum Fantasy-Football-World-Cup-Draft-Simulationsspiel.",
    },
    privacy: {
      title: "Datenschutz - Eleven Fantasy",
      description:
        "Datenschutzerklärung für Eleven Fantasy. Erklärt, welche Daten beim Nutzen der Fantasy-Football-Draft-Simulator-Website erhoben werden.",
    },
    terms: {
      title: "AGB - Eleven Fantasy",
      description:
        "Allgemeine Geschäftsbedingungen für die Nutzung von Eleven Fantasy, dem Fantasy-Football-Draft- und Turnier-Simulationsspiel.",
    },
    teams: (count) => ({
      title: "Alle historischen Mannschaften - Eleven Fantasy",
      description: `Stöbere durch alle ${count} historischen World-Cup-Mannschaften von 1970 bis 2026 mit Spielerbewertungen, von Brasilien 1970 bis Argentinien 2022. Stelle jede Mannschaft im Eleven Fantasy Simulator auf.`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `${nation} ${year} - Eleven Fantasy`,
        description: `${nation} ${year}: WM-Kader${names.length ? ` mit ${names.join(", ")}` : ""}. Voller Kader, Spielerbewertungen und ${form}-Formation. Stelle dieses historische ${nation}-Team in Eleven Fantasy auf.`,
      };
    },
  },
  fr: {
    home: {
      title:
        "Eleven Fantasy - Composez votre équipe, simulez la Coupe du Monde",
      description:
        "Composez votre équipe de rêve de Coupe du Monde fantasy parmi plus de 100 équipes historiques (1970-2026), puis regardez-la affronter les plus grands dans un tournoi à élimination simulé. Simulateur de football fantasy gratuit dans le navigateur - sans téléchargement, sans inscription.",
    },
    about: {
      title:
        "Qu'est-ce qu'Eleven Fantasy ? - Jeu de Coupe du Monde fantasy gratuit",
      description:
        "Eleven Fantasy est un jeu gratuit dans le navigateur où vous composez un onze de Coupe du Monde fantasy parmi plus de 100 équipes historiques (1970-2026) et le faites jouer dans un tournoi simulé. Draft, simulez, rejouez.",
    },
    howToPlay: {
      title: "Comment jouer à Eleven Fantasy - Guide gratuit",
      description:
        "Découvrez comment composer un onze de Coupe du Monde fantasy à partir d'équipes historiques, choisir une formation et faire jouer votre équipe dans un tournoi simulé avec tirs au but. Guide étape par étape pour le simulateur Eleven Fantasy.",
    },
    contact: {
      title: "Contacter Eleven Fantasy",
      description:
        "Contactez Eleven Fantasy pour vos retours, bugs et questions sur le jeu de simulation de draft de Coupe du Monde fantasy.",
    },
    privacy: {
      title: "Confidentialité - Eleven Fantasy",
      description:
        "Politique de confidentialité de Eleven Fantasy. Explique les données collectées sur le site de simulation de draft de Coupe du Monde fantasy.",
    },
    terms: {
      title: "Conditions - Eleven Fantasy",
      description:
        "Conditions générales d'utilisation de Eleven Fantasy, le jeu de simulation de draft et de tournoi de Coupe du Monde fantasy.",
    },
    teams: (count) => ({
      title: "Toutes les équipes historiques - Eleven Fantasy",
      description: `Parcourez toutes les ${count} équipes historiques de Coupe du Monde de 1970 à 2026 avec les notes des joueurs, du Brésil 1970 à l'Argentine 2022. Composez n'importe quelle équipe dans le simulateur Eleven Fantasy.`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `Équipe ${nation} ${year} - Eleven Fantasy`,
        description: `${nation} ${year} : l'équipe du Mondial${names.length ? ` avec ${names.join(", ")}` : ""}. Effectif complet, notes des joueurs et formation ${form}. Composez cette équipe historique dans Eleven Fantasy.`,
      };
    },
  },
  ja: {
    home: {
      title:
        "Eleven Fantasy - 歴代チームをドラフト、ワールドカップをシミュレート",
      description:
        "1970〜2026年の歴代チーム100以上からワールドカップの夢のチームを作り、シミュレートされた決勝トーナメントで史上最強チームと対戦。ブラウザで遊べる無料のファンタジーフットボールシミュレーター。ダウンロード不要、登録不要。",
    },
    about: {
      title: "Eleven Fantasyとは？ - 無料のファンタジー・ワールドカップゲーム",
      description:
        "Eleven Fantasyは無料のブラウザゲーム。1970〜2026年の歴代チーム100以上からワールドカップの夢のチームをドラフトし、シミュレートされたトーナメントで戦わせます。ドラフト、シミュレート、リプレイ。",
    },
    howToPlay: {
      title: "Eleven Fantasy の遊び方 - 無料ガイド",
      description:
        "歴代チームからワールドカップの夢のチームをドラフトする方法、フォーメーションの選び方、PK付きのシミュレートされたトーナメントの進め方を学びます。Eleven Fantasyサッカーシミュレーターのステップバイステップガイド。",
    },
    contact: {
      title: "お問い合わせ - Eleven Fantasy",
      description:
        "Eleven Fantasyのファンタジーフットボール・ワールドカップ・ドラフトシミュレーションゲームについてのフィードバック、不具合報告、質問は Eleven Fantasy へ。",
    },
    privacy: {
      title: "プライバシー - Eleven Fantasy",
      description:
        "Eleven Fantasy のプライバシーポリシー。Fantasy Football ドラフトシミュレーターサイトの利用時に収集するデータを説明します。",
    },
    terms: {
      title: "利用規約 - Eleven Fantasy",
      description:
        "Eleven Fantasy（ファンタジーフットボール・ワールドカップのドラフト・トーナメントシミュレーションゲーム）の利用規約。",
    },
    teams: (count) => ({
      title: "すべての歴代チーム - Eleven Fantasy",
      description: `1970年から2026年までの歴代ワールドカップチーム${count}を選手レーティング付きで見る。ブラジル1970からアルゼンチン2022まで。Eleven Fantasyシミュレーターで任意のチームをドラフト。`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `${nation} ${year} 代表 - Eleven Fantasy`,
        description: `${nation} ${year} ワールドカップ代表${names.length ? `：${names.join("、")}ら` : ""}。全選手とレーティング、${form}フォーメーション。この歴代チームを Eleven Fantasy でドラフト。`,
      };
    },
  },
  es: {
    home: {
      title: "Eleven Fantasy - Arma tu equipo, simula el Mundial",
      description:
        "Arma tu equipo de ensueño de la Copa del Mundo fantasy con más de 100 equipos históricos (1970-2026) y míralo enfrentarse a los mejores de la historia en un torneo de eliminación simulado. Simulador de fútbol fantasy gratis en el navegador - sin descargas, sin registro.",
    },
    about: {
      title: "Qué es Eleven Fantasy - Juego de Copa del Mundo fantasy gratis",
      description:
        "Eleven Fantasy es un juego gratuito en el navegador donde armas un once de la Copa del Mundo fantasy con más de 100 equipos históricos (1970-2026) y lo enfrentas en un torneo simulado. Draft, simula, repite.",
    },
    howToPlay: {
      title: "Cómo jugar a Eleven Fantasy - Guía gratis",
      description:
        "Aprende a armar un once de la Copa del Mundo fantasy con equipos históricos, elegir una formación y enfrentar a tu equipo en un torneo simulado con penales. Guía paso a paso para el simulador Eleven Fantasy.",
    },
    contact: {
      title: "Contacto - Eleven Fantasy",
      description:
        "Contacta con Eleven Fantasy con comentarios, errores y preguntas sobre el juego de simulación de draft de la Copa del Mundo fantasy.",
    },
    privacy: {
      title: "Privacidad - Eleven Fantasy",
      description:
        "Política de privacidad de Eleven Fantasy. Explica qué datos se recogen al usar el sitio del simulador de draft de la Copa del Mundo fantasy.",
    },
    terms: {
      title: "Términos - Eleven Fantasy",
      description:
        "Términos y condiciones de uso de Eleven Fantasy, el juego de simulación de draft y torneo de la Copa del Mundo fantasy.",
    },
    teams: (count) => ({
      title: "Todos los equipos históricos - Eleven Fantasy",
      description: `Explora los ${count} equipos históricos del Mundial de 1970 a 2026 con valoraciones, del Brasil 1970 a la Argentina 2022. Arma cualquier equipo en el simulador Eleven Fantasy.`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `Equipo ${nation} ${year} - Eleven Fantasy`,
        description: `${nation} ${year}: el equipo del Mundial${names.length ? ` con ${names.join(", ")}` : ""}. Plantilla completa, valoraciones y formación ${form}. Arma este histórico equipo en Eleven Fantasy.`,
      };
    },
  },
};
