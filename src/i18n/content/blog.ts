import type { Locale } from "../config";

export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  sections: { h2: string; body: string[] }[];
  faq?: { q: string; a: string }[];
}

export interface BlogLocale {
  index: {
    title: string;
    seoTitle: string;
    intro: string;
    description?: string;
    sections?: { h2: string; body: string[] }[];
    faq?: { q: string; a: string }[];
  };
  posts: BlogPostData[];
}

export const blog: Record<Locale, BlogLocale> = {
  en: {
    index: {
      title: "World Cup Draft Guides",
      seoTitle: "World Cup Draft Guides & Simulator Tips — My World Cup XI",
      description:
        "Practical guides for the world cup draft game: formations, chemistry, rerolls, group stage and penalty shootouts. Read first, draft better.",
      intro:
        "Short, practical guides for building a better XI in My World Cup XI. The game is simple to start: pick a shape, draft eleven players, simulate the cup. The hard part is drafting a team that fits together. These guides cover the draft, the chemistry bonus, the group stage and the penalties, so your next run has a plan behind it. There is no filler here. Each guide is short enough to read before a cup and specific enough to change how you draft.",
      sections: [
        {
          h2: "Start with the draft, not the stars",
          body: [
            "The draft is where most cups are won. You get eleven picks and three rerolls. Each board offers a real World Cup squad that can fill an open slot. You do not get to choose the nation or the year. You choose the player.",
            "That means fit beats fame. A 90-rated forward is only a 90 if he plays in a forward slot. If your formation still needs a centre-back, a famous striker will not fix it. Check the star marker before you pick. It shows whether the player fits the slot naturally.",
            "The board is built to help. It only shows squads with at least one player who can fill a slot you still need. If the board looks bad, a reroll can keep the nation and change the year, or change the nation. You get three for the whole draft, so use them when a slot is blocked, not when a name is slightly better.",
          ],
        },
        {
          h2: "How a cup actually plays out",
          body: [
            "Your team joins a group with three AI sides. Two are weaker teams. One is a strong historical squad. Every team plays the others once. A win gives three points, a draw gives one and a loss gives zero. The top two advance.",
            "The knockout bracket is a round of 16, quarter-final, semi-final and final. The rest of the bracket is simulated around your matches, so the whole tournament finishes fast. Ties go to extra time. If the score is still level, penalties decide. The group draw is different every run, so the same XI can get an easy group or a hard one.",
            "Penalty shootouts use your five best takers, ranked by composure and finishing. Each side takes five kicks. The shootout stops early if one side cannot catch up. If it is still level, it goes to sudden death, one kick each. Your save stays in your browser, so you can replay any match or start a new draft.",
          ],
        },
        {
          h2: "Three draft plans to try",
          body: [
            "The spine plan: take a goalkeeper, a centre-back, a central midfielder and a striker in the first four rounds. Then fill the wide areas. This gives you a balanced XI with no obvious hole. It is the safest plan for a first run.",
            "The nation core plan: pick one nation early and keep taking its players. Five same-nation players give the whole team a 10% bonus. A Brazil 1970 core or an Italy 2006 core can lift average role players. The risk is that the board may not offer your nation again, so keep a backup plan.",
            "The era mix plan: take the best player available in every round, regardless of nation. This raises raw ratings but gives you no chemistry. It works when the board is generous and your slot fit is clean. It fails when you end up with eleven stars in the wrong positions.",
          ],
        },
        {
          h2: "How to scout a squad",
          body: [
            "Every squad card shows the average rating, the best player and the formation. Start with the best player. Brazil 1970 has Pelé. Argentina 1986 has Maradona. France 1998 has Zidane. A 95-rated star can carry a draft, but only if the rest of the XI fits around him.",
            "Then look at the formation. Brazil 1970 played 4-2-4. Netherlands 1974 used total football. Italy 2006 built on defence. Spain 2010 controlled the ball. The shape tells you which slots the squad can fill. Pick squads that match the slots you still need.",
            "Finally, check the depth. A high average means few weak spots. A top-heavy squad may leave you short in midfield. If you need two defenders, a squad with four strong defenders is more useful than a squad with one 95-rated forward.",
          ],
        },
        {
          h2: "Mistakes that cost cups",
          body: [
            "The first mistake is drafting names instead of roles. A 90-rated forward in a midfield slot is not a 90-rated player. Always check the star marker.",
            "The second mistake is hoarding rerolls. You get three for the whole draft. If a board has no player for a slot you must fill, reroll. Saving all three for the last round usually leaves a hole.",
            "The third mistake is ignoring chemistry. Eleven stars from eleven nations get no bonus. A core of five same-nation players gives the whole team +10%. That bonus often decides a close match. If you want to test it, draft five Brazilians and watch the chemistry bar.",
          ],
        },
        {
          h2: "What to read next",
          body: [
            "The first guide is How My World Cup XI Works. It walks through the full loop: formation, draft, chemistry, group, knockout and replay. It also explains the 2026 squads and the ratings.",
            "After that, open the squad library. You can scout every team before you draft. Check the average rating, the best player and the formation. Then take that knowledge into the game and see if your plan survives the cup. Both pages are free and need no account.",
          ],
        },
      ],
      faq: [
        {
          q: "Do I need an account to play?",
          a: "No. The game saves in your browser. There is no sign-up and no password.",
        },
        {
          q: "What formation is best for a beginner?",
          a: "4-4-2 is the simplest. It asks for four defenders, four midfielders and two attackers, so the slots are easy to fill. Try 4-3-3 once you know which wingers you want.",
        },
        {
          q: "How long does a cup take?",
          a: "About ten to fifteen minutes. The draft is the slow part. The matches simulate quickly, and you can replay them.",
        },
      ],
    },
    posts: [
      {
        slug: "how-it-works",
        title: "How My World Cup XI Works",
        excerpt:
          "From an empty pitch to a simulated final: the draft, the chemistry, the group and the penalties.",
        date: "2026-08-22",
        updated: "2026-11-16",
        sections: [
          {
            h2: "What the game is",
            body: [
              "My World Cup XI is a free browser game. You draft a fantasy XI from 77 World Cup squads, then simulate a full tournament. The pool runs from Brazil 1970 to the 2026 squads. The game also uses nine group-stage opponents as AI teams, for 86 teams in total. Every squad uses the same rating scale, so a 1970 winger and a 2026 full-back can be compared fairly.",
              "You do not need an account. You do not need to download anything. A run takes about ten to fifteen minutes, and your save stays in your browser.",
            ],
          },
          {
            h2: "What the ratings mean",
            body: [
              "Every player has thirteen attributes. Goalkeepers are judged on reflexes, positioning and distribution. Defenders are judged on tackling, aerial ability, passing and pace. Midfielders are judged on passing, dribbling, work rate and stamina. Forwards are judged on finishing, dribbling, pace and off-ball movement.",
              "The game turns those attributes into one role-weighted rating. Elite players rate 90 or higher. Stars rate 85 or higher. The number on the card is the player at his best position. Move him out of that position and the engine trims his contribution.",
              "That is why two 90-rated players can have different value. A 90-rated centre-back fills a centre-back slot. A 90-rated winger does not. Check the position before you check the rating.",
            ],
          },
          {
            h2: "1. Pick a formation",
            body: [
              "Choose 4-3-3, 4-4-2, 3-5-2 or 4-2-3-1. The shape locks the number of defenders, midfielders and attackers you can draft. A 4-3-3 needs three attackers. A 3-5-2 needs five midfielders. A 4-2-3-1 needs one centre-forward and a band of attacking midfielders.",
              "Pick the shape you can fill. A 4-3-3 looks attacking, but it is hard to complete if the board keeps offering defenders. A 4-4-2 is the easiest first shape because every department has a clear slot count.",
            ],
          },
          {
            h2: "2. Draft your XI",
            body: [
              "The draft runs eleven rounds. Each round offers a nation and year, filtered to the slots you still need. You choose one player and place him in a position. Starred slots are his best fit. If you move him out of position, the engine trims his contribution.",
              "You get three rerolls for the whole draft. A reroll can keep the nation and change the year, or change the nation. Spend one when the board has no player for a slot you must fill. Do not spend one to chase a slightly better name.",
            ],
          },
          {
            h2: "3. Build chemistry",
            body: [
              "Chemistry counts your largest group of same-nation players. Two gives +3%, three +5%, four +8%, and five or more +10%. The bonus applies across the team. A core of five Brazilians can lift the whole XI. Eleven stars from eleven nations get nothing.",
              "This is why a coherent draft can beat a stronger collection of names. It is also why you should check the board for a nation you already have before you take a slightly higher-rated player from somewhere else.",
            ],
          },
          {
            h2: "4. Play the group stage",
            body: [
              "Your team joins a group with three AI sides. Two are weaker teams. One is a strong historical squad. Every team plays the others once. A win gives three points, a draw gives one and a loss gives zero. The top two advance.",
              "Your three matches play out in segments. You see possession, shots and chances. The other group match is pre-simulated. If your team finishes in the top two, the knockout bracket opens.",
            ],
          },
          {
            h2: "5. Survive the knockout",
            body: [
              "The bracket is a round of 16, quarter-final, semi-final and final. The rest of the bracket is simulated around your matches, so the whole cup finishes fast. Ties go to extra time. If the score is still level, penalties decide.",
              "Penalty shootouts use your five best takers, ranked by composure and finishing. Each side takes five kicks. The shootout stops early if one side cannot catch up. If it is still level, it goes to sudden death, one kick each.",
            ],
          },
          {
            h2: "6. Read the result and replay",
            body: [
              "After the final you can replay any match, compare squad stats and start a new draft. The match page shows the score, the shots, the expected goals and the scorers. Use it to see where the cup turned.",
              "If you lost, try a different shape or a different nation core. The next cup is one click away. The game is built for short runs, so a bad draft costs minutes, not hours.",
            ],
          },
          {
            h2: "Draft plans that work",
            body: [
              "The spine plan: take a goalkeeper, a centre-back, a central midfielder and a striker in the first four rounds. Then fill the wide areas. This gives you a balanced XI with no obvious hole.",
              "The nation core plan: pick one nation early and keep taking its players. Five same-nation players give the whole team a 10% bonus. A Brazil 1970 core or an Italy 2006 core can lift average role players.",
              "The era mix plan: take the best player available in every round. This raises raw ratings but gives you no chemistry. It works when the board is generous and your slot fit is clean. It fails when you end up with eleven stars in the wrong positions.",
            ],
          },
          {
            h2: "One last tip",
            body: [
              "Do not judge a draft until you have played the group. A team that looks weak on paper can win if the slots fit and the chemistry is high. A team of stars can lose if three players are out of position.",
              "After each run, check the match stats. If you lost on shots, your attack was fine and your defence was the problem. If you lost on possession, your midfield was the problem. Fix the department, not the whole squad.",
            ],
          },
          {
            h2: "What the 2026 squads add",
            body: [
              "The 2026 squads are real and verified. They sit beside the classic teams, not in a separate mode. You can draft a 2026 forward next to a 1970 legend. The engine uses the same rating scale for both.",
              "That makes the pool deeper and the arguments better. You can test a modern front line against a 1970s defence, or build a team that mixes eras on purpose. The draft board does not care about the year. It only cares about the slot.",
            ],
          },
        ],
        faq: [
          {
            q: "Do I need an account to play?",
            a: "No. The game saves in your browser. There is no sign-up and no password.",
          },
          {
            q: "Which formation is best for a beginner?",
            a: "4-4-2 is the simplest. It asks for four defenders, four midfielders and two attackers, so the slots are easy to fill. Try 4-3-3 once you know which wingers you want.",
          },
          {
            q: "How many rerolls do I get?",
            a: "Three for the whole draft. Use them when a board has no player for a slot you must fill, not when a name is slightly better.",
          },
        ],
      },
    ],
  },

  de: {
    index: {
      title: "WM-Draft-Guides",
      seoTitle: "WM-Draft-Guides & Simulator-Tipps — My World Cup XI",
      description:
        "Praktische Guides für das WM-Draft-Spiel: Formationen, Chemie, Neuwürfe, Gruppenphase und Elfmeterschießen. Erst lesen, besser draften.",
      intro:
        "Kurze, praktische Guides für eine bessere Elf in My World Cup XI. Das Spiel ist leicht zu starten: Form wählen, elf Spieler draften, Pokal simulieren. Der schwere Teil ist, ein Team zu draften, das zusammenpasst. Diese Guides decken Draft, Chemie-Bonus, Gruppenphase und Elfmeter ab. So hat dein nächster Lauf einen Plan. Hier steht keine Füllmasse. Jeder Guide ist kurz genug für vor einem Pokal und konkret genug, um deinen Draft zu ändern. Lies den ersten, spiel einen Pokal, dann komm zurück.",
      sections: [
        {
          h2: "Beginne mit dem Draft, nicht mit den Stars",
          body: [
            "Der Draft entscheidet die meisten Pokale. Du hast elf Picks und drei Neuwürfe. Jedes Brett bietet einen echten WM-Kader, der einen offenen Platz füllen kann. Du wählst nicht die Nation oder das Jahr. Du wählst den Spieler.",
            "Das heißt: Passung schlägt Ruhm. Ein 90er Stürmer ist nur dann 90, wenn er auf einer Stürmerposition spielt. Wenn deine Formation noch einen Innenverteidiger braucht, löst ein berühmter Stürmer das Problem nicht. Prüfe den Stern vor dem Pick. Er zeigt, ob der Spieler natürlich in den Platz passt.",
            "Das Brett hilft. Es zeigt nur Kader mit mindestens einem Spieler, der einen offenen Platz füllen kann. Wenn das Brett schlecht aussieht, kann ein Neuwurf die Nation behalten und das Jahr ändern oder die Nation wechseln. Du hast drei für den ganzen Draft. Nutze sie, wenn ein Platz blockiert ist, nicht wenn ein Name etwas besser ist. Ein blockierter Platz kostet dich am Ende ein ganzes Turnier.",
          ],
        },
        {
          h2: "So läuft ein Pokal",
          body: [
            "Dein Team kommt in eine Gruppe mit drei KI-Teams. Zwei sind schwächere Mannschaften. Eine ist ein starker historischer Kader. Jeder spielt einmal gegen jeden. Ein Sieg gibt drei Punkte, ein Unentschieden einen, eine Niederlage null. Die Top zwei kommen weiter.",
            "Der K.-o.-Baum ist Achtelfinale, Viertelfinale, Halbfinale und Finale. Der Rest des Baums wird um deine Spiele herum simuliert, deshalb endet der ganze Pokal schnell. Unentschieden gehen in die Verlängerung. Steht es dann noch gleich, entscheiden Elfmeter. Die Gruppenauslosung ist in jedem Lauf anders, deshalb kann dieselbe Elf eine leichte oder eine harte Gruppe bekommen.",
            "Elfmeterschießen nutzen deine fünf besten Schützen, sortiert nach Nervenstärke und Abschluss. Jede Seite schießt fünfmal. Das Schießen endet früh, wenn eine Seite nicht mehr aufholen kann. Steht es dann noch gleich, geht es in den Sudden Death. Dein Spielstand bleibt im Browser, deshalb kannst du jedes Spiel wiederholen oder einen neuen Draft starten.",
          ],
        },
        {
          h2: "Drei Draft-Pläne zum Testen",
          body: [
            "Der Gerüst-Plan: Nimm in den ersten vier Runden einen Torwart, einen Innenverteidiger, einen zentralen Mittelfeldspieler und einen Stürmer. Dann füll die Außenbahnen. Das gibt dir eine ausgeglichene Elf ohne offensichtliches Loch. Es ist der sicherste Plan für den ersten Lauf.",
            "Der Nationskern-Plan: Wähle früh eine Nation und nimm weiter ihre Spieler. Fünf gleiche Nationen geben dem ganzen Team +10%. Ein Kern aus Brasilien 1970 oder Italien 2006 kann durchschnittliche Rollenspieler heben. Das Risiko ist, dass das Brett deine Nation nicht mehr bietet. Halte eine Backup-Nation bereit.",
            "Der Epochen-Mix-Plan: Nimm in jeder Runde den besten verfügbaren Spieler, egal aus welcher Nation. Das hebt die Rohbewertungen, gibt aber keine Chemie. Es funktioniert, wenn das Brett großzügig ist und deine Plätze sauber passen. Es scheitert, wenn du elf Stars auf den falschen Positionen hast. Probiere ihn erst, wenn du die anderen zwei Pläne kennst.",
          ],
        },
        {
          h2: "So scoutest du einen Kader",
          body: [
            "Jede Kaderkarte zeigt die Durchschnittsbewertung, den besten Spieler und die Formation. Beginne mit dem besten Spieler. Brasilien 1970 hat Pelé. Argentinien 1986 hat Maradona. Frankreich 1998 hat Zidane. Ein 95er-Star kann einen Draft tragen, aber nur wenn der Rest der Elf um ihn passt.",
            "Dann sieh die Formation. Brasilien 1970 spielte 4-2-4. Niederlande 1974 nutzten Total Football. Italien 2006 bauten auf Abwehr. Spanien 2010 kontrollierten den Ball. Die Form zeigt, welche Plätze der Kader füllen kann. Wähle Kader, die zu den Plätzen passen, die du noch brauchst.",
            "Prüfe zum Schluss die Tiefe. Ein hoher Durchschnitt bedeutet wenige Schwachstellen. Ein Team mit nur zwei Stars lässt dich im Mittelfeld dünn zurück. Wenn du zwei Verteidiger brauchst, ist ein Kader mit vier starken Verteidigern nützlicher als einer mit einem 95er-Stürmer. Öffne zwei Kader und vergleiche sie, bevor du draftest.",
          ],
        },
        {
          h2: "Fehler, die Pokale kosten",
          body: [
            "Der erste Fehler ist, Namen statt Rollen zu draften. Ein 90er Stürmer im Mittelfeld ist kein 90er Spieler. Prüfe immer den Stern.",
            "Der zweite Fehler ist, Neuwürfe zu horten. Du hast drei für den ganzen Draft. Wenn ein Brett keinen Spieler für einen Pflichtplatz hat, würfle neu. Alle drei für die letzte Runde aufzuheben, hinterlässt meist ein Loch.",
            "Der dritte Fehler ist, Chemie zu ignorieren. Elf Stars aus elf Nationen bekommen keinen Bonus. Ein Kern aus fünf gleichen Nationen gibt dem ganzen Team +10%. Dieser Bonus entscheidet oft ein knappes Spiel. Wenn du es testen willst, draft fünf Brasilianer und beobachte die Chemieanzeige. Der Unterschied ist in der Gruppenphase sichtbar. Ein knapper Sieg kann daran hängen.",
          ],
        },
        {
          h2: "Was du als Nächstes lesen solltest",
          body: [
            "Der erste Guide ist So funktioniert My World Cup XI. Er zeigt den ganzen Ablauf: Formation, Draft, Chemie, Gruppe, K.-o. und Wiederholung. Er erklärt auch die Kader 2026 und die Bewertungen.",
            "Danach öffnest du die Kaderbibliothek. Du kannst jedes Team vor dem Draft scouten. Prüfe Durchschnittsbewertung, besten Spieler und Formation. Dann nimm das Wissen ins Spiel und sieh, ob dein Plan den Pokal übersteht. Beide Seiten sind kostenlos und brauchen kein Konto. Der Blog ist kurz, weil du spielen sollst, nicht lesen. Das reicht für den Start und den ersten Pokal.",
          ],
        },
      ],
      faq: [
        {
          q: "Brauche ich ein Konto zum Spielen?",
          a: "Nein. Das Spiel speichert im Browser. Es gibt keine Anmeldung und kein Passwort.",
        },
        {
          q: "Welche Formation ist für Anfänger am besten?",
          a: "4-4-2 ist am einfachsten. Es verlangt vier Verteidiger, vier Mittelfeldspieler und zwei Angreifer, deshalb sind die Plätze leicht zu füllen. Probiere 4-3-3, wenn du weißt, welche Flügelspieler du willst.",
        },
        {
          q: "Wie lange dauert ein Pokal?",
          a: "Etwa zehn bis fünfzehn Minuten. Der Draft ist der langsame Teil. Die Spiele laufen schnell und lassen sich wiederholen.",
        },
      ],
    },
    posts: [
      {
        slug: "how-it-works",
        title: "So funktioniert My World Cup XI",
        excerpt:
          "Von der leeren Elf bis zum simulierten Finale: Draft, Chemie, Gruppe und Elfmeter.",
        date: "2026-08-22",
        updated: "2026-11-16",
        sections: [
          {
            h2: "Was das Spiel ist",
            body: [
              "My World Cup XI ist ein kostenloses Browserspiel. Du draftest eine Fantasy-Elf aus 77 WM-Kadern und simulierst ein ganzes Turnier. Der Pool reicht von Brasilien 1970 bis zu den Kadern 2026. Das Spiel nutzt zusätzlich neun Gruppengegner als KI-Teams, also 86 Teams insgesamt. Jeder Kader nutzt dieselbe Bewertungsskala, damit ein Flügelspieler von 1970 und ein Außenverteidiger von 2026 fair verglichen werden.",
              "Du brauchst kein Konto. Du musst nichts herunterladen. Ein Lauf dauert zehn bis fünfzehn Minuten, und dein Spielstand bleibt im Browser. Du kannst mitten im Draft aufhören und später weitermachen.",
            ],
          },
          {
            h2: "Was die Bewertungen bedeuten",
            body: [
              "Jeder Spieler hat dreizehn Attribute. Torhüter werden nach Reflexen, Stellungsspiel und Spielaufbau beurteilt. Verteidiger nach Zweikampf, Kopfball, Passspiel und Tempo. Mittelfeldspieler nach Passspiel, Dribbling, Laufarbeit und Ausdauer. Stürmer nach Abschluss, Dribbling, Tempo und Laufwegen.",
              "Das Spiel macht daraus eine rollengewichtete Bewertung. Elite beginnt bei 90. Stars beginnen bei 85. Die Zahl auf der Karte gilt für den Spieler auf seiner Bestposition. Verschiebst du ihn, kürzt die Engine seinen Beitrag.",
              "Deshalb können zwei 90er unterschiedlich wertvoll sein. Ein 90er Innenverteidiger füllt einen Innenverteidigerplatz. Ein 90er Flügelspieler nicht. Prüfe die Position vor der Bewertung. Ein 85er auf seiner Position hilft dir mehr als ein 92er auf einer fremden.",
            ],
          },
          {
            h2: "1. Formation wählen",
            body: [
              "Wähle 4-3-3, 4-4-2, 3-5-2 oder 4-2-3-1. Die Form legt die Zahl der Verteidiger, Mittelfeldspieler und Stürmer fest. Eine 4-3-3 braucht drei Angreifer. Eine 3-5-2 braucht fünf Mittelfeldspieler. Eine 4-2-3-1 braucht einen Mittelstürmer und eine Reihe offensiver Mittelfeldspieler.",
              "Wähle die Form, die du füllen kannst. Eine 4-3-3 sieht offensiv aus, ist aber schwer zu vervollständigen, wenn das Brett ständig Verteidiger bietet. Eine 4-4-2 ist die einfachste erste Form, weil jede Abteilung eine klare Zahl hat.",
            ],
          },
          {
            h2: "2. Elf draften",
            body: [
              "Der Draft läuft elf Runden. Jede Runde bietet eine Nation und ein Jahr, gefiltert auf die Plätze, die du noch brauchst. Du wählst einen Spieler und setzt ihn auf eine Position. Markierte Plätze sind seine beste Passung. Verschiebst du ihn, kürzt die Engine seinen Beitrag.",
              "Du hast drei Neuwürfe für den ganzen Draft. Ein Neuwurf kann die Nation behalten und das Jahr ändern oder die Nation wechseln. Gib einen aus, wenn das Brett keinen Spieler für einen Pflichtplatz hat. Gib keinen aus, um einen etwas besseren Namen zu jagen.",
            ],
          },
          {
            h2: "3. Chemie bauen",
            body: [
              "Chemie zählt deine größte Gruppe gleicher Nation. Zwei geben +3%, drei +5%, vier +8%, fünf oder mehr +10%. Der Bonus gilt für das ganze Team. Ein Kern aus fünf Brasilianern kann die ganze Elf heben. Elf Stars aus elf Nationen bekommen nichts.",
              "Deshalb kann ein stimmiger Draft eine stärkere Sammlung von Namen schlagen. Deshalb solltest du auch prüfen, ob du eine Nation schon hast, bevor du einen etwas höher bewerteten Spieler von woanders nimmst.",
            ],
          },
          {
            h2: "4. Gruppenphase spielen",
            body: [
              "Dein Team kommt in eine Gruppe mit drei KI-Teams. Zwei sind schwächere Mannschaften. Eine ist ein starker historischer Kader. Jeder spielt einmal gegen jeden. Ein Sieg gibt drei Punkte, ein Unentschieden einen, eine Niederlage null. Die Top zwei kommen weiter.",
              "Deine drei Spiele laufen in Abschnitten. Du siehst Ballbesitz, Schüsse und Chancen. Das andere Gruppenspiel ist vorab simuliert. Wenn dein Team unter den Top zwei landet, öffnet sich der K.-o.-Baum.",
            ],
          },
          {
            h2: "5. K.-o. überstehen",
            body: [
              "Der Baum ist Achtelfinale, Viertelfinale, Halbfinale und Finale. Der Rest des Baums wird um deine Spiele herum simuliert, deshalb endet der Pokal schnell. Unentschieden gehen in die Verlängerung. Steht es dann noch gleich, entscheiden Elfmeter.",
              "Elfmeterschießen nutzen deine fünf besten Schützen, sortiert nach Nervenstärke und Abschluss. Jede Seite schießt fünfmal. Das Schießen endet früh, wenn eine Seite nicht mehr aufholen kann. Steht es dann noch gleich, geht es in den Sudden Death.",
            ],
          },
          {
            h2: "6. Ergebnis lesen und wiederholen",
            body: [
              "Nach dem Finale kannst du jedes Spiel wiederholen, Kaderstatistiken vergleichen und einen neuen Draft starten. Die Spielseite zeigt Ergebnis, Schüsse, erwartete Tore und Torschützen. Nutze sie, um zu sehen, wo der Pokal gekippt ist. Das ist der ganze Lauf.",
              "Wenn du verloren hast, probier eine andere Form oder einen anderen Nationskern. Der nächste Pokal ist einen Klick entfernt. Das Spiel ist für kurze Läufe gebaut, deshalb kostet ein schlechter Draft Minuten, nicht Stunden.",
            ],
          },
          {
            h2: "Draft-Pläne, die funktionieren",
            body: [
              "Der Gerüst-Plan: Nimm in den ersten vier Runden einen Torwart, einen Innenverteidiger, einen zentralen Mittelfeldspieler und einen Stürmer. Dann füll die Außenbahnen. Das gibt dir eine ausgeglichene Elf ohne offensichtliches Loch.",
              "Der Nationskern-Plan: Wähle früh eine Nation und nimm weiter ihre Spieler. Fünf gleiche Nationen geben dem ganzen Team +10%. Ein Kern aus Brasilien 1970 oder Italien 2006 kann durchschnittliche Rollenspieler heben.",
              "Der Epochen-Mix-Plan: Nimm in jeder Runde den besten verfügbaren Spieler. Das hebt die Rohbewertungen, gibt aber keine Chemie. Es funktioniert, wenn das Brett großzügig ist und deine Plätze sauber passen. Es scheitert, wenn du elf Stars auf den falschen Positionen hast.",
            ],
          },
          {
            h2: "Ein letzter Tipp",
            body: [
              "Beurteile einen Draft erst, wenn du die Gruppe gespielt hast. Ein Team, das auf Papier schwach aussieht, kann gewinnen, wenn die Plätze passen und die Chemie hoch ist. Ein Team aus Stars kann verlieren, wenn drei Spieler falsch stehen.",
              "Prüfe nach jedem Lauf die Spielstatistiken. Wenn du nach Schüssen verloren hast, war dein Angriff in Ordnung und deine Abwehr das Problem. Wenn du nach Ballbesitz verloren hast, war dein Mittelfeld das Problem. Repariere die Abteilung, nicht die ganze Elf. Ein gezielter Wechsel im nächsten Draft ist besser als ein kompletter Neuanfang. So wird jeder Lauf zu einem Test einer klaren Idee.",
            ],
          },
          {
            h2: "Was die Kader 2026 bringen",
            body: [
              "Die Kader 2026 sind echt und geprüft. Sie stehen neben den klassischen Teams, nicht in einem separaten Modus. Du kannst einen Stürmer von 2026 neben einer Legende von 1970 draften. Die Engine nutzt dieselbe Bewertungsskala für beide.",
              "Das macht den Pool tiefer und die Debatten besser. Du kannst eine moderne Angriffsreihe gegen eine Abwehr der 1970er testen oder bewusst eine Elf aus mehreren Epochen bauen. Das Draft-Brett interessiert das Jahr nicht. Es interessiert nur der Platz. Mehr Teams bedeuten mehr Wege zum Sieg.",
            ],
          },
        ],
        faq: [
          {
            q: "Brauche ich ein Konto zum Spielen?",
            a: "Nein. Das Spiel speichert im Browser. Es gibt keine Anmeldung und kein Passwort.",
          },
          {
            q: "Welche Formation ist für Anfänger am besten?",
            a: "4-4-2 ist am einfachsten. Es verlangt vier Verteidiger, vier Mittelfeldspieler und zwei Angreifer, deshalb sind die Plätze leicht zu füllen. Probiere 4-3-3, wenn du weißt, welche Flügelspieler du willst.",
          },
          {
            q: "Wie viele Neuwürfe habe ich?",
            a: "Drei für den ganzen Draft. Nutze sie, wenn das Brett keinen Spieler für einen Pflichtplatz hat, nicht wenn ein Name etwas besser ist.",
          },
        ],
      },
    ],
  },
  fr: {
    index: {
      title: "Guides de draft Coupe du Monde",
      seoTitle: "Guides de draft & astuces du simulateur — My World Cup XI",
      description:
        "Guides pratiques pour le jeu de draft : formations, chimie, relances, phase de groupes et tirs au but. Lisez d'abord, draftez mieux.",
      intro:
        "Des guides courts et pratiques pour construire une meilleure XI dans My World Cup XI. Le jeu est simple à lancer : choisissez une forme, draftez onze joueurs, simulez la coupe. Le plus dur est de drafter une équipe qui fonctionne ensemble. Ces guides couvrent le draft, le bonus de chimie, la phase de groupes et les tirs au but. Votre prochaine partie aura donc un plan. Il n'y a pas de remplissage ici. Chaque guide est assez court pour être lu avant une coupe et assez précis pour changer votre draft. Lisez le premier, jouez une coupe, puis revenez.",
      sections: [
        {
          h2: "Commencez par le draft, pas par les stars",
          body: [
            "Le draft décide la plupart des coupes. Vous avez onze choix et trois relances. Chaque plateau propose un vrai effectif de Coupe du Monde capable de remplir un poste libre. Vous ne choisissez pas la nation ni l'année. Vous choisissez le joueur.",
            "La justesse bat la célébrité. Un attaquant à 90 n'est à 90 que s'il joue à un poste d'attaquant. Si votre formation a encore besoin d'un défenseur central, un attaquant célèbre ne résout pas le problème. Vérifiez l'étoile avant de choisir. Elle indique si le joueur correspond naturellement au poste.",
            "Le plateau aide. Il ne montre que des effectifs avec au moins un joueur capable de remplir un poste libre. Si le plateau est mauvais, une relance peut garder la nation et changer l'année, ou changer de nation. Vous en avez trois pour tout le draft. Utilisez-les quand un poste est bloqué, pas quand un nom est un peu meilleur. Un poste bloqué coûte une coupe entière.",
          ],
        },
        {
          h2: "Comment se joue une coupe",
          body: [
            "Votre équipe rejoint un groupe avec trois équipes IA. Deux sont plus faibles. Une est un fort effectif historique. Chaque équipe joue une fois contre les autres. Une victoire donne trois points, un nul un point, une défaite zéro. Les deux premières passent.",
            "L'arbre à élimination est composé des huitièmes, des quarts, des demi-finales et de la finale. Le reste de l'arbre est simulé autour de vos matchs, donc la coupe finit vite. Les matchs nuls vont en prolongation. Si le score reste égal, les tirs au but décident. Le tirage du groupe change à chaque partie, donc la même XI peut tomber sur un groupe facile ou difficile.",
            "Les tirs au but utilisent vos cinq meilleurs tireurs, classés par sang-froid et finition. Chaque équipe tire cinq fois. La séance s'arrête tôt si une équipe ne peut plus revenir. Puis mort subite. Votre sauvegarde reste dans le navigateur, donc vous pouvez rejouer un match ou lancer un nouveau draft.",
          ],
        },
        {
          h2: "Trois plans de draft à essayer",
          body: [
            "Le plan colonne vertébrale : prenez un gardien, un défenseur central, un milieu central et un attaquant lors des quatre premiers tours. Puis remplissez les côtés. Cela donne un XI équilibré sans trou évident. C'est le plan le plus sûr pour une première partie.",
            "Le plan noyau national : choisissez une nation tôt et continuez à prendre ses joueurs. Cinq joueurs d'une même nation donnent +10 % à toute l'équipe. Un noyau du Brésil 1970 ou de l'Italie 2006 peut relever des joueurs moyens. Le risque est que le plateau ne propose plus votre nation. Gardez une nation de secours.",
            "Le plan mélange d'époques : prenez le meilleur joueur disponible à chaque tour, quelle que soit la nation. Cela augmente les notes brutes mais ne donne aucune chimie. Il fonctionne quand le plateau est généreux et que vos postes sont bien alignés. Il échoue quand vous finissez avec onze stars aux mauvais postes.",
          ],
        },
        {
          h2: "Comment observer un effectif",
          body: [
            "Chaque fiche montre la note moyenne, le meilleur joueur et la formation. Commencez par le meilleur joueur. Le Brésil 1970 a Pelé. L'Argentine 1986 a Maradona. La France 1998 a Zidane. Une star à 95 peut porter un draft, mais seulement si le reste du XI s'organise autour d'elle.",
            "Regardez ensuite la formation. Le Brésil 1970 jouait en 4-2-4. Les Pays-Bas 1974 utilisaient le football total. L'Italie 2006 s'appuyait sur la défense. L'Espagne 2010 contrôlait le ballon. La forme indique quels postes l'effectif peut remplir. Choisissez des effectifs qui correspondent aux postes qu'il vous reste.",
            "Vérifiez enfin la profondeur. Une moyenne haute signifie peu de points faibles. Une équipe avec seulement deux stars vous laisse mince au milieu. Si vous avez besoin de deux défenseurs, un effectif avec quatre bons défenseurs est plus utile qu'un effectif avec un attaquant à 95.",
          ],
        },
        {
          h2: "Les erreurs qui coûtent des coupes",
          body: [
            "La première erreur est de drafter des noms au lieu de rôles. Un attaquant à 90 placé au milieu n'est pas un joueur à 90. Vérifiez toujours l'étoile.",
            "La deuxième erreur est de garder toutes les relances. Vous en avez trois pour tout le draft. Si un plateau n'a aucun joueur pour un poste obligatoire, relancez. Garder les trois pour le dernier tour laisse souvent un trou.",
            "La troisième erreur est d'ignorer la chimie. Onze stars de onze nations ne reçoivent aucun bonus. Un noyau de cinq joueurs d'une même nation donne +10 % à toute l'équipe. Ce bonus décide souvent un match serré. Pour le tester, draftez cinq Brésiliens et regardez la barre de chimie. La différence se voit en phase de groupes.",
          ],
        },
        {
          h2: "Ce qu'il faut lire ensuite",
          body: [
            "Le premier guide est Comment fonctionne My World Cup XI. Il parcourt toute la boucle : formation, draft, chimie, groupe, phase finale et replay. Il explique aussi les effectifs 2026 et les notes.",
            "Ensuite, ouvrez la bibliothèque d'effectifs. Vous pouvez observer chaque équipe avant de drafter. Vérifiez la note moyenne, le meilleur joueur et la formation. Puis entrez dans le jeu et voyez si votre plan survit à la coupe. Les deux pages sont gratuites et ne demandent aucun compte. C'est assez pour démarrer et jouer une première coupe.",
          ],
        },
      ],
      faq: [
        {
          q: "Faut-il un compte pour jouer ?",
          a: "Non. Le jeu sauvegarde dans votre navigateur. Il n'y a ni inscription ni mot de passe.",
        },
        {
          q: "Quelle formation est la meilleure pour débuter ?",
          a: "Le 4-4-2 est le plus simple. Il demande quatre défenseurs, quatre milieux et deux attaquants, donc les postes sont faciles à remplir. Essayez le 4-3-3 quand vous savez quels ailiers vous voulez.",
        },
        {
          q: "Combien de temps dure une coupe ?",
          a: "Environ dix à quinze minutes. Le draft est la partie lente. Les matchs se simulent vite et peuvent être rejoués.",
        },
      ],
    },
    posts: [
      {
        slug: "how-it-works",
        title: "Comment fonctionne My World Cup XI",
        excerpt:
          "Du XI vide à la finale simulée : le draft, la chimie, le groupe et les tirs au but.",
        date: "2026-08-22",
        updated: "2026-11-16",
        sections: [
          {
            h2: "Ce qu'est le jeu",
            body: [
              "My World Cup XI est un jeu gratuit dans le navigateur. Vous draftez un XI fantasy parmi 77 effectifs de Coupe du Monde, puis vous simulez un tournoi complet. Le pool va du Brésil 1970 aux effectifs 2026. Le jeu utilise aussi neuf adversaires de groupe comme équipes IA, soit 86 équipes au total. Chaque effectif utilise la même échelle de notes, pour comparer un ailier de 1970 et un latéral de 2026 sur une base juste.",
              "Vous n'avez pas besoin de compte. Vous n'avez rien à télécharger. Une partie dure dix à quinze minutes, et votre sauvegarde reste dans le navigateur.",
            ],
          },
          {
            h2: "Ce que signifient les notes",
            body: [
              "Chaque joueur a treize attributs. Les gardiens sont jugés sur leurs réflexes, leur placement et leur relance. Les défenseurs sur leur tacle, leur jeu aérien, leur passe et leur vitesse. Les milieux sur leur passe, leur dribble, leur activité et leur endurance. Les attaquants sur leur finition, leur dribble, leur vitesse et leurs déplacements.",
              "Le jeu transforme ces attributs en une note pondérée par rôle. Les élites commencent à 90. Les stars commencent à 85. Le chiffre sur la fiche vaut pour le joueur à sa meilleure position. Si vous le déplacez, le moteur réduit sa contribution.",
              "C'est pourquoi deux joueurs à 90 peuvent avoir une valeur différente. Un défenseur central à 90 remplit un poste de défenseur central. Un ailier à 90 ne le fait pas. Vérifiez la position avant la note.",
            ],
          },
          {
            h2: "1. Choisir une formation",
            body: [
              "Choisissez 4-3-3, 4-4-2, 3-5-2 ou 4-2-3-1. La forme fixe le nombre de défenseurs, milieux et attaquants. Un 4-3-3 demande trois attaquants. Un 3-5-2 demande cinq milieux. Un 4-2-3-1 demande un avant-centre et une ligne de milieux offensifs.",
              "Choisissez la forme que vous pouvez remplir. Un 4-3-3 semble offensif, mais il est difficile à compléter si le plateau propose toujours des défenseurs. Un 4-4-2 est la première forme la plus simple, car chaque secteur a un nombre clair.",
            ],
          },
          {
            h2: "2. Drafter votre XI",
            body: [
              "Le draft dure onze tours. Chaque tour propose une nation et une année, filtrées selon les postes qu'il vous reste. Vous choisissez un joueur et le placez à une position. Les postes étoilés sont sa meilleure position. Si vous le déplacez, le moteur réduit sa contribution.",
              "Vous avez trois relances pour tout le draft. Une relance peut garder la nation et changer l'année, ou changer de nation. Dépensez-en une quand le plateau n'a aucun joueur pour un poste obligatoire. N'en dépensez pas une pour chercher un nom un peu meilleur.",
            ],
          },
          {
            h2: "3. Construire la chimie",
            body: [
              "La chimie compte votre plus grand groupe de joueurs d'une même nation. Deux donnent +3 %, trois +5 %, quatre +8 %, cinq ou plus +10 %. Le bonus s'applique à toute l'équipe. Un noyau de cinq Brésiliens peut porter tout le XI. Onze stars de onze nations ne reçoivent rien.",
              "C'est pourquoi un draft cohérent peut battre une collection de noms plus forte.",
            ],
          },
          {
            h2: "4. Jouer la phase de groupes",
            body: [
              "Votre équipe rejoint un groupe avec trois équipes IA. Deux sont plus faibles. Une est un fort effectif historique. Chaque équipe joue une fois contre les autres. Une victoire donne trois points, un nul un point, une défaite zéro. Les deux premières passent.",
              "Vos trois matchs se jouent par séquences. Vous voyez la possession, les tirs et les occasions. L'autre match du groupe est pré-simulé. Si votre équipe termine dans les deux premières, l'arbre à élimination s'ouvre.",
            ],
          },
          {
            h2: "5. Survivre à la phase finale",
            body: [
              "L'arbre est composé des huitièmes, des quarts, des demi-finales et de la finale. Le reste de l'arbre est simulé autour de vos matchs, donc la coupe finit vite. Les matchs nuls vont en prolongation. Si le score reste égal, les tirs au but décident.",
              "Les tirs au but utilisent vos cinq meilleurs tireurs, classés par sang-froid et finition. Chaque équipe tire cinq fois. La séance s'arrête tôt si une équipe ne peut plus revenir. Puis mort subite.",
            ],
          },
          {
            h2: "6. Lire le résultat et rejouer",
            body: [
              "Après la finale, vous pouvez rejouer chaque match, comparer les statistiques et lancer un nouveau draft. La page du match montre le score, les tirs, les buts attendus et les buteurs. Utilisez-la pour voir où la coupe a basculé.",
              "Si vous avez perdu, essayez une autre forme ou un autre noyau de nation. La prochaine coupe est à un clic. Un mauvais draft coûte des minutes, pas des heures.",
            ],
          },
          {
            h2: "Des plans de draft qui marchent",
            body: [
              "Le plan colonne vertébrale : prenez un gardien, un défenseur central, un milieu central et un attaquant lors des quatre premiers tours. Puis remplissez les côtés. Cela donne un XI équilibré sans trou évident.",
              "Le plan noyau national : choisissez une nation tôt et continuez à prendre ses joueurs. Cinq joueurs d'une même nation donnent +10 % à toute l'équipe. Un noyau du Brésil 1970 ou de l'Italie 2006 peut relever des joueurs moyens.",
              "Le plan mélange d'époques : prenez le meilleur joueur disponible à chaque tour. Cela augmente les notes brutes mais ne donne aucune chimie. Il fonctionne quand le plateau est généreux et que vos postes sont bien alignés. Il échoue quand vous finissez avec onze stars aux mauvais postes.",
            ],
          },
          {
            h2: "Un dernier conseil",
            body: [
              "Ne jugez pas un draft avant d'avoir joué le groupe. Une équipe qui semble faible sur le papier peut gagner si les postes correspondent et si la chimie est haute. Une équipe de stars peut perdre si trois joueurs sont mal placés.",
              "Après chaque partie, regardez les statistiques. Si vous avez perdu aux tirs, réparez la défense. Si vous avez perdu la possession, réparez le milieu. Un changement ciblé vaut mieux qu'un nouveau départ complet.",
            ],
          },
          {
            h2: "Ce que les effectifs 2026 apportent",
            body: [
              "Les effectifs 2026 sont réels et vérifiés. Ils sont à côté des équipes classiques. Vous pouvez drafter un attaquant de 2026 à côté d'une légende de 1970. Le moteur utilise la même échelle de notes pour les deux.",
              "Cela rend le pool plus profond et les débats meilleurs. Vous pouvez tester une attaque moderne contre une défense des années 1970, ou construire volontairement un XI de plusieurs époques. Le plateau de draft ne se soucie pas de l'année. Il se soucie seulement du poste.",
            ],
          },
        ],
        faq: [
          {
            q: "Faut-il un compte pour jouer ?",
            a: "Non. Le jeu sauvegarde dans votre navigateur. Il n'y a ni inscription ni mot de passe.",
          },
          {
            q: "Quelle formation est la meilleure pour débuter ?",
            a: "Le 4-4-2 est le plus simple. Il demande quatre défenseurs, quatre milieux et deux attaquants, donc les postes sont faciles à remplir. Essayez le 4-3-3 quand vous savez quels ailiers vous voulez.",
          },
          {
            q: "Combien de relances ai-je ?",
            a: "Trois pour tout le draft. Utilisez-les quand un plateau n'a aucun joueur pour un poste obligatoire, pas quand un nom est un peu meilleur.",
          },
        ],
      },
    ],
  },
  ja: {
    index: {
      title: "ワールドカップ・ドラフトガイド",
      seoTitle:
        "ワールドカップ・ドラフトガイドとシミュレーターのコツ — My World Cup XI",
      description:
        "ドラフトゲームの実践ガイド。フォーメーション、ケミストリー、リロール、グループステージ、PK戦。読んでからドラフトしよう。",
      intro:
        "My World Cup XIでより良いXIを作るための、短くて実践的なガイドです。ゲームの始め方は簡単。形を選び、11人をドラフトし、大会をシミュレートするだけ。難しいのは、まとまりのあるチームをドラフトすることです。ここではドラフト、ケミストリーボーナス、グループステージ、PK戦を扱います。次の大会に計画を持って臨めます。中身のない文章はありません。どのガイドも大会前に読める長さで、ドラフトを変えるだけの具体性があります。最初の1本を読んだら、1回大会をプレイしてから戻ってきてください。",
      sections: [
        {
          h2: "スターではなく、ドラフトから始める",
          body: [
            "大会の大半はドラフトで決まります。指名は11回、リロールは3回。各ボードには、空いているポジションを埋められる実際のワールドカップ・チームが出ます。国や年は選べません。選ぶのは選手です。",
            "つまり、相性が名声に勝ります。90のFWは、FWの位置でプレーして初めて90です。フォーメーションがまだCBを必要としているなら、有名なFWでは解決しません。指名前に星印を確認しましょう。その選手が自然にポジションに合うか分かります。",
            "ボードは助けてくれます。空いているポジションを埋められる選手が少なくとも1人いるチームだけを出します。ボードが悪ければ、リロールで国を残して年を変えるか、国ごと変えられます。使えるのは全体で3回。ポジションが詰まったときに使い、少し名前が良いだけでは使いません。詰まったポジションは大会全体を失わせます。",
          ],
        },
        {
          h2: "大会の流れ",
          body: [
            "あなたのチームは3つのAIチームと同じグループに入ります。2つは弱め、1つは強い歴史的チームです。総当たりで1回ずつ戦います。勝ちで3点、引き分けで1点、負けで0点。上位2チームが通過します。",
            "決勝トーナメントはラウンド16、準々決勝、準決勝、決勝です。残りはあなたの試合の周りでシミュレートされるので、大会は早く終わります。同点なら延長戦。それでも決まらなければPK戦です。グループの組み合わせは毎回変わるので、同じXIでも楽な組にも厳しい組にも入ります。",
            "PK戦は、冷静さとフィニッシュの高い5人を使います。お互い5本ずつ。片方が追いつけなくなれば早く終了。その後はサドンデスです。セーブはブラウザに残るので、試合を見返すことも、新しいドラフトを始めることもできます。",
          ],
        },
        {
          h2: "試したい3つのドラフト計画",
          body: [
            "背骨プラン：最初の4ラウンドでGK、CB、中央MF、FWを取ります。その後でサイドを埋めます。穴の目立たないバランスの良いXIになります。最初の1回に一番安全な計画です。",
            "国の核プラン：早めに1か国を選び、その国の選手を取り続けます。同じ国が5人そろうと、チーム全体に+10%。ブラジル1970やイタリア2006の核は、平均的な選手を引き上げます。リスクは、ボードがその国を出さなくなること。予備の国を考えておきましょう。",
            "時代ミックスプラン：毎回、国に関係なく最も評価の高い選手を取ります。生の評価は上がりますが、ケミストリーはゼロ。ボードが豊かで、ポジションがきれいに合うときだけ機能します。11人のスターが間違った位置に並ぶと失敗します。",
          ],
        },
        {
          h2: "チームのスカウト方法",
          body: [
            "チームカードには平均レーティング、トップ選手、フォーメーションが出ます。まずトップ選手。ブラジル1970ならペレ。アルゼンチン1986ならマラドーナ。フランス1998ならジダン。95のスターはドラフトを背負えますが、XIの残りがその選手に合っている必要があります。",
            "次にフォーメーション。ブラジル1970は4-2-4。オランダ1974はトータルフットボール。イタリア2006は守備。スペイン2010はボール支配。形を見れば、どのポジションを埋められるか分かります。残っているポジションに合うチームを選びましょう。",
            "最後に層の厚さ。平均が高ければ弱点が少ないです。スターが2人だけのチームは中盤が薄くなります。DFが2人必要なとき、95のFWが1人いるチームより、良いDFが4人いるチームの方が役に立ちます。",
          ],
        },
        {
          h2: "大会を落とすミス",
          body: [
            "1つ目は、役割ではなく名前でドラフトすることです。90のFWをMFに置いても、90の選手にはなりません。必ず星印を確認しましょう。",
            "2つ目は、リロールをため込むことです。全体で3回。埋めなければならないポジションに誰もいなければ、リロールします。3回とも最後まで残すと、たいてい穴が残ります。",
            "3つ目は、ケミストリーを無視することです。11人を11か国から集めてもボーナスはゼロ。同じ国が5人そろえばチーム全体に+10%。この差は接戦を決めます。試したいなら、ブラジル人を5人ドラフトしてケミストリー表示を見てください。グループステージで違いが分かります。",
          ],
        },
        {
          h2: "次に読むもの",
          body: [
            "最初のガイドは「My World Cup XIの仕組み」です。フォーメーション、ドラフト、ケミストリー、グループ、決勝トーナメント、見返し方まで、全体の流れを説明します。2026年のチームと評価についても触れます。",
            "その次にチームライブラリを開きます。ドラフト前に全チームをスカウトできます。平均レーティング、トップ選手、フォーメーションを確認してください。そしてゲームに入り、自分の計画が大会を生き残るか見てみましょう。どちらのページも無料で、アカウントは不要です。最初の1回にはそれで十分です。",
          ],
        },
      ],
      faq: [
        {
          q: "プレイにアカウントは必要ですか？",
          a: "いいえ。ゲームはブラウザに保存します。登録もパスワードもありません。",
        },
        {
          q: "初心者にはどのフォーメーションがいいですか？",
          a: "4-4-2が一番簡単です。DF4人、MF4人、FW2人なので、ポジションを埋めやすいです。どのウイングを使うか分かってきたら4-3-3を試してください。",
        },
        {
          q: "1回の大会はどのくらいですか？",
          a: "だいたい10〜15分です。時間がかかるのはドラフト。試合はすぐに進み、見返すこともできます。",
        },
      ],
    },
    posts: [
      {
        slug: "how-it-works",
        title: "My World Cup XIの仕組み",
        excerpt:
          "空のピッチからシミュレートされた決勝まで。ドラフト、ケミストリー、グループ、PK戦を順番に説明します。",
        date: "2026-08-22",
        updated: "2026-11-16",
        sections: [
          {
            h2: "ゲームの内容",
            body: [
              "My World Cup XIは無料のブラウザゲームです。77のワールドカップ・チームからファンタジーXIをドラフトし、大会全体をシミュレートします。プールはブラジル1970から2026年チームまで。ゲームはさらに9つのグループステージ相手をAIチームとして使うので、合計86チームです。全チームが同じ評価スケールを使うので、1970年のウイングと2026年のサイドバックを公平に比べられます。",
              "アカウントは不要。ダウンロードも不要です。1回は10〜15分で、セーブはブラウザに残ります。ドラフトの途中でやめて、後から続けることもできます。",
            ],
          },
          {
            h2: "評価の意味",
            body: [
              "各選手には13の能力があります。GKは反射、位置取り、配球。DFはタックル、空中戦、パス、スピード。MFはパス、ドリブル、ワークレート、スタミナ。FWはフィニッシュ、ドリブル、スピード、オフザボールで評価されます。",
              "ゲームはそれをポジション別の重み付き評価に変えます。エリートは90以上、スターは85以上。カードの数字は、その選手がベストポジションにいるときの値です。動かすとエンジンが貢献を減らします。",
              "だから同じ90でも価値が違います。90のCBはCBのポジションを埋めます。90のウイングは埋めません。評価より先にポジションを確認しましょう。85でも正しい位置の選手は、92でも間違った位置の選手より役に立ちます。",
            ],
          },
          {
            h2: "1. フォーメーションを選ぶ",
            body: [
              "4-3-3、4-4-2、3-5-2、4-2-3-1から選びます。形でDF、MF、FWの人数が決まります。4-3-3はFWが3人。3-5-2はMFが5人。4-2-3-1はワントップと攻撃的MFの列が必要です。",
              "埋められる形を選びましょう。4-3-3は攻撃的に見えますが、ボードがDFばかり出すと完成しにくいです。最初は4-4-2が一番簡単で、各部門の人数がはっきりしています。",
            ],
          },
          {
            h2: "2. XIをドラフトする",
            body: [
              "ドラフトは11ラウンド。各ラウンドで、残っているポジションに合わせて国と年が提示されます。選手を1人選び、ポジションに置きます。星印はベストポジション。動かすと貢献が減ります。",
              "リロールは全体で3回。国を残して年を変えるか、国ごと変えられます。埋めなければならないポジションに誰もいないときに使いましょう。少し名前が良いだけで使うのはもったいないです。",
            ],
          },
          {
            h2: "3. ケミストリーを組む",
            body: [
              "ケミストリーは、同じ国の選手が最も多いグループを数えます。2人で+3%、3人で+5%、4人で+8%、5人以上で+10%。ボーナスはチーム全体にかかります。ブラジル人5人の核はXI全体を上げます。11人を11か国から集めてもゼロです。",
              "だからまとまりのあるドラフトは、より強い名前の集まりに勝てます。だから少し評価の高い選手を別の国から取る前に、すでに同じ国がいるか確認しましょう。",
            ],
          },
          {
            h2: "4. グループステージを戦う",
            body: [
              "あなたのチームは3つのAIチームと同じグループに入ります。2つは弱め、1つは強い歴史的チーム。総当たりで1回ずつ。勝ちで3点、引き分けで1点、負けで0点。上位2チームが通過します。",
              "3試合はセグメントごとに進み、ポゼッション、シュート、チャンスが見えます。もう1試合は事前にシミュレート済み。上位2チームに入れば、決勝トーナメントが開きます。",
            ],
          },
          {
            h2: "5. 決勝トーナメントを生き残る",
            body: [
              "ラウンド16、準々決勝、準決勝、決勝です。残りはあなたの試合の周りでシミュレートされ、大会は早く終わります。同点なら延長戦。それでも決まらなければPK戦です。",
              "PK戦は、冷静さとフィニッシュの高い5人を使います。お互い5本ずつ。片方が追いつけなくなれば終了。同点ならサドンデスで1本ずつです。",
            ],
          },
          {
            h2: "6. 結果を見て、もう一度",
            body: [
              "決勝の後は、どの試合も見返せます。チームスタッツを比べ、新しいドラフトを始められます。試合ページにはスコア、シュート、期待得点、得点者が出ます。どこで大会が傾いたか分かります。",
              "負けたら、別の形か別の国の核を試してください。次の大会はワンクリックです。短いプレイ向けなので、悪いドラフトの代償は数分です。",
            ],
          },
          {
            h2: "うまくいくドラフト計画",
            body: [
              "背骨プラン：最初の4ラウンドでGK、CB、中央MF、FWを取ります。その後でサイドを埋めます。穴の目立たないバランスの良いXIになります。",
              "国の核プラン：早めに1か国を選び、その国の選手を取り続けます。同じ国が5人でチーム全体に+10%。ブラジル1970やイタリア2006の核は、平均的な選手を引き上げます。",
              "時代ミックスプラン：毎回、最も評価の高い選手を取ります。生の評価は上がりますが、ケミストリーはゼロ。ボードが豊かで、ポジションがきれいに合うときだけ機能します。11人のスターが間違った位置に並ぶと失敗します。",
            ],
          },
          {
            h2: "最後のヒント",
            body: [
              "グループを戦うまでドラフトを判断しないでください。紙の上で弱く見えるチームでも、ポジションが合い、ケミストリーが高ければ勝てます。スター集団でも、3人が間違った位置なら負けます。",
              "毎回、試合スタッツを確認しましょう。シュートで負けたなら、攻撃は悪くなく守備が問題です。ポゼッションで負けたなら、中盤が問題です。チーム全体ではなく、その部門を直します。次のドラフトでの狙った変更は、全部やり直すより良いです。",
            ],
          },
          {
            h2: "2026年のチームが加えるもの",
            body: [
              "2026年のチームは実在し、検証済みです。クラシックチームと同じ場所に並び、別モードではありません。2026年のFWを1970年のレジェンドの隣でドラフトできます。エンジンは両方に同じ評価スケールを使います。",
              "プールが深くなり、議論も面白くなります。現代の攻撃陣を1970年代の守備と戦わせたり、意図的に複数時代のXIを作ったりできます。ドラフトボードは年を気にしません。見るのはポジションだけです。チームが増えれば、勝つ道も増えます。",
            ],
          },
        ],
        faq: [
          {
            q: "プレイにアカウントは必要ですか？",
            a: "いいえ。ゲームはブラウザに保存します。登録もパスワードもありません。",
          },
          {
            q: "初心者にはどのフォーメーションがいいですか？",
            a: "4-4-2が一番簡単です。DF4人、MF4人、FW2人なので、ポジションを埋めやすいです。どのウイングを使うか分かってきたら4-3-3を試してください。",
          },
          {
            q: "リロールは何回ありますか？",
            a: "ドラフト全体で3回です。埋めなければならないポジションに誰もいないときに使い、少し名前が良いだけでは使わないでください。",
          },
        ],
      },
    ],
  },
  es: {
    index: {
      title: "Guías de draft del Mundial",
      seoTitle: "Guías de draft y consejos del simulador — My World Cup XI",
      description:
        "Guías prácticas para el juego de draft: formaciones, química, rerolls, fase de grupos y penales. Lee primero, draftea mejor.",
      intro:
        "Guías cortas y prácticas para construir una mejor XI en My World Cup XI. El juego es fácil de empezar: elige una forma, draftea once jugadores y simula la copa. Lo difícil es draftear un equipo que funcione junto. Estas guías cubren el draft, el bonus de química, la fase de grupos y los penales. Así tu próxima partida tendrá un plan. Aquí no hay relleno. Cada guía es lo bastante corta para leerla antes de una copa y lo bastante concreta para cambiar tu draft. Lee la primera, juega una copa y vuelve.",
      sections: [
        {
          h2: "Empieza por el draft, no por las estrellas",
          body: [
            "El draft decide la mayoría de las copas. Tienes once elecciones y tres rerolls. Cada tablero ofrece una plantilla real del Mundial que puede llenar un puesto libre. No eliges la nación ni el año. Eliges al jugador.",
            "El encaje gana a la fama. Un delantero de 90 solo es 90 si juega en un puesto de delantero. Si tu formación aún necesita un central, un delantero famoso no resuelve el problema. Revisa la estrella antes de elegir. Muestra si el jugador encaja de forma natural en el puesto.",
            "El tablero ayuda. Solo muestra plantillas con al menos un jugador que puede llenar un puesto libre. Si el tablero es malo, un reroll puede mantener la nación y cambiar el año, o cambiar de nación. Tienes tres para todo el draft. Úsalos cuando un puesto esté bloqueado, no cuando un nombre sea un poco mejor. Un puesto bloqueado cuesta una copa entera.",
          ],
        },
        {
          h2: "Cómo se juega una copa",
          body: [
            "Tu equipo entra en un grupo con tres equipos IA. Dos son más débiles. Uno es una plantilla histórica fuerte. Cada equipo juega una vez contra los demás. Una victoria da tres puntos, un empate uno y una derrota cero. Los dos primeros pasan.",
            "El cuadro de eliminación es octavos, cuartos, semifinales y final. El resto del cuadro se simula alrededor de tus partidos, así la copa termina rápido. Los empates van a prórroga. Si el marcador sigue igual, deciden los penales. El sorteo del grupo cambia en cada partida, así la misma XI puede caer en un grupo fácil o difícil.",
            "Los penales usan a tus cinco mejores tiradores, ordenados por sangre fría y definición. Cada equipo tira cinco veces. La tanda termina antes si un equipo ya no puede remontar. Luego muerte súbita. Tu guardado se queda en el navegador, así puedes repetir un partido o empezar otro draft.",
          ],
        },
        {
          h2: "Tres planes de draft para probar",
          body: [
            "El plan columna vertebral: toma un portero, un central, un medio central y un delantero en las primeras cuatro rondas. Luego llena los costados. Da una XI equilibrada sin un hueco evidente. Es el plan más seguro para una primera partida.",
            "El plan núcleo nacional: elige una nación pronto y sigue tomando sus jugadores. Cinco jugadores de la misma nación dan +10% a todo el equipo. Un núcleo del Brasil 1970 o de Italia 2006 puede subir a jugadores medios. El riesgo es que el tablero deje de ofrecer tu nación. Ten una nación de respaldo.",
            "El plan mezcla de épocas: toma al mejor jugador disponible en cada ronda, sin importar la nación. Sube las valoraciones brutas pero no da química. Funciona cuando el tablero es generoso y tus puestos encajan bien. Falla cuando terminas con once estrellas en los puestos equivocados.",
          ],
        },
        {
          h2: "Cómo observar una plantilla",
          body: [
            "Cada ficha muestra la valoración media, el mejor jugador y la formación. Empieza por el mejor jugador. Brasil 1970 tiene a Pelé. Argentina 1986 tiene a Maradona. Francia 1998 tiene a Zidane. Una estrella de 95 puede cargar un draft, pero solo si el resto de la XI se organiza alrededor.",
            "Luego mira la formación. Brasil 1970 jugaba 4-2-4. Países Bajos 1974 usaba fútbol total. Italia 2006 se apoyaba en la defensa. España 2010 controlaba el balón. La forma indica qué puestos puede llenar la plantilla. Elige plantillas que encajen en los puestos que aún necesitas.",
            "Por último, revisa la profundidad. Una media alta significa pocos puntos débiles. Un equipo con solo dos estrellas te deja corto en el medio. Si necesitas dos defensas, una plantilla con cuatro defensas buenos es más útil que una con un delantero de 95.",
          ],
        },
        {
          h2: "Errores que cuestan copas",
          body: [
            "El primer error es draftear nombres en vez de roles. Un delantero de 90 en el medio no es un jugador de 90. Revisa siempre la estrella.",
            "El segundo error es guardar todos los rerolls. Tienes tres para todo el draft. Si un tablero no tiene ningún jugador para un puesto obligatorio, haz reroll. Guardar los tres para la última ronda suele dejar un hueco.",
            "El tercer error es ignorar la química. Once estrellas de once naciones no reciben bonus. Un núcleo de cinco jugadores de la misma nación da +10% a todo el equipo. Ese bonus decide muchos partidos ajustados. Si quieres probarlo, draftea cinco brasileños y mira la barra de química. La diferencia se ve en la fase de grupos.",
          ],
        },
        {
          h2: "Qué leer después",
          body: [
            "La primera guía es Cómo funciona My World Cup XI. Recorre todo el bucle: formación, draft, química, grupo, eliminación y repetición. También explica las plantillas de 2026 y las valoraciones.",
            "Después, abre la biblioteca de plantillas. Puedes observar cada equipo antes de draftear. Revisa la valoración media, el mejor jugador y la formación. Luego entra al juego y mira si tu plan sobrevive a la copa. Las dos páginas son gratis y no piden cuenta. Es suficiente para empezar y jugar una primera copa.",
          ],
        },
      ],
      faq: [
        {
          q: "¿Necesito una cuenta para jugar?",
          a: "No. El juego guarda en tu navegador. No hay registro ni contraseña.",
        },
        {
          q: "¿Qué formación es mejor para empezar?",
          a: "El 4-4-2 es el más simple. Pide cuatro defensas, cuatro medios y dos delanteros, así que los puestos son fáciles de llenar. Prueba el 4-3-3 cuando sepas qué extremos quieres.",
        },
        {
          q: "¿Cuánto dura una copa?",
          a: "Unos diez a quince minutos. El draft es la parte lenta. Los partidos se simulan rápido y puedes repetirlos.",
        },
      ],
    },
    posts: [
      {
        slug: "how-it-works",
        title: "Cómo funciona My World Cup XI",
        excerpt:
          "De una cancha vacía a una final simulada: el draft, la química, el grupo y los penales.",
        date: "2026-08-22",
        updated: "2026-11-16",
        sections: [
          {
            h2: "Qué es el juego",
            body: [
              "My World Cup XI es un juego gratis en el navegador. Drafteas una XI fantasy de 77 plantillas del Mundial y simulas un torneo completo. El pool va del Brasil 1970 a las plantillas de 2026. El juego también usa nueve rivales de grupo como equipos IA, así que el total es de 86 equipos. Cada plantilla usa la misma escala de valoraciones, para comparar un extremo de 1970 y un lateral de 2026 de forma justa.",
              "No necesitas cuenta. No tienes que descargar nada. Una partida dura diez a quince minutos y tu guardado se queda en el navegador. Puedes parar a mitad del draft y seguir después.",
            ],
          },
          {
            h2: "Qué significan las valoraciones",
            body: [
              "Cada jugador tiene trece atributos. Los porteros se miden por reflejos, colocación y distribución. Los defensas por entradas, juego aéreo, pase y velocidad. Los medios por pase, regate, trabajo y resistencia. Los delanteros por definición, regate, velocidad y desmarque.",
              "El juego convierte esos atributos en una valoración ponderada por puesto. La élite empieza en 90. Las estrellas empiezan en 85. El número de la ficha vale para el jugador en su mejor posición. Si lo mueves, el motor recorta su contribución.",
              "Por eso dos jugadores de 90 pueden valer distinto. Un central de 90 llena un puesto de central. Un extremo de 90 no. Revisa la posición antes que la nota. Un jugador de 85 en su puesto te ayuda más que uno de 92 en un puesto ajeno.",
            ],
          },
          {
            h2: "1. Elegir formación",
            body: [
              "Elige 4-3-3, 4-4-2, 3-5-2 o 4-2-3-1. La forma fija el número de defensas, medios y delanteros. Un 4-3-3 pide tres delanteros. Un 3-5-2 pide cinco medios. Un 4-2-3-1 pide un delantero centro y una línea de medios ofensivos.",
              "Elige la forma que puedes llenar. Un 4-3-3 parece ofensivo, pero es difícil de completar si el tablero siempre ofrece defensas. Un 4-4-2 es la primera forma más simple, porque cada sector tiene un número claro.",
            ],
          },
          {
            h2: "2. Draftear tu XI",
            body: [
              "El draft dura once rondas. Cada ronda ofrece una nación y un año, filtrados por los puestos que aún necesitas. Eliges un jugador y lo colocas en una posición. Los puestos con estrella son su mejor encaje. Si lo mueves, el motor recorta su contribución.",
              "Tienes tres rerolls para todo el draft. Un reroll puede mantener la nación y cambiar el año, o cambiar de nación. Gasta uno cuando el tablero no tenga ningún jugador para un puesto obligatorio. No gastes uno por perseguir un nombre un poco mejor.",
            ],
          },
          {
            h2: "3. Construir química",
            body: [
              "La química cuenta tu grupo más grande de jugadores de la misma nación. Dos dan +3%, tres +5%, cuatro +8%, cinco o más +10%. El bonus se aplica a todo el equipo. Un núcleo de cinco brasileños puede subir toda la XI. Once estrellas de once naciones no reciben nada.",
              "Por eso un draft coherente puede ganar a una colección de nombres más fuerte. Por eso también conviene revisar si ya tienes una nación antes de tomar un jugador un poco mejor de otro sitio.",
            ],
          },
          {
            h2: "4. Jugar la fase de grupos",
            body: [
              "Tu equipo entra en un grupo con tres equipos IA. Dos son más débiles. Uno es una plantilla histórica fuerte. Cada equipo juega una vez contra los demás. Una victoria da tres puntos, un empate uno y una derrota cero. Los dos primeros pasan.",
              "Tus tres partidos se juegan por tramos. Ves posesión, tiros y ocasiones. El otro partido del grupo está pre-simulado. Si tu equipo termina entre los dos primeros, se abre el cuadro de eliminación.",
            ],
          },
          {
            h2: "5. Sobrevivir a la eliminación",
            body: [
              "El cuadro es octavos, cuartos, semifinales y final. El resto se simula alrededor de tus partidos, así la copa termina rápido. Los empates van a prórroga. Si el marcador sigue igual, deciden los penales.",
              "Los penales usan a tus cinco mejores tiradores, ordenados por sangre fría y definición. Cada equipo tira cinco veces. La tanda termina antes si un equipo ya no puede remontar. Luego muerte súbita.",
            ],
          },
          {
            h2: "6. Leer el resultado y repetir",
            body: [
              "Después de la final puedes repetir cualquier partido, comparar estadísticas y empezar un draft nuevo. La página del partido muestra el marcador, los tiros, los goles esperados y los goleadores. Úsala para ver dónde cambió la copa.",
              "Si perdiste, prueba otra forma u otro núcleo de nación. La próxima copa está a un clic. El juego está hecho para partidas cortas, así que un mal draft cuesta minutos, no horas.",
            ],
          },
          {
            h2: "Planes de draft que funcionan",
            body: [
              "El plan columna vertebral: toma un portero, un central, un medio central y un delantero en las primeras cuatro rondas. Luego llena los costados. Da una XI equilibrada sin un hueco evidente.",
              "El plan núcleo nacional: elige una nación pronto y sigue tomando sus jugadores. Cinco jugadores de la misma nación dan +10% a todo el equipo. Un núcleo del Brasil 1970 o de Italia 2006 puede subir a jugadores medios.",
              "El plan mezcla de épocas: toma al mejor jugador disponible en cada ronda. Sube las valoraciones brutas pero no da química. Funciona cuando el tablero es generoso y tus puestos encajan bien. Falla cuando terminas con once estrellas en los puestos equivocados.",
            ],
          },
          {
            h2: "Un último consejo",
            body: [
              "No juzgues un draft hasta jugar el grupo. Un equipo que parece débil en el papel puede ganar si los puestos encajan y la química es alta. Un equipo de estrellas puede perder si tres jugadores están mal colocados.",
              "Después de cada partida, mira las estadísticas. Si perdiste en tiros, tu ataque estaba bien y tu defensa era el problema. Si perdiste la posesión, tu medio era el problema. Repara el sector, no todo el equipo. Un cambio concreto en el próximo draft vale más que empezar de cero.",
            ],
          },
          {
            h2: "Qué aportan las plantillas de 2026",
            body: [
              "Las plantillas de 2026 son reales y verificadas. Están junto a los equipos clásicos, no en un modo aparte. Puedes draftear un delantero de 2026 al lado de una leyenda de 1970. El motor usa la misma escala de valoraciones para ambos.",
              "Eso hace el pool más profundo y los debates mejores. Puedes probar un ataque moderno contra una defensa de los años 70, o construir a propósito una XI de varias épocas. Al tablero de draft no le importa el año. Solo le importa el puesto. Más equipos significan más caminos hacia la victoria.",
            ],
          },
        ],
        faq: [
          {
            q: "¿Necesito una cuenta para jugar?",
            a: "No. El juego guarda en tu navegador. No hay registro ni contraseña.",
          },
          {
            q: "¿Qué formación es mejor para empezar?",
            a: "El 4-4-2 es el más simple. Pide cuatro defensas, cuatro medios y dos delanteros, así que los puestos son fáciles de llenar. Prueba el 4-3-3 cuando sepas qué extremos quieres.",
          },
          {
            q: "¿Cuántos rerolls tengo?",
            a: "Tres para todo el draft. Úsalos cuando un tablero no tenga ningún jugador para un puesto obligatorio, no cuando un nombre sea un poco mejor.",
          },
        ],
      },
    ],
  },
};

export const blogSlugs = blog.en.posts.map((p) => p.slug);
