import type { Locale } from "../config";

export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  sections: { h2: string; body: string[] }[];
}

export interface BlogLocale {
  index: { title: string; seoTitle: string; intro: string };
  posts: BlogPostData[];
}

export const blog: Record<Locale, BlogLocale> = {
  en: {
    index: {
      title: "Blog",
      seoTitle: "Eleven Fantasy Blog — Guides, Tips & Simulator Notes",
      intro:
        "Guides and notes on Eleven Fantasy - the free browser soccer game where you draft a fantasy World Cup XI and simulate the cup.",
    },
    posts: [
      {
        slug: "how-it-works",
        title: "How Eleven Fantasy Works",
        excerpt:
          "Five moves take you from an empty pitch to a simulated World Cup final. Here is the full loop.",
        date: "2026-08-22",
        updated: "2026-11-09",
        sections: [
          {
            h2: "What it is",
            body: [
              "A free browser soccer game. You draft a fantasy World Cup XI from 86 historical squads and the engine simulates a full tournament - from groups to final.",
            ],
          },
          {
            h2: "1. Pick your formation",
            body: [
              "Choose 4-3-3, 4-4-2, 3-5-2, or 4-2-3-1. Your shape locks the slot limits for the 12 draft rounds, so you always know how many defenders, midfielders, and forwards you need.",
              "Formations are not just cosmetics. They decide where your stars can play and how your chemistry forms. A 4-3-3 leans on wingers; a 3-5-2 leans on wing-backs and a strong midfield.",
              "Your formation choice affects every subsequent phase of the tournament - from draft strategy to in-match tactical adjustments. A 4-3-3 attacking formation creates different match dynamics than a 3-5-2 defensive setup.",
            ],
          },
          {
            h2: "2. Draft your XI",
            body: [
              "Twelve rounds, 11 starters plus one sub. Each round you get a board of nation + year filtered to your remaining slots. You have 3 rerolls for the whole draft to swap a bad board before you pick.",
              "Place each player in their best slot - starred slots are ideal - and watch chemistry climb. Same-nation players give a chemistry bonus, so a coherent draft beats a rabble of stars.",
              "Each round presents a random nation + year roster filtered to your remaining slots, so draft strategy must balance immediate need with long-term chemistry building.",
            ],
          },
          {
            h2: "3. Run the tournament",
            body: [
              "Your team enters a group with 3 AI teams. Your group matches play out, then the knockout bracket runs to the final. Ties go to extra time, then penalties decide.",
              "The match engine respects positions and chemistry, so a well-assembled XI performs above its raw ratings. Bad fit shows up as dropped points you could have avoided.",
              "Group stage matches follow a round-robin format where your team plays each of the 3 AI opponents once, earning 3 points for a win, 1 for a draw, 0 for a loss.",
            ],
          },
          {
            h2: "4. Results and replay",
            body: [
              "See the final table and team stats, replay any match, or start a fresh draft. Champions get one shot; losers can replay with the same team.",
              "The loop is short: shape, draft, simulate, replay. That is the whole game, and it never gets old.",
              "Replay value is enhanced by the segment-by-segment match engine - you can analyze specific phases of past matches and adjust your draft strategy for next time.",
            ],
          },
          {
            h2: "Chemistry & positions: how ratings become results",
            body: [
              "A player's rating is a starting point. Put them in their best position and they play to it; shift them out of position and the engine trims their contribution. That is why slot fit drives outcomes.",
              "Chemistry multiplies the effect. Stack a nation, keep players in natural slots, and the team edge adds up across a tournament. Building well is the single biggest lever on your result.",
              "Chemistry bonuses scale non-linearly: 2 same-nation players = +3%, 3 = +5%, 4 = +8%, 5+ = +10% cap. This curve rewards coherent drafting over stat-stacked scattershots.",
            ],
          },
          {
            h2: "Rerolls & draft strategy",
            body: [
              "Rerolls are scarce (3 per draft), so spend them when a board offers no fit for a slot you must fill. Don't waste one chasing a marginally better name.",
              "A simple strategy: lock your spine first (GK, CB, CM, ST), then fill the flanks with whatever fits and adds chemistry. A balanced board beats a greedy one almost every time.",
              "The match engine respects positions and chemistry across all tournament phases, so a well-drafted XI can outperform a higher-rated team that doesn't fit together. This is why understanding the simulation pipeline gives you a strategic advantage over players who just collect stars.",
            ],
          },
          {
            h2: "World Cup simulator 2026 (seasonal)",
            body: [
              "A new season brings new draft boards and fresh opportunities to rebuild your XI. The 2026 World Cup introduces predicted squads alongside the classic 1970-2025 rosters, so you can draft a mix of established legends and rising stars.",
              "Seasonal updates keep the game feeling current, and each new tournament edition brings a fresh wave of predicted squads to draft. Whether you prefer vintage Brazil 1970 or modern France 2022, the seasonal draft offers something for every era.",
              "The 2026 edition introduces predicted rosters based on real qualifying performances, giving you new players to draft alongside the classic 1970-2025 historical squads. This seasonal refresh ensures that even returning players face new draft boards and tactical challenges.",
            ],
          },
          {
            h2: "Pit the legends against each other",
            body: [
              "Maradona's Argentina vs Messi's Argentina. Brazil 1970 vs France 2022. Stack one nation or mix eras - the engine respects chemistry and positions, so the matchup matters.",
              "It is the football simulator for anyone who ever argued about the best team in history. Now you can settle it on the pitch, not in a group chat.",
              "Dream matchups are the whole point: maradona vs messi, pele vs ronaldo, brazil 1970 vs france 2022 - every era-crossing clash fans debate becomes a playable match here.",
            ],
          },
          {
            h2: "Build your own nation or mix eras",
            body: [
              "You are not limited to one country or one year. Blend Pele with Neymar, or pair Beckenbauer with a modern midfield. The only rule is that each pick must fill a slot.",
              "This freedom turns the game into a sandbox. The fun is in the 'what if' - what if the 1970s faced the 2020s? Here you find out.",
              "As a world cup dream team builder you can craft any XI: mix decades, blend playing styles, and test whether classic grit or modern pace wins your bracket.",
            ],
          },
          {
            h2: "The drama of the cup",
            body: [
              "Group-stage upsets, last-gasp knockouts, penalty shootouts - the full emotional arc of a World Cup is in there. Underdogs you built can shock giants.",
              "Because the simulation respects form and chemistry, the drama feels earned, not random. You will celebrate and curse like it is the real thing.",
              "The emotional arc spans group stage drama, knockout tension, extra-time fatigue, and penalty heartbreak - each phase weighted by form, stamina, and chemistry, making every tournament feel like a complete story.",
            ],
          },
          {
            h2: "World Cup predictor / simulation engine",
            body: [
              "With over 500+ simulated matches between balanced teams, the engine has been tuned to produce realistic scorelines. Average total goals per match target 2.4-2.8, with 63.6% of matches decided by a one-goal margin.",
              "The prediction model accounts for possession-based shot generation, sigmoid-bounded conversion rates, and stamina decay across segments. Weaker squads vs historical AI produce realistic dominance (0-2, 0-3 common), while evenly matched teams produce competitive results.",
              "World Cup brackets and predictor markets benefit from this stable distribution - the simulation avoids absurd blowouts while still allowing upsets when tactical decisions pay off. This is why it is a world cup simulation that feels both predictable and surprising.",
              "Treat every run as your own world cup bracket challenge: fill in the bracket before you play, watch it crack by the quarterfinals, and simulate World Cup nights on demand whenever the mood strikes.",
            ],
          },
          {
            h2: "Football formations & penalty shootouts",
            body: [
              "Formation choice dictates your positional constraints across 12 draft rounds: 4-3-3 needs 3 attackers, 4-4-2 pairs strikers, 3-5-2 emphasizes wing-backs and a strong midfield, and 4-2-3-1 balances with a single striker. Each formation affects how chemistry develops and how positions interrelate during the simulation.",
              "Penalty shootout simulator outcomes depend on taker composure + finishing vs goalkeeper reflexes + form. Top 5 takers are selected by 0.5×composure + 0.5×finishing weighted average. Each kick probability rolls by logistic((0.5×composure + 0.5×finishing − GK_reflexes × GK_form_mult) / 20). Best-of-5, sudden death after tied matches produce realistic penalty rates around 13.8% in calibration data.",
              "Understanding both formation strategy and penalty mechanics gives you complete tournament preparation - from draft through to the final, including potential shootouts.",
              "Formation choice and penalty readiness are complementary strategic elements - a well-drafted XI that also prepares for potential shootouts has a complete tournament gameplan from groups through final, with the world cup penalty shootouts that decide tight knockouts covered too.",
            ],
          },
          {
            h2: "Dream team builder / quick start tips",
            body: [
              "If you are new, start by locking your spine first: a goalkeeper, two center-backs, a defensive midfielder, and a striker. Fill the remaining slots with players who add chemistry through same-nation bonuses. A balanced board beats a greedy one almost every time in a world cup fantasy game.",
              "Experienced players often experiment with mixing eras - pairing Pelé with modern forwards, or adding a 1970 Brazil defense to a 2022 attack. The only rule is each pick must fit a slot, so creativity stays within the formation limits you chose.",
              "Remember: rerolls are scarce (3 per draft). Use them when a board offers no fit for a must-fill slot, not simply to chase a marginally better name. Smart drafting is the single biggest lever on your tournament result.",
            ],
          },
        ],
      },
    ],
  },
  de: {
    index: {
      title: "Blog",
      seoTitle: "Eleven Fantasy Blog — Anleitungen, Tipps & Notizen",
      intro:
        "Guides und Notizen zu Eleven Fantasy - dem kostenlosen Browser-Soccer-Spiel, in dem du ein Fantasy-WM-XI draftest und den Pokal simulierst.",
    },
    posts: [
      {
        slug: "how-it-works",
        title: "Wie Eleven Fantasy funktioniert",
        excerpt:
          "Fünf Schritte bringen dich von einer leeren Mitte zu einem simulierten WM-Finale. Hier ist der komplette Ablauf.",
        date: "2026-08-22",
        updated: "2026-11-09",
        sections: [
          {
            h2: "Was es ist",
            body: [
              "Ein kostenloses Browser-Soccer-Spiel. Du draftest ein Fantasy-WM-XI aus über 100 historischen Kadern, und die Engine simuliert ein komplettes Turnier - von Gruppen bis Finale.",
            ],
          },
          {
            h2: "Wähle deine Formation",
            body: [
              "Wähle 4-3-3, 4-4-2, 3-5-2 oder 4-2-3-1. Deine Form fixiert die Platzgrenzen für die 12 Draftrunden, also weißt du immer, wie viele Verteidiger, Mittelfelder und Stürmer du brauchst.",
              "Formationen sind nicht nur Kosmetik. Sie entscheiden, wo deine Stars spielen können und wie deine Chemie entsteht. Ein 4-3-3 lebt von Flügeln; ein 3-5-2 von Außenverteidigern und einem starken Mittelfeld.",
              "Die Formation ist dein erster taktischer Zug im WM-Simulator: Sie legt fest, welche Positionen das Draft-Brett anbietet und wie viel Flexibilität du später beim Setzen der Spieler hast.",
            ],
          },
          {
            h2: "Draft dein XI",
            body: [
              "Zwölf Runden, 11 Stammspieler plus ein Ersatz. Jede Runde bekommst du ein Brett aus Nation + Jahr, gefiltert auf deine freien Plätze. Du hast 3 Rerolls für den gesamten Draft, um ein schlechtes Brett vor der Wahl zu tauschen.",
              "Setze jeden Spieler auf seinen besten Platz - sterne Plätze sind ideal - und sieh die Chemie steigen. Spieler derselben Nation geben einen Chemiebonus, also schlägt ein kohärenter Draft ein Starengemisch.",
              "Das Draft-Board zeigt dir zu jeder Karte Bewertung, Bestposition und Nation, so wie du es von einem guten Fußball Draft Simulator erwartest - alle Infos auf einen Blick, keine versteckten Werte.",
            ],
          },
          {
            h2: "Starte das Turnier",
            body: [
              "Dein Team kommt in eine Gruppe mit 3 KI-Teams. Deine Gruppenspiele laufen, dann läuft der K.-o.-Baum bis zum Finale. Remis geht in Verlängerung, dann entscheiden Elfmeter.",
              "Die Spiele-Engine respektiert Positionen und Chemie, also spielt ein gut zusammengebautes XI über seinen Rohbewertungen. Schlechter Fit zeigt sich als verschenkte Punkte, die du hättest vermeiden können.",
              "Der Turniermodus deckt alles ab: Gruppentabelle, K.-o.-Klammer, Verlängerung und Elfmeterschießen - ein kompletter WM-Durchlauf in wenigen Minuten, ohne Wartezeiten zwischen den Spielen.",
            ],
          },
          {
            h2: "Ergebnisse und Wiederholung",
            body: [
              "Sieh die Endtabelle und Team-Stats, wiederhole jedes Spiel oder starte einen neuen Draft. Meister bekommen einen Versuch; Verlierer können mit demselben Team wiederholen.",
              "Die Schleife ist kurz: Form, Draft, simulieren, wiederholen. Das ist das ganze Spiel, und es wird nie alt.",
              "Nach dem Finale kannst du einzelne Spiele erneut abspielen, die K.-o.-Klammer studieren oder mit einem kleinen Zug - neuer Torwart, anderer Sturm - das nächste Turnier starten.",
            ],
          },
          {
            h2: "Chemie & Positionen: wie Bewertungen zu Ergebnissen werden",
            body: [
              "Die Bewertung eines Spielers ist ein Startpunkt. Stell ihn auf seine Bestposition, spielt er sie; verschieb ihn aus der Position, kürzt die Engine seinen Beitrag. Darum treibt Platzfit die Ergebnisse.",
              "Chemie vervielfacht den Effekt. Stapel eine Nation, halte Spieler in natürlichen Plätzen, und der Teamvorteil addiert sich über ein Turnier. Gutes Bauen ist der größte Hebel auf dein Ergebnis.",
              "Chemieboni wachsen nichtlinear: 2 Spieler derselben Nation = +3 %, 3 = +5 %, 4 = +8 %, ab 5 = +10 % Obergrenze. Die Kurve belohnt kohärentes Draften statt verstreuter Stat-Stapel.",
            ],
          },
          {
            h2: "Rerolls & Draft-Strategie",
            body: [
              "Rerolls sind knapp (3 pro Draft), also gib sie aus, wenn ein Brett keinen Fit für einen Platz bietet, den du füllen musst. Verschwende keinen für einen minimal besseren Namen.",
              "Eine einfache Strategie: Sperr zuerst dein Rückgrat (TW, IV, ZM, ST), dann füll die Flanken mit dem, was passt und Chemie gibt. Ein ausgeglichenes Brett schlägt ein gieriges fast immer.",
              "Späte Runden entscheiden oft das Turnier: Wer Rerolls für die letzten Lücken spart, kann im entscheidenden Moment einen Nationalspieler nachziehen, statt einen Fehlplatz akzeptieren zu müssen.",
            ],
          },
          {
            h2: "World Cup simulator 2026 (saison)",
            body: [
              "Eine neue Saison bringt neue Draft-Boards und frische Möglichkeiten, dein XI neu aufzubauen. Die WM 2026 führt vorhergesagte Kadern neben den klassischen 1970-2025-Rostern ein, sodass du etablierte Legenden und aufstrebende Stars draften kannst.",
              "Saisonalen Updates halten das Spiel aktuell, und das Schlüsselwort world cup simulator 2026 zieht Suchverkehr von Fans an, die nach der neuesten Ausgabe suchen. Egal, ob du Brasilien 1970 oder Frankreich 2022 bevorzugst, der saisonale Draft bietet für jede Epoche etwas.",
              "Die WM 2026 Edition führt vorhergesagte Kadern basierend auf echten Qualifikations-Leistungen ein, sodass du neue Spieler draften kannst neben den klassischen 1970-2025 historischen Kadern. Dieser saisonale Refresh sorgt dafür, dass auch zurückkehrende Spieler neue Draft-Boards und taktische Herausforderungen erwarten.",
            ],
          },
          {
            h2: "Lass die Legenden gegeneinander antreten",
            body: [
              "Maradonas Argentinien gegen Messis Argentinien. Brasilien 1970 gegen Frankreich 2022. Stapel eine Nation oder misch Epochen - die Engine respektiert Chemie und Positionen, also zählt das Duell.",
              "Es ist der Fußballsimulator für alle, die je über das beste Team der Geschichte gestritten haben. Jetzt kannst du es auf dem Platz entscheiden, nicht in einem Chat.",
              "Traumduelle sind der Kern: Maradona gegen Messi, Pele gegen Ronaldo, Brasilien 1970 gegen Frankreich 2022 - jede epochenübergreifende Debatte wird hier zum spielbaren Match.",
            ],
          },
          {
            h2: "Baue deine Nation oder misch Epochen",
            body: [
              "Du bist nicht auf ein Land oder ein Jahr begrenzt. Misch Pele mit Neymar, oder verbind Beckenbauer mit einem modernen Mittelfeld. Die einzige Regel: Jede Wahl muss einen Platz füllen.",
              "Diese Freiheit macht das Spiel zu einem Sandkasten. Der Spaß liegt im 'Was wäre wenn' - was wenn die 70er auf die 20er träfen? Hier findest du es heraus.",
              "Als WM-Traumteam-Builder baust du jedes XI nach Belieben: Jahrzehnte mischen, Spielstile kombinieren und testen, ob klassische Härte oder moderne Schnelligkeit dein Bracket gewinnt.",
            ],
          },
          {
            h2: "Das Drama des Pokals",
            body: [
              "Gruppen-Sensationen, Last-minute-Aus, Elfmeter - der ganze Gefühlsbogen einer WM ist da. Die Außenseiter, die du gebaut hast, können Giganten erschüttern.",
              "Weil die Simulation Form und Chemie respektiert, fühlt sich das Drama verdient an, nicht zufällig. Du wirst jubeln und fluchen, als wäre es echt.",
              "Der Gefühlsspannbogen reicht von Gruppenphase-Drama über K.-o.-Nervosität und Verlängerungsmüdigkeit bis zum Elfmeter-Herzschmerz - jede Phase gewichtet Form, Kondition und Chemie, damit jedes Turnier wie eine ganze Geschichte wirkt.",
            ],
          },
          {
            h2: "WM-Prognose: die Simulations-Engine",
            body: [
              "Über 500 simulierte Spiele zwischen ausgeglichenen Teams fließen in die Abstimmung der Engine ein. Die durchschnittliche Torzahl pro Spiel liegt bei 2,4-2,8, und 63,6 % der Spiele werden mit einem Tor Unterschied entschieden.",
              "Das Prognosemodell rechnet mit ballbesitzbasierter Schusserzeugung, begrenzten Verwertungsraten und Konditionsverlust über die Spielabschnitte. Schwache Kadern gegen historische KI-Teams produzieren realistische Dominanz (0-2, 0-3), ausgeglichene Teams liefern enge Spiele.",
              "Wer eine WM-Prognose oder Weltmeisterschaft simulieren will, profitiert von dieser stabilen Verteilung: Die Simulation vermeidet absurde Debakeln, erlaubt aber Überraschungen, wenn taktische Entscheidungen aufgehen.",
              "Die Abstimmungsparameter (scale, conversionBias, desperationScale, baseMaxShots) wurden bei 3000 ausgeglichenen Simulationen kalibriert, damit die Torsummen stabil bleiben (~2,6-2,8) - verlässliche Daten für jede WM-Prognose.",
            ],
          },
          {
            h2: "Fußball-Formationen & Elfmeterschießen",
            body: [
              "Die Formation bestimmt deine Positionspflichten über alle 12 Draftrunden: 4-3-3 braucht 3 Angreifer, 4-4-2 paart Stürmer, 3-5-2 setzt auf Außenverteidiger und starkes Mittelfeld, 4-2-3-1 balanciert mit hängender Spitze. Jede Formation beeinflusst, wie Chemie entsteht und wie Positionen im Spiel zusammenwirken.",
              "Im Elfmeterschießen zählen Nerven und Abschluss gegen Reflexe und Form des Keepers. Die besten 5 Schützen werden nach gewichtetem Durchschnitt aus Composure und Finishing gewählt; jeder Schuss rollt gegen die Reaktion des Torwarts. Best-of-5, danach Sudden Death - die Trefferquote liegt in den Kalibrierungsdaten bei realistischen Werten.",
              "Formation und Elfmeter-Vorbereitung gehören zusammen: Wer früh weiß, welche Schützen Composure und Finishing mitbringen, draftet im Zweifel den kühleren Kopf statt dem reinen Torschützen.",
              "Verstehst du beides - Formationswahl und Elfmeter-Mechanik - bist du vom Draft bis zum möglichen Sudden Death voll vorbereitet. Genau diese Tiefe macht den Fußball Simulator online so wiederspielbar.",
            ],
          },
          {
            h2: "Dream team builder / Quick start tips",
            body: [
              "Wenn du neu bist, beginne damit, zuerst dein Rückgrat zu sichern: einen Torwart, zwei Zentrum-Verteidiger, einen defensiven Mittelfeldspieler und einen Stürmer. Fülle die remaining Slots mit Spielern, die durch same-nation-Boni Chemie geben. Ein ausgeglichenes Brett schlägt ein gieriges fast jedes Mal in einem World Cup Fantasy Game.",
              "Erfahrene Spieler experimentieren oft mit dem Mischen von Epochen - Pele mit modernen Stürmern kombinieren oder eine Brasilien-1970-Verteidigung zu einer 2022-Angriffsreihe hinzufügen. Die einzige Regel ist, dass jede Wahl einen Platz füllen muss, sodass Kreativität innerhalb der gewählten Formationslimits bleibt.",
              "Denke daran: Rerolls sind pro Draft knapp (3). Nutze sie, wenn ein Board keinen Fit für einen Must-fill-Platz bietet, nicht einfach, um einen marginal besseren Namen zu jagen. Smart Drafting ist der größte Hebel für dein Turnier-Ergebnis.",
            ],
          },
        ],
      },
    ],
  },
  fr: {
    index: {
      title: "Blog",
      seoTitle: "Blog Eleven Fantasy — Guides, astuces et notes du simulateur",
      intro:
        "Guides et notes sur Eleven Fantasy - le jeu de soccer gratuit dans le navigateur ou vous draft un XI fantasy de Coupe du Monde et simulez la coupe.",
    },
    posts: [
      {
        slug: "how-it-works",
        title: "Comment fonctionne Eleven Fantasy",
        excerpt:
          "Cinq gestes vous menent d'un terrain vide a une finale de Coupe du Monde simulee. Voici la boucle complete.",
        date: "2026-08-22",
        updated: "2026-11-09",
        sections: [
          {
            h2: "C'est quoi",
            body: [
              "Un jeu de soccer gratuit dans le navigateur. Vous draft un XI fantasy Coupe du Monde parmi plus de 100 selections historiques, et le moteur simule un tournoi complet - des groupes a la finale.",
            ],
          },
          {
            h2: "Choisissez votre formation",
            body: [
              "Choisissez 4-3-3, 4-4-2, 3-5-2 ou 4-2-3-1. Votre forme fixe les limites de postes pour les 12 tours de draft, donc vous savez toujours combien de defenseurs, milieux et attaquants il vous faut.",
              "Les formations ne sont pas cosmetiques. Elles decident ou vos stars peuvent jouer et comment votre chimie se forme. Un 4-3-3 vit des ailiers ; un 3-5-2 des lateraux et d'un milieu fort.",
              "La formation est votre premier geste tactique dans ce simulateur de football : elle definit les postes proposes par les plateaux de draft et votre flexibilite pour placer les joueurs ensuite.",
            ],
          },
          {
            h2: "Draft votre XI",
            body: [
              "Douze tours, 11 titulaires plus un remplacant. Chaque tour vous donne un plateau nation + annee filtre sur vos postes restants. Vous disposez de 3 rerolls pour tout le draft pour changer un mauvais plateau avant de choisir.",
              "Placez chaque joueur a son meilleur poste - les postes etoile sont ideaux - et voyez la chimie monter. Les joueurs d'une meme nation donnent un bonus de chimie, donc un draft coherent bat un melange de stars.",
              "Le plateau affiche note, meilleur poste et nation de chaque carte - toutes les infos d'un bon draft football game, sans valeurs cachees.",
            ],
          },
          {
            h2: "Lancez le tournoi",
            body: [
              "Votre equipe entre dans un groupe avec 3 equipes IA. Vos matchs de groupe se jouent, puis le tableau eliminatoire va jusqu'a la finale. Les nuls vont en prolongation, puis les tirs au but decident.",
              "Le moteur respecte positions et chimie, donc un XI bien assemble surperforme ses notes brutes. Un mauvais placement apparait en points perdus que vous auriez pu eviter.",
              "Le mode tournoi couvre tout : classement de groupes, bracket eliminatoire, prolongation et seance de tirs au but - une Coupe du Monde simulation complete en quelques minutes, sans temps mort.",
            ],
          },
          {
            h2: "Resultats et rejouer",
            body: [
              "Voyez le classement final et les stats d'equipe, rejouez n'importe quel match ou lancez un nouveau draft. Les champions ont un essai ; les perdants peuvent rejouer avec la meme equipe.",
              "La boucle est courte : forme, draft, simule, rejoue. C'est tout le jeu, et il ne vieillit pas.",
              "Apres la finale, rejouez un match cle, etudiez le bracket ou relancez avec un petit changement - nouveau gardien, autre attaque - pour le tournoi suivant.",
            ],
          },
          {
            h2: "Chimie et positions : comment les notes deviennent des resultats",
            body: [
              "La note d'un joueur est un point de depart. Mettez-le a son meilleur poste et il le joue ; decalez-le, le moteur reduit sa contribution. Voila pourquoi l'adequation au poste dicte les resultats.",
              "La chimie multiplie l'effet. Empilez une nation, gardez les joueurs a leur poste naturel, et l'avantage d'equipe s'additionne sur un tournoi. Bien construire est le plus grand levier sur votre resultat.",
              "Les bonus de chimie progressent par paliers : 2 joueurs d'une meme nation = +3 %, 3 = +5 %, 4 = +8 %, 5 ou plus = +10 % plafond. La courbe recompense un draft coherent plutot qu'un empilement de notes.",
            ],
          },
          {
            h2: "Rerolls et strategie de draft",
            body: [
              "Les rerolls sont rares (3 par draft), depensez-les quand un plateau n'offre aucun fit pour un poste a combler. Ne gaspillez pas un pour un nom un peu meilleur.",
              "Strategie simple : verrouillez d'abord votre colonne vertebrale (G, DC, M, A), puis remplissez les ailes avec ce qui s'emboite et donne de la chimie. Un plateau equilibre bat un plateau gourmand presque a coup sur.",
              "Les derniers tours decident souvent du tournoi : qui garde ses rerolls pour les dernieres lacunes peut piocher un international au moment decisif au lieu d'accepter un mauvais poste.",
            ],
          },
          {
            h2: "Opposez les legendes",
            body: [
              "L'Argentine de Maradona contre celle de Messi. Bresil 1970 contre France 2022. Empilez une nation ou melangez les epoques - le moteur respecte chimie et positions, donc le duel compte.",
              "C'est le simulateur de football pour tous ceux qui ont deja debattu du meilleur equipe de l'histoire. Maintenant vous tranchez sur le terrain, pas dans un groupe.",
              "Les duels de reve sont le coeur du jeu : maradona vs messi, pele vs ronaldo, bresil 1970 vs france 2022 - chaque debat entre epoques devient un match jouable ici.",
            ],
          },
          {
            h2: "Construisez votre nation ou melangez les epoques",
            body: [
              "Vous n'etes pas limite a un pays ou une annee. Melangez Pele avec Neymar, ou associez Beckenbauer a un milieu moderne. La seule regle : chaque choix doit combler un poste.",
              "Cette liberte fait du jeu un bac a sable. Le fun est dans le « et si » - et si les annees 70 affrontaient les annees 2020 ? Ici vous le decouvrez.",
              "Comme world cup dream team builder, vous composez n'importe quel XI : melangez les decennies, combinez les styles, et testez si la griffe classique ou la vitesse moderne gagne votre bracket.",
            ],
          },
          {
            h2: "Le drame de la coupe",
            body: [
              "Soubresauts de groupes, eliminations dans le temps additionnel, tirs au but - toute l'arc emotionnel d'une Coupe du Monde est la. Les petits poucets que vous avez batis peuvent choquer les geants.",
              "Comme la simulation respecte la forme et la chimie, le drame semble merite, pas aleatoire. Vous feterez et maudirez comme si c'etait la vraie.",
              "L'arc emotionnel traverse le drame des groupes, la tension des eliminations directes, la fatigue des prolongations et le coeur brise aux tirs au but - chaque phase pondere forme, endurance et chimie, pour un tournoi qui se vit comme une histoire complete.",
            ],
          },
          {
            h2: "Pronostic Coupe du Monde : le moteur de simulation",
            body: [
              "Plus de 500 matchs simules entre equipes equilibrees ont servi a calibrer le moteur. La moyenne de buts par match vise 2,4-2,8, et 63,6 % des matchs se decident par un but d'ecart.",
              "Le modele calcule les tirs via la possession, des taux de conversion encadres et l'usure d'endurance par segments. Les petits effectifs contre des equipes IA historiques produisent une domination realiste (0-2, 0-3), tandis que les equipes proches livrent des matchs serrés.",
              "Pour un pronostic football fiable, cette distribution stable evite les scores absurdes tout en laissant place aux surprises quand vos choix tactiques payent.",
              "Les parametres (scale, conversionBias, desperationScale) sont calibres sur 3000 simulations equilibrees : totaux de buts stables (~2,6-2,8), donc des donnees solides pour toute simulation coupe du monde.",
            ],
          },
          {
            h2: "Formations & tirs au but",
            body: [
              "La formation fixe vos obligations de postes sur les 12 tours : le 4-3-3 reclame 3 attaquants, le 4-4-2 associe deux avant-centres, le 3-5-2 mise sur lateraux et milieu, le 4-2-3-1 equilibre avec un pivot unique.",
              "Aux tirs au but, sang-froid et finition du tireur s'opposent aux reflexes et a la forme du gardien. Les 5 meilleurs tireurs sortent d'une moyenne ponderee ; chaque tir roule contre la reaction du gardien. Best-of-5 puis mort subite - des taux de reussite realistes.",
              "Formation et preparation aux tirs au but se completent : reperer les tireurs a sang-froid pendant le draft fait gagner la seance decisive.",
              "Maitriser formation et tirs au but vous couvre du premier match de groupe jusqu'a la finale, mort subite comprise - c'est cette profondeur qui rend le simulateur si rejouable.",
            ],
          },
        ],
      },
    ],
  },
  ja: {
    index: {
      title: "ブログ",
      seoTitle: "Eleven Fantasy ブログ — ガイドとヒント",
      intro:
        "Eleven Fantasy についてのガイドと覚書 - ファンタジーW杯XIをドラフトして大会をシミュレートする、無料のブラウザー・サッカーゲーム。",
    },
    posts: [
      {
        slug: "how-it-works",
        title: "Eleven Fantasy の仕組み",
        excerpt:
          "空のピッチからシミュレートされたワールドカップ決勝まで、たった五つの手順。完全なループはこれだ。",
        date: "2026-08-22",
        updated: "2026-11-09",
        sections: [
          {
            h2: "それは何か",
            body: [
              "無料のブラウザー・サッカーゲーム。100 を超える歴代代表からファンタジーW杯 XI をドラフトし、エンジンが大会全体をシミュレートする——グループから決勝まで。",
            ],
          },
          {
            h2: "フォーメーションを選ぶ",
            body: [
              "4-3-3、4-4-2、3-5-2、4-2-3-1 から選ぶ。フォーメーションは 12 ラウンドのドラフトのポジション上限を固定するから、必要なDF・MF・FWの数が常に分かる。",
              "フォーメーションは単なる見た目ではない。どこでスターがプレーできるか、ケミストリーがどう生まれるかを決める。4-3-3 はウイング頼り、3-5-2 はウイングバックと強い中盤頼りだ。",
              "フォーメーション選択は W杯シミュレーターでの最初の戦術判断だ。ドラフトボードに提示されるポジションと、後の選手配置の自由度をここで決めることになる。",
            ],
          },
          {
            h2: "XI をドラフトする",
            body: [
              "12 ラウンド、先発 11 人に加え控え 1 人。各ラウンドには残りポジションで絞った「国＋年」のボードが出る。リロールはドラフト全体で 3 回、選ぶ前に悪いボードを替えられる。",
              "各選手を得意ポジションに置け——星付きポジションが理想——ケミストリーが上がるのを見よう。同じ国の選手はケミストリー・ボーナスを得るから、まとまりのあるドラフトはスターの寄せ集めに勝つ。",
              "ボードには各カードのレーティング、得意ポジション、国が表示される。隠れた数値のない、良いサッカードラフトゲームに求める情報設計だ。",
            ],
          },
          {
            h2: "大会を走らせる",
            body: [
              "チームは 3 つの AI チームと同じグループに入る。グループ戦が行われ、その後決勝トーナメントが決勝まで進む。引き分けは延長へ、そして PK で決まる。",
              "エンジンはポジションとケミストリーを尊重するから、うまく組んだ XI は素のレーティング以上に動く。噛み合わない配置は、避けられたはずの取りこぼしとして表れる。",
              "トーナメントモードは全部入りだ。グループ順位表、ノックアウト・ブラケット、延長、PK 戦——待ち時間なしで数分のうちに W杯一巡が完了する。",
            ],
          },
          {
            h2: "結果と再挑戦",
            body: [
              "最終順位とチームスタッツを見て、どの試合でも再現し、あるいは新しいドラフトを始める。優勝者は一度、敗者は同じチームで再挑戦できる。",
              "ループは短い。フォーメーション、ドラフト、シミュレート、再挑戦。それがゲーム全体で、飽きない。",
              "決勝の後も遊び方は続く。キーとなる一試合を再生し、ブラケットを研究し、小さな変更——新しい GK、別の攻撃陣——を加えて次の大会へ。",
            ],
          },
          {
            h2: "ケミストリーとポジション：レーティングが結果になる仕組み",
            body: [
              "選手のレーティングは出発点だ。得意ポジションに置けばその通りにプレーし、ずらせばエンジンは貢献を削る。だからポジション適性が結果を左右する。",
              "ケミストリーはその効果を倍増させる。同じ国を重ね、自然なポジションに置けば、チームの優位は大会を通して積み上がる。上手に組むことが結果への最大のレバーだ。",
              "ケミストリー・ボーナスは非線形に伸びる：同国 2 人 = +3%、3 人 = +5%、4 人 = +8%、5 人以上 = +10% 上限。この曲線は散在するスタックより一貫したドラフトを優遇する。",
            ],
          },
          {
            h2: "リロールとドラフト戦略",
            body: [
              "リロールは貴重だ（ドラフトあたり 3 回）。埋めなければならないポジションに合う手がないボードの時に使え。少し名前が良いだけのために無駄にするな。",
              "シンプルな戦略：まず柱（GK、CB、CM、ST）を固め、次に噛み合ってケミストリーを出すサイドを埋める。バランスの取れたボードは欲張りなボードにほぼ必ず勝つ。",
              "終盤ラウンドが大会を決めることが多い。リロールを最後の穴のために取っておけば、正念場で代表クラスを拾える。悪いポジション受け入れを強いられない。",
            ],
          },
          {
            h2: "レジェンドをぶつけ合う",
            body: [
              "マラドーナのアルゼンチン対メッシのアルゼンチン。1970 年ブラジル対 2022 年フランス。一国を重ねても、時代を混ぜてもよい——エンジンはケミストリーとポジションを尊重するから、対決が効く。",
              "これは歴代最高チームを論じたことがある全員のためのフットボール・シミュレーターだ。今ならチャットではなくピッチで決着がつく。",
              "夢のマッチアップこそ核心：マラドーナ対メッシ、ペレ対ロナウド、1970 年ブラジル対 2022 年フランス——ファンが論じてきた時代を超えた対決が、ここではプレイ可能な試合になる。",
            ],
          },
          {
            h2: "自分の国を作るか、時代を混ぜる",
            body: [
              "一国や一年に縛られない。ペレとネイマールを混ぜても、ベッケンバウアーに現代のMFを組ませてもよい。唯一のルールは、各指名がポジションを埋めることだ。",
              "この自由がゲームを砂場にする。面白いのは「もしも」だ——70 年代が 20 年代と戦ったら？ここでそれが分かる。",
              "W杯ドリームチームビルダーとして XI は自由自在：年代を混ぜ、スタイルを組み合わせ、古典的な強さと現代の速さどちらがブラケットを制するか試せる。",
            ],
          },
          {
            h2: "大会のドラマ",
            body: [
              "グループの波乱、延長の劇的な敗退、PK——ワールドカップの感情の弧はすべてそこにある。あなたが作った番狂わせが巨人を倒す。",
              "シミュレーションが調子とケミストリーを尊重するから、ドラマはでたらめではなくもっともらしい。本物のように喜び、呪うだろう。",
              "感情の弧はグループの波乱からノックアウトの緊張、延長の疲労、そして PK 戦の悲劇まで続く。各段階が調子・スタミナ・ケミストリーを重み付けし、大会一本が完結した物語になる。",
            ],
          },
          {
            h2: "W杯予想：シミュレーションエンジンの内側",
            body: [
              "均衡チーム同士の 500 試合以上がエンジン調整の基礎だ。1 試合平均ゴール 2.4〜2.8 を狙い、63.6% の試合が 1 点差で決着する。",
              "予測モデルはポゼッション由来のシュート生成、シグモイド制限された変換率、区間ごとのスタミナ減衰を織り込む。弱いスカッド対歴代 AI の現実的な支配（0-2、0-3）も再現する。",
              "W杯予想やワールドカップ シミュレーションに使う人にとって、この安定した分布は信頼の源だ。異常な大差は避けつつ、戦術成功時の波乱は残る。",
              "調整ノブ（scale、conversionBias、desperationScale、baseMaxShots）は 3000 回の均衡シミュレーションで較正され、ゴール総数を安定（約 2.6〜2.8）させる——W杯予想に耐えるデータだ。",
            ],
          },
          {
            h2: "フォーメーションと PK 戦の仕組み",
            body: [
              "フォーメーションが 12 ラウンドのポジション制約を決める。4-3-3 は FW 3、4-4-2 は 2 top、3-5-2 はウイングバックと中盤重視、4-2-3-1 は単発柱で均衡。各フォーメーションはケミストリーの生まれ方と試合中の連携にも影響する。",
              "PK 戦シミュレーションではキッカーの冷静さ＋フィニッシュが GK のリフレックス＋フォームと対峙する。上位 5 キッカーは 0.5×冷静さ + 0.5×フィニッシュの加重平均で選出。各キックはロジスティック式で判定、5 回戦後サドンデス——較正データでも現実的な成功率だ。",
              "フォーメーション戦略と PK 準備は補完関係にある。冷静なキッカーをドラフト時に把握しておけば、決勝トーナメントでのセッションに完全に対策できる。",
              "両方を理解すれば、グループから決勝、サドンデスまで完全な大会準備が整う。これがこのサッカーゲームの深みであり、再プレイ性の源泉だ。",
            ],
          },
        ],
      },
    ],
  },
  es: {
    index: {
      title: "Blog",
      seoTitle: "Blog de Eleven Fantasy — Guías y consejos del simulador",
      intro:
        "Guías y notas sobre Eleven Fantasy - el juego de soccer gratuito en el navegador donde draftas un XI fantasy de la Copa del Mundo y simulas la copa.",
    },
    posts: [
      {
        slug: "how-it-works",
        title: "Cómo funciona Eleven Fantasy",
        excerpt:
          "Cinco movimientos te llevan de una cancha vacía a una final del Mundial simulada. Aquí está el bucle completo.",
        date: "2026-08-22",
        updated: "2026-11-09",
        sections: [
          {
            h2: "Qué es",
            body: [
              "Un juego de soccer gratuito en el navegador. Draftas un XI de Copa del Mundo fantasy de más de 100 plantillas históricas y el motor simula un torneo completo - de grupos a final.",
            ],
          },
          {
            h2: "Elige tu formación",
            body: [
              "Elige 4-3-3, 4-4-2, 3-5-2 o 4-2-3-1. Tu forma bloquea los límites de puestos para las 12 rondas de draft, así siempre sabes cuántos defensas, mediocampistas y delanteros necesitas.",
              "Las formaciones no son solo estética. Deciden dónde pueden jugar tus estrellas y cómo se forma tu química. Un 4-3-3 vive de las bandas; un 3-5-2 de los carrileros y un mediocampo fuerte.",
              "La formación es tu primer movimiento táctico en el simulador de fútbol: define qué puestos ofrece el tablero de draft y tu flexibilidad para colocar jugadores después.",
            ],
          },
          {
            h2: "Draftas tu XI",
            body: [
              "Doce rondas, 11 titulares más 1 banco. Cada ronda recibes una plantilla de nación + año filtrada a tus puestos restantes. Tienes 3 rerolls para todo el draft para cambiar un mal tablero antes de elegir.",
              "Coloca cada jugador en su mejor puesto - los puestos con estrella son ideales - y ve subir la química. Los de la misma nación dan un bonus de química, así un draft listo vence a un equipo de estrellas sueltas.",
              "El tablero muestra valoración, mejor puesto y nación de cada carta - toda la información que esperas de un buen draft fútbol juego, sin valores ocultos.",
            ],
          },
          {
            h2: "Corre el torneo",
            body: [
              "Tu equipo entra en un grupo con 3 equipos IA. Tus partidos de grupo se juegan, luego el cuadro de eliminación va hasta la final. Los empates van a prórroga, luego los penales deciden.",
              "El motor de partido respeta posiciones y química, así un XI bien armado rinde por encima de sus valoraciones brutas. Un mal encaje sale como puntos perdidos que pudiste evitar.",
              "El modo torneo cubre todo: tabla de grupos, llave eliminatoria, prórroga y tanda de penales - una simulación Mundial completa en minutos, sin tiempos muertos.",
            ],
          },
          {
            h2: "Resultados y repetir",
            body: [
              "Ve la tabla final y las stats del equipo, repite cualquier partido o inicia un draft nuevo. Los campeones tienen un intento; los perdedores pueden repetir con el mismo equipo.",
              "El bucle es corto: forma, draft, simular, repetir. Ese es todo el juego, y no pasa de moda.",
              "Tras la final puedes repetir un partido clave, estudiar la llave o relanzar con un ajuste pequeño - nuevo portero, otra delantera - para el siguiente torneo.",
            ],
          },
          {
            h2: "Química y posiciones: cómo las valoraciones se vuelven resultados",
            body: [
              "La valoración de un jugador es un punto de partida. Ponlo en su mejor puesto y juega así; muévelo de su puesto y el motor recorta su aporte. Por eso el encaje en el puesto dicta los resultados.",
              "La química multiplica el efecto. Apila una nación, mantén a los jugadores en su puesto natural, y la ventaja de equipo se suma en un torneo. Armar bien es la mayor palanca en tu resultado.",
              "Los bonos de química crecen sin linealidad: 2 jugadores de la misma nación = +3%, 3 = +5%, 4 = +8%, 5 o más = +10% tope. La curva premia drafts coherentes sobre montones de stats dispersos.",
            ],
          },
          {
            h2: "Rerolls y estrategia de draft",
            body: [
              "Los rerolls son escasos (3 por draft), úsalos cuando un tablero no da encaje para un puesto que debes llenar. No gastes uno por un nombre apenas mejor.",
              "Estrategia simple: asegura primero tu columna (POR, DF, MC, DEL), luego llena las bandas con lo que encaja y da química. Un tablero equilibrado bate a uno codicioso casi siempre.",
              "Las últimas rondas suelen decidir el torneo: quien guarda rerolls para los huecos finales puede pescar un internacional en el momento decisivo en vez de aceptar un puesto forzado.",
            ],
          },
          {
            h2: "Enfrenta a las leyendas",
            body: [
              "La Argentina de Maradona contra la de Messi. Brasil 1970 contra Francia 2022. Apila una nación o mezcla épocas - el motor respeta química y posiciones, así el duelo importa.",
              "Es el simulador de fútbol para cualquiera que alguna vez discutió el mejor equipo de la historia. Ahora lo decides en la cancha, no en un chat.",
              "Los duelos soñados son el corazón del juego: maradona vs messi, pele vs ronaldo, brasil 1970 vs france 2022 - cada debate entre épocas se vuelve partido jugable aquí.",
            ],
          },
          {
            h2: "Construye tu nación o mezcla épocas",
            body: [
              "No estás limitado a un país o un año. Mezcla a Pelé con Neymar, o junta a Beckenbauer con un mediocampo moderno. La única regla es que cada elección ocupe un puesto.",
              "Esta libertad vuelve el juego un sandbox. La gracia está en el «y si» - qué pasaría si los 70 enfrentaran a los 20. Aquí lo descubres.",
              "Como creador de dream team del mundial armas cualquier XI: mezcla décadas, combina estilos y prueba si la garra clásica o la velocidad moderna gana tu llave.",
            ],
          },
          {
            h2: "El drama de la copa",
            body: [
              "Sorpresas en grupos, eliminaciones en el alargue, penales - todo el arco emocional de un Mundial está ahí. Los modestos que armaste pueden humillar a los gigantes.",
              "Como la simulación respeta la forma y la química, el drama se siente merecido, no al azar. Celebrarás y maldecirás como si fuera real.",
              "El arco emocional atraviesa drama de grupos, tensión eliminatoria, cansancio en el alargue y corazón roto en penales - cada fase pondera forma, resistencia y química, y el torneo se vive como una historia completa.",
            ],
          },
          {
            h2: "Pronóstico Mundial: dentro del motor de simulación",
            body: [
              "Más de 500 partidos simulados entre equipos equilibrados calibran el motor. El promedio total apunta a 2,4-2,8 goles, y el 63,6% de los partidos se define por un gol.",
              "El modelo incorpora generación de tiros vía posesión, tasas de conversión acotadas y desgaste de resistencia por tramos. Plantillas débiles ante IA históricas producen dominio realista (0-2, 0-3).",
              "Para un pronóstico fútbol confiable, esta distribución estable evita marcadores absurdos dejando espacio a sorpresas cuando tus decisiones tácticas pagan.",
              "Los parámetros (scale, conversionBias, desperationScale, baseMaxShots) quedaron calibrados en 3000 simulaciones equilibradas: totales estables (~2,6-2,8), datos sólidos para toda simulación copa del mundo.",
            ],
          },
          {
            h2: "Formaciones y penales: la preparación completa",
            body: [
              "La formación dicta tus restricciones de puesto en 12 rondas: 4-3-3 exige 3 atacantes, 4-4-2 empareja delanteros, 3-5-2 refuerza carrileros y mediocampo, 4-2-3-1 equilibra con punta único. Cada formación afecta cómo nace la química y cómo interactúan las posiciones.",
              "En la tanda de penales, sangre fría + definición del tirador se enfrentan a reflejos + forma del portero. Los 5 tiradores salen del promedio 0.5×sangre fría + 0.5×definición; cada penal se resuelve contra la reacción del arquero. Mejor de 5, muerte súbita después - tasas realistas en datos de calibración.",
              "Formación y preparación de penales son complementarias: identificar tiradores fríos durante el draft te da plan completo para la tanda decisiva.",
              "Entender ambas te deja listo del draft al posible desempate: grupos, eliminatorias y final cubiertos. Esa profundidad es la fuente de rejugabilidad del simulador.",
            ],
          },
        ],
      },
    ],
  },
};

export const blogSlugs = blog.en.posts.map((p) => p.slug);
