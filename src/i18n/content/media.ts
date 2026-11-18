import type { Locale } from "../config";
import type { MediaId } from "../../data/media";

export interface MediaCopy {
  alt: string;
  caption?: string;
}

/**
 * Alt and caption copy for every screenshot, per locale.
 *
 * Alt text describes the UI and the data shown. Captions add context and do
 * not repeat the alt. DE/FR/JA/ES need human review before launch.
 */
export const mediaCopy: Record<Locale, Record<MediaId, MediaCopy>> = {
  en: {
    formation: {
      alt: "Formation picker with four World Cup XI shapes: 4-3-3, 4-4-2, 3-5-2 and 4-2-3-1.",
      caption:
        "Pick a shape first. It fixes how many defenders, midfielders and attackers you need.",
    },
    draft: {
      alt: "Draft board showing a historical squad, open formation slots and three rerolls remaining.",
      caption: "Each round offers one squad that can fill an open slot.",
    },
    chemistry: {
      alt: "Team ready screen with a drafted XI on the pitch, player ratings and a squad average.",
      caption: "Chemistry counts your largest group of same-nation players.",
    },
    group: {
      alt: "Group stage table with your team, three AI opponents, points and goal difference.",
      caption: "Top two advance. Every team plays the others once.",
    },
    bracket: {
      alt: "Knockout bracket from the round of 16 to the final with simulated scores.",
      caption: "Win four ties to lift the cup.",
    },
    penalties: {
      alt: "Penalty shootout panel with five takers ranked by composure and finishing.",
      caption: "Level after extra time? Five kicks each, then sudden death.",
    },
    result: {
      alt: "Tournament result with placement and final score.",
      caption: "Replay any match or start a new draft.",
    },
    matchstats: {
      alt: "Match stats with goals, possession, shots, shots on target and expected goals.",
      caption: "Expected goals measures chance quality, not shot count.",
    },
    squadcard: {
      alt: "Expanded Spain 2010 squad card with formation, average rating and player ratings.",
      caption: "Open a squad to check shape, depth and the best player.",
    },
    history: {
      alt: "Match history list with saved tournament runs, results and win-draw-loss record.",
      caption: "Every finished run stays on your device.",
    },
    cover: {
      alt: "My World Cup XI formation picker with four World Cup XI shapes.",
    },
  },
  de: {
    formation: {
      alt: "Formationsauswahl mit vier WM-Elf-Formen: 4-3-3, 4-4-2, 3-5-2 und 4-2-3-1.",
      caption:
        "Wähle zuerst die Form. Sie legt fest, wie viele Verteidiger, Mittelfeldspieler und Stürmer du brauchst.",
    },
    draft: {
      alt: "Draft-Brett mit einem historischen Kader, offenen Plätzen und drei verbleibenden Neuwürfen.",
      caption:
        "Jede Runde bietet einen Kader, der einen offenen Platz füllen kann.",
    },
    chemistry: {
      alt: "Team-bereit-Ansicht mit gedrafteter Elf auf dem Platz, Spielerbewertungen und Durchschnittsnote.",
      caption: "Chemie zählt deine größte Gruppe gleicher Nation.",
    },
    group: {
      alt: "Gruppentabelle mit deinem Team, drei KI-Gegnern, Punkten und Tordifferenz.",
      caption: "Die Top zwei kommen weiter. Jeder spielt einmal gegen jeden.",
    },
    bracket: {
      alt: "K.-o.-Baum vom Achtelfinale bis zum Finale mit simulierten Ergebnissen.",
      caption: "Vier Siege bis zum Pokal.",
    },
    penalties: {
      alt: "Elfmeterschießen mit fünf Schützen, sortiert nach Nervenstärke und Abschluss.",
      caption: "Nach Verlängerung: fünf Schüsse pro Seite, dann Sudden Death.",
    },
    result: {
      alt: "Turnierergebnis mit Platzierung und Endstand.",
      caption: "Wiederhole jedes Spiel oder starte einen neuen Draft.",
    },
    matchstats: {
      alt: "Spielstatistik mit Toren, Ballbesitz, Schüssen, Schüssen aufs Tor und erwarteten Toren.",
      caption: "Erwartete Tore messen Chancenqualität, nicht Schusszahl.",
    },
    squadcard: {
      alt: "Geöffnete Kaderkarte Spanien 2010 mit Formation, Durchschnittsbewertung und Spielerbewertungen.",
      caption: "Öffne einen Kader für Form, Tiefe und besten Spieler.",
    },
    history: {
      alt: "Liste der Spielhistorie mit gespeicherten Turnieren, Ergebnissen und Sieg-Niederlage-Bilanz.",
      caption: "Jeder abgeschlossene Lauf bleibt auf deinem Gerät.",
    },
    cover: {
      alt: "Formationsauswahl von My World Cup XI mit vier WM-Elf-Formen.",
    },
  },
  fr: {
    formation: {
      alt: "Sélecteur de formation avec quatre formes de XI : 4-3-3, 4-4-2, 3-5-2 et 4-2-3-1.",
      caption:
        "Choisissez d'abord la forme. Elle fixe le nombre de défenseurs, milieux et attaquants.",
    },
    draft: {
      alt: "Plateau de draft avec un effectif historique, des postes ouverts et trois relances restantes.",
      caption:
        "Chaque tour propose un effectif capable de remplir un poste libre.",
    },
    chemistry: {
      alt: "Écran d'équipe prête avec un XI drafté sur le terrain, les notes des joueurs et la moyenne d'équipe.",
      caption:
        "La chimie compte votre plus grand groupe de joueurs d'une même nation.",
    },
    group: {
      alt: "Classement de groupe avec votre équipe, trois adversaires IA, points et différence de buts.",
      caption:
        "Les deux premiers passent. Chaque équipe joue une fois contre les autres.",
    },
    bracket: {
      alt: "Tableau à élimination des huitièmes à la finale avec les scores simulés.",
      caption: "Quatre tours à gagner pour soulever la coupe.",
    },
    penalties: {
      alt: "Séance de tirs au but avec cinq tireurs classés par sang-froid et finition.",
      caption: "Après la prolongation : cinq tirs chacun, puis mort subite.",
    },
    result: {
      alt: "Résultat du tournoi avec classement et score final.",
      caption: "Rejouez un match ou lancez un nouveau draft.",
    },
    matchstats: {
      alt: "Statistiques de match avec buts, possession, tirs, tirs cadrés et buts attendus.",
      caption:
        "Les buts attendus mesurent la qualité des occasions, pas le nombre de tirs.",
    },
    squadcard: {
      alt: "Fiche d'effectif Espagne 2010 ouverte avec formation, note moyenne et notes des joueurs.",
      caption:
        "Ouvrez un effectif pour voir la forme, la profondeur et le meilleur joueur.",
    },
    history: {
      alt: "Historique des matchs avec les tournois sauvegardés, les résultats et le bilan victoires-nuls-défaites.",
      caption: "Chaque partie terminée reste sur votre appareil.",
    },
    cover: {
      alt: "Sélecteur de formation de My World Cup XI avec quatre formes de XI.",
    },
  },
  ja: {
    formation: {
      alt: "4-3-3、4-4-2、3-5-2、4-2-3-1の4つのフォーメーションを選ぶ画面。",
      caption: "まず形を選びます。必要なDF、MF、FWの人数が決まります。",
    },
    draft: {
      alt: "歴代チーム、空きポジション、残り3回のリロールを示すドラフトボード。",
      caption:
        "各ラウンドでは、空きポジションを埋められるチームが1つ提示されます。",
    },
    chemistry: {
      alt: "ピッチ上のドラフトXI、選手評価、チーム平均を示すチーム準備画面。",
      caption: "ケミストリーは同じ国の選手の最大グループで決まります。",
    },
    group: {
      alt: "自分のチーム、AI相手3チーム、勝ち点、得失点差を示すグループ表。",
      caption: "上位2チームが通過。各チームが1回ずつ対戦します。",
    },
    bracket: {
      alt: "ラウンド16から決勝までの決勝トーナメント表とシミュレーション結果。",
      caption: "4つの勝負を制すれば優勝です。",
    },
    penalties: {
      alt: "冷静さとフィニッシュで並んだ5人のキッカーによるPK戦画面。",
      caption: "延長後も同点なら、各5本のPK、その後サドンデスです。",
    },
    result: {
      alt: "最終順位とスコアを示す大会結果画面。",
      caption: "試合を見返すか、新しいドラフトを始められます。",
    },
    matchstats: {
      alt: "ゴール、ポゼッション、シュート、枠内シュート、xGを示す試合統計。",
      caption: "xGはシュート数ではなく決定機の質を測ります。",
    },
    squadcard: {
      alt: "フォーメーション、平均評価、選手評価を示すスペイン2010の開いたチームカード。",
      caption: "チームを開いて形、層の厚さ、最高評価選手を確認できます。",
    },
    history: {
      alt: "保存された大会、結果、勝敗記録を示す試合履歴一覧。",
      caption: "終了した大会はすべて端末に残ります。",
    },
    cover: {
      alt: "4つのフォーメーションを選べるMy World Cup XIの画面。",
    },
  },
  es: {
    formation: {
      alt: "Selector de formación con cuatro formas de XI: 4-3-3, 4-4-2, 3-5-2 y 4-2-3-1.",
      caption:
        "Elige primero la forma. Fija cuántos defensas, medios y delanteros necesitas.",
    },
    draft: {
      alt: "Tablero de draft con una plantilla histórica, huecos abiertos y tres rerolls restantes.",
      caption: "Cada ronda ofrece una plantilla que puede cubrir un hueco.",
    },
    chemistry: {
      alt: "Pantalla de equipo listo con un XI drafteado en el campo, notas de jugadores y media del equipo.",
      caption:
        "La química cuenta tu grupo más grande de jugadores de la misma nación.",
    },
    group: {
      alt: "Tabla de grupo con tu equipo, tres rivales IA, puntos y diferencia de goles.",
      caption:
        "Los dos primeros avanzan. Todos juegan una vez contra los demás.",
    },
    bracket: {
      alt: "Cuadro eliminatorio de octavos a la final con resultados simulados.",
      caption: "Gana cuatro eliminatorias para levantar la copa.",
    },
    penalties: {
      alt: "Panel de penales con cinco lanzadores ordenados por sangre fría y definición.",
      caption:
        "Tras la prórroga: cinco penales por lado y luego muerte súbita.",
    },
    result: {
      alt: "Resultado del torneo con puesto y marcador final.",
      caption: "Repite cualquier partido o empieza otro draft.",
    },
    matchstats: {
      alt: "Estadísticas del partido con goles, posesión, tiros, tiros a puerta y goles esperados.",
      caption:
        "Los goles esperados miden la calidad de las ocasiones, no el número de tiros.",
    },
    squadcard: {
      alt: "Ficha abierta de España 2010 con formación, nota media y notas de los jugadores.",
      caption:
        "Abre una plantilla para ver forma, profundidad y mejor jugador.",
    },
    history: {
      alt: "Lista de historial con torneos guardados, resultados y balance de victorias, empates y derrotas.",
      caption: "Cada partida terminada se queda en tu dispositivo.",
    },
    cover: {
      alt: "Selector de formación de My World Cup XI con cuatro formas de XI.",
    },
  },
};

