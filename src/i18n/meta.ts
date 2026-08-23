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
      title:
        "Fantasy Football World Cup — Draft & Simulate | World Cup Simulator",
      description:
        "Build your fantasy World Cup dream team from 100+ historical squads (1970-2026), then watch them face the all-time greats in a simulated knockout tournament. Free world cup 2026 simulator in your browser — no download.",
    },
    about: {
      title: "What Is World Cup Draft Simulator? Dream Team Builder",
      description:
        "World Cup Draft Simulator is a free browser game where you draft a fantasy World Cup XI from 100+ historical squads (1970-2026) and run them through a simulated knockout tournament.",
    },
    howToPlay: {
      title: "How to Play the Fantasy Football World Cup (Free Guide)",
      description:
        "Learn how to draft a fantasy World Cup XI from historical squads, pick a formation, and run your team through a simulated knockout tournament with penalty shootouts.",
    },
    contact: {
      title: "Contact — World Cup Draft Simulator",
      description:
        "Contact World Cup Draft Simulator with feedback, bug reports and questions about the fantasy football World Cup draft simulation game.",
    },
    privacy: {
      title: "Privacy Policy — World Cup Draft Simulator",
      description:
        "Privacy policy for World Cup Draft Simulator. Explains what data is collected when you use the fantasy football draft simulator website.",
    },
    terms: {
      title: "Terms & Conditions — World Cup Draft Simulator",
      description:
        "Terms and conditions for using World Cup Draft Simulator, the fantasy football World Cup draft and tournament simulation game.",
    },
    teams: (count) => ({
      title: "World Cup Teams 1970-2026 — Historical Squads & Player Ratings",
      description: `Browse all ${count} historical World Cup teams from 1970 to 2026 with player ratings, from Brazil 1970 to Argentina 2022. Draft any team in the fantasy World Cup simulator.`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `${nation} ${year} Squad — World Cup ${year} Team & Player Ratings`,
        description: `See the ${nation} ${year} World Cup squad${names.length ? `: ${names.join(", ")}` : ""}. Full roster, player ratings and a ${form} formation. Draft this historical team in the fantasy World Cup simulator.`,
      };
    },
  },
  de: {
    home: {
      title:
        "Fantasy Football World Cup — Draft & Simulation | World Cup Simulator",
      description:
        "Stelle dein Fantasy-World-Cup-Traumteam aus über 100 historischen Mannschaften (1970-2026) zusammen und sieh ihm in einem simulierten K.-o.-Turnier gegen die Besten aller Zeiten zu. Kostenloser World-Cup-2026-Simulator im Browser — kein Download.",
    },
    about: {
      title: "Was ist der World Cup Draft Simulator? Traumteam bauen",
      description:
        "World Cup Draft Simulator ist ein kostenloses Browser-Spiel, in dem du ein Fantasy-World-Cup-Team aus über 100 historischen Mannschaften (1970-2026) aufstellst und in einem simulierten K.-o.-Turnier antreten lässt.",
    },
    howToPlay: {
      title: "Fantasy Football World Cup spielen – kostenlose Anleitung",
      description:
        "Erfahre, wie du ein Fantasy-World-Cup-Team aus historischen Mannschaften aufstellst, eine Formation wählst und dein Team in einem simulierten K.-o.-Turnier mit Elfmeterschießen antreten lässt.",
    },
    contact: {
      title: "Kontakt — World Cup Draft Simulator",
      description:
        "Kontaktiere World Cup Draft Simulator mit Feedback, Fehlermeldungen und Fragen zum Fantasy-World-Cup-Draft-Simulationsspiel.",
    },
    privacy: {
      title: "Datenschutz — World Cup Draft Simulator",
      description:
        "Datenschutzerklärung für World Cup Draft Simulator. Erklärt, welche Daten beim Nutzen der Fantasy-Football-Draft-Simulator-Website erhoben werden.",
    },
    terms: {
      title: "AGB — World Cup Draft Simulator",
      description:
        "Allgemeine Geschäftsbedingungen für die Nutzung von World Cup Draft Simulator, dem Fantasy-Football-Draft- und Turnier-Simulationsspiel.",
    },
    teams: (count) => ({
      title:
        "World Cup Teams 1970-2026 — Historische Mannschaften & Spielerbewertungen",
      description: `Stöbere durch alle ${count} historischen World-Cup-Mannschaften von 1970 bis 2026 mit Spielerbewertungen, von Brasilien 1970 bis Argentinien 2022. Stelle im Fantasy-World-Cup-Simulator jede Mannschaft auf.`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `${nation} ${year} — World-Cup-${year}-Team & Spielerbewertungen`,
        description: `${nation} ${year}: WM-Kader${names.length ? ` mit ${names.join(", ")}` : ""}. Voller Kader, Spielerbewertungen und ${form}-Formation. Stelle dieses historische ${nation}-Team im Fantasy-World-Cup-Simulator auf.`,
      };
    },
  },
  fr: {
    home: {
      title:
        "Coupe du Monde Fantasy — Draft & Simulation | Simulateur de Coupe du Monde",
      description:
        "Composez votre équipe de rêve de Coupe du Monde fantasy parmi plus de 100 équipes historiques (1970-2026), puis regardez-la affronter les plus grands de l'histoire dans un tournoi à élimination directe simulé. Simulateur Coupe du Monde 2026 gratuit dans le navigateur, sans téléchargement.",
    },
    about: {
      title:
        "Qu'est-ce que World Cup Draft Simulator ? Créez votre équipe type",
      description:
        "World Cup Draft Simulator est un jeu gratuit dans le navigateur où vous composez un onze de Coupe du Monde fantasy parmi plus de 100 équipes historiques (1970-2026) et le faites jouer dans un tournoi simulé.",
    },
    howToPlay: {
      title: "Comment jouer au Fantasy Football World Cup (guide gratuit)",
      description:
        "Découvrez comment composer un onze de Coupe du Monde fantasy à partir d'équipes historiques, choisir une formation et faire jouer votre équipe dans un tournoi simulé avec tirs au but.",
    },
    contact: {
      title: "Contacter World Cup Draft Simulator",
      description:
        "Contactez World Cup Draft Simulator pour vos retours, bugs et questions sur le jeu de simulation de draft de Coupe du Monde fantasy.",
    },
    privacy: {
      title: "Confidentialité — World Cup Draft Simulator",
      description:
        "Politique de confidentialité de World Cup Draft Simulator. Explique les données collectées sur le site de simulation de draft de Coupe du Monde fantasy.",
    },
    terms: {
      title: "Conditions — World Cup Draft Simulator",
      description:
        "Conditions générales d'utilisation de World Cup Draft Simulator, le jeu de simulation de draft et de tournoi de Coupe du Monde fantasy.",
    },
    teams: (count) => ({
      title:
        "Équipes de Coupe du Monde 1970-2026 — Équipes historiques et notes des joueurs",
      description: `Parcourez toutes les ${count} équipes historiques de Coupe du Monde de 1970 à 2026 avec les notes des joueurs, du Brésil 1970 à l'Argentine 2022. Composez n'importe quelle équipe dans le simulateur.`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `Équipe ${nation} ${year} — Coupe du Monde ${year} : notes des joueurs`,
        description: `${nation} ${year} : l'équipe du Mondial${names.length ? ` avec ${names.join(", ")}` : ""}. Effectif complet, notes des joueurs et formation ${form}. Composez cette équipe historique dans le simulateur.`,
      };
    },
  },
  ja: {
    home: {
      title:
        "Fantasy Football World Cup — ドラフト＆シミュレート | World Cup Simulator",
      description:
        "1970〜2026年の歴代チーム100以上からワールドカップの夢のチームを作り、シミュレートされた決勝トーナメントで史上最強チームと対戦。ブラウザで使える無料のワールドカップ2026シミュレーター。ダウンロード不要。",
    },
    about: {
      title: "World Cup Draft Simulatorとは？夢のチームを作ろう",
      description:
        "World Cup Draft Simulatorは無料のブラウザゲーム。1970〜2026年の歴代チーム100以上からワールドカップの夢のチームをドラフトし、シミュレートされたトーナメントで戦わせます。",
    },
    howToPlay: {
      title: "Fantasy Football World Cup の遊び方（無料ガイド）",
      description:
        "歴代チームからワールドカップの夢のチームをドラフトする方法、フォーメーションの選び方、PK付きのシミュレートされたトーナメントの進め方を学びます。",
    },
    contact: {
      title: "お問い合わせ — World Cup Draft Simulator",
      description:
        "Fantasy Football World Cup ドラフトシミュレーションゲームについてのフィードバック、不具合報告、質問は World Cup Draft Simulator へ。",
    },
    privacy: {
      title: "プライバシー — World Cup Draft Simulator",
      description:
        "World Cup Draft Simulator のプライバシーポリシー。Fantasy Football ドラフトシミュレーターサイトの利用時に収集するデータを説明します。",
    },
    terms: {
      title: "利用規約 — World Cup Draft Simulator",
      description:
        "World Cup Draft Simulator（Fantasy Football ワールドカップのドラフト・トーナメントシミュレーションゲーム）の利用規約。",
    },
    teams: (count) => ({
      title: "ワールドカップチーム 1970-2026 — 歴代チーム＆選手レーティング",
      description: `1970年から2026年までの歴代ワールドカップチーム${count}を選手レーティング付きで見る。ブラジル1970からアルゼンチン2022まで。シミュレーターで任意のチームをドラフト。`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `${nation} ${year} 代表 — ワールドカップ${year}チーム＆選手レーティング`,
        description: `${nation} ${year} ワールドカップ代表${names.length ? `：${names.join("、")}ら` : ""}。全選手とレーティング、${form}フォーメーション。この歴代チームをシミュレーターでドラフト。`,
      };
    },
  },
  es: {
    home: {
      title:
        "Fantasy Football World Cup — Draft y Simulación | World Cup Simulator",
      description:
        "Arma tu equipo de ensueño de la Copa del Mundo fantasy con más de 100 equipos históricos (1970-2026) y míralo enfrentarse a los mejores de la historia en un torneo de eliminación simulado. Simulador Mundial 2026 gratis en el navegador, sin descargas.",
    },
    about: {
      title: "Qué es World Cup Draft Simulator? Crea tu equipo ideal",
      description:
        "World Cup Draft Simulator es un juego gratuito en el navegador donde armas un once de la Copa del Mundo fantasy con más de 100 equipos históricos (1970-2026) y lo enfrentas en un torneo simulado.",
    },
    howToPlay: {
      title: "Cómo jugar al Fantasy Football World Cup (guía gratis)",
      description:
        "Aprende a armar un once de la Copa del Mundo fantasy con equipos históricos, elegir una formación y enfrentar a tu equipo en un torneo simulado con penales.",
    },
    contact: {
      title: "Contacto — World Cup Draft Simulator",
      description:
        "Contacta con World Cup Draft Simulator con comentarios, errores y preguntas sobre el juego de simulación de draft de la Copa del Mundo fantasy.",
    },
    privacy: {
      title: "Privacidad — World Cup Draft Simulator",
      description:
        "Política de privacidad de World Cup Draft Simulator. Explica qué datos se recogen al usar el sitio del simulador de draft de la Copa del Mundo fantasy.",
    },
    terms: {
      title: "Términos — World Cup Draft Simulator",
      description:
        "Términos y condiciones de uso de World Cup Draft Simulator, el juego de simulación de draft y torneo de la Copa del Mundo fantasy.",
    },
    teams: (count) => ({
      title:
        "Equipos del Mundial 1970-2026 — Plantillas históricas y valoraciones",
      description: `Explora los ${count} equipos históricos del Mundial de 1970 a 2026 con valoraciones, del Brasil 1970 a la Argentina 2022. Arma cualquier equipo en el simulador.`,
    }),
    team: (nation, year) => {
      const { names, form } = teamExtras(nation, year);
      return {
        title: `Equipo ${nation} ${year} — Mundial ${year}: valoraciones`,
        description: `${nation} ${year}: el equipo del Mundial${names.length ? ` con ${names.join(", ")}` : ""}. Plantilla completa, valoraciones y formación ${form}. Arma este histórico equipo en el simulador.`,
      };
    },
  },
};