export interface DiagramCopy {
  aria: string;
  labels: string[];
}

/** Short labels for the inline diagrams. Visible text plus the aria summary. */
export const diagramCopy: Record<
  Locale,
  { pool: DiagramCopy; ratings: DiagramCopy }
> = {
  en: {
    pool: {
      aria: "Diagram: 77 draftable World Cup squads plus 9 AI group-stage teams equals 86 teams in the pool.",
      labels: [
        "77",
        "draftable squads",
        "9",
        "AI group-stage teams",
        "86",
        "teams in the pool",
      ],
    },
    ratings: {
      aria: "Diagram: 13 player attributes become one role-weighted overall rating.",
      labels: [
        "13 attributes",
        "role weights",
        "one overall rating",
        "Goalkeeping",
        "Defending",
        "Midfield",
        "Attacking",
      ],
    },
  },
  de: {
    pool: {
      aria: "Diagramm: 77 draftbare WM-Kader plus 9 KI-Gruppengegner ergeben 86 Teams im Pool.",
      labels: [
        "77",
        "draftbare Kader",
        "9",
        "KI-Gruppengegner",
        "86",
        "Teams im Pool",
      ],
    },
    ratings: {
      aria: "Diagramm: 13 Spielerattribute werden zu einer rollengewichteten Gesamtbewertung.",
      labels: [
        "13 Attribute",
        "Rollen-Gewichtung",
        "eine Gesamtbewertung",
        "Torwartspiel",
        "Verteidigung",
        "Mittelfeld",
        "Angriff",
      ],
    },
  },
  fr: {
    pool: {
      aria: "Schéma : 77 effectifs à drafter plus 9 adversaires IA de groupe donnent 86 équipes dans le pool.",
      labels: [
        "77",
        "effectifs à drafter",
        "9",
        "adversaires IA de groupe",
        "86",
        "équipes dans le pool",
      ],
    },
    ratings: {
      aria: "Schéma : 13 attributs de joueur deviennent une note globale pondérée par rôle.",
      labels: [
        "13 attributs",
        "pondération par rôle",
        "une note globale",
        "Gardien",
        "Défense",
        "Milieu",
        "Attaque",
      ],
    },
  },
  ja: {
    pool: {
      aria: "図：ドラフト可能なワールドカップ77チームとAIグループ相手9チームで、プール全体は86チームです。",
      labels: [
        "77",
        "ドラフト可能チーム",
        "9",
        "AIグループ相手",
        "86",
        "プール全体",
      ],
    },
    ratings: {
      aria: "図：13の選手能力値が、役割ごとの重みで1つの総合評価になります。",
      labels: [
        "13の能力値",
        "役割ごとの重み",
        "1つの総合評価",
        "GK",
        "守備",
        "中盤",
        "攻撃",
      ],
    },
  },
  es: {
    pool: {
      aria: "Diagrama: 77 plantillas drafteables del Mundial más 9 rivales IA de grupo dan 86 equipos en el pool.",
      labels: [
        "77",
        "plantillas drafteables",
        "9",
        "rivales IA de grupo",
        "86",
        "equipos en el pool",
      ],
    },
    ratings: {
      aria: "Diagrama: 13 atributos del jugador se convierten en una valoración global ponderada por rol.",
      labels: [
        "13 atributos",
        "pesos por rol",
        "una valoración global",
        "Portería",
        "Defensa",
        "Medio",
        "Ataque",
      ],
    },
  },
};
