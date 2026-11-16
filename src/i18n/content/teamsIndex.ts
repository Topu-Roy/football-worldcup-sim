export const teamsIndex = {
  en: {
    eyebrow: "Squad library",
    h1: "World Cup Squads: Every Team You Can Draft",
    blogLink: "Want draft strategy? Read the simulator guides on the blog",
    intro: (count: number) =>
      `Every World Cup squad in My World Cup XI is here. That is ${count} tournament teams from 1970 to 2026, ranked by average player rating and ready to scout. You draft from these ${count} squads. The game also uses nine group-stage opponents as AI teams, which brings the full pool to 86 teams. This page is the library behind the world cup team builder. Every roster has a formation, player names and a rating for each player. The ratings use one scale, so you can compare Brazil 1970 with Argentina 2022. Search by nation, year or formation. Open a squad to see its player list. Then take what you learn into the draft.`,
    erasTitle: "Six decades, one scale",
    eras: [
      {
        years: "1970-1979",
        title: "The attacking blueprint",
        body: "Brazil 1970 are the benchmark: six wins, 19 goals, and a 4-2-4 that still looks modern. Netherlands 1974 lost the final but changed how people thought about movement and space. West Germany 1974 won at home with Beckenbauer and Müller. Poland 1974 finished third, with Grzegorz Lato scoring seven goals. Argentina 1978 won their first title, with Mario Kempes scoring six.",
      },
      {
        years: "1980-1989",
        title: "Edge, debate and Maradona",
        body: "Italy 1982 started with three draws, then beat Brazil, Argentina, Poland and West Germany. Paolo Rossi scored six goals after a quiet group stage. France 1982 had Platini and a midfield that could pass through anyone, but lost the semi-final to West Germany on penalties. Argentina 1986 was Maradona's tournament: five goals, five assists and the two most famous goals of the decade. Denmark 1986 was the neutral's favourite before a 5-1 loss to Spain.",
      },
      {
        years: "1990-1999",
        title: "Defence, penalties and new nations",
        body: "West Germany 1990 won the final 1-0 against Argentina. Brazil 1994 ended a 24-year wait on penalties against Italy. France 1998 won at home, with Zidane scoring twice in the final and a defence that conceded two goals in seven matches. Croatia 1998 finished third in their first World Cup as an independent nation, with Davor Šuker scoring six. Bulgaria 1994 and Sweden 1994 were the surprise semi-finalists.",
      },
      {
        years: "2000-2009",
        title: "The three R's and the wall",
        body: "Brazil 2002 had Ronaldo, Rivaldo and Ronaldinho, and won all seven matches. Germany 2002 reached the final with a young Michael Ballack and Oliver Kahn. Italy 2006 conceded two goals in the tournament, one of them an own goal, and won on penalties. France 2006 had Zidane's last run. Portugal 2006 reached the semi-final with a young Cristiano Ronaldo.",
      },
      {
        years: "2010-2019",
        title: "Possession, pressing and a 7-1",
        body: "Spain 2010 won with tiki-taka and four straight 1-0 knockout wins. Netherlands 2010 reached the final with Arjen Robben and Wesley Sneijder. Germany 2014 beat Brazil 7-1 and won the final in extra time. France 2018 won with a young squad and Kylian Mbappé. Croatia 2018 reached the final after three extra-time matches. Belgium 2018 finished third.",
      },
      {
        years: "2020-2026",
        title: "Messi, Mbappé and the 2026 field",
        body: "Argentina 2022 won the final on penalties against France after a 3-3 draw, and Messi scored seven goals. France 2022 had Mbappé's hat-trick in the final. Morocco 2022 became the first African semi-finalist. Japan 2022 beat Germany and Spain in the group. The 2026 squads are real and verified, with Spain, Argentina, England, France, Norway, Brazil and Portugal in the pool.",
      },
    ],
    sourceNote:
      "Rosters and tournament records are checked against public World Cup records. Ratings are editorial estimates for the game, not official FIFA data. Last updated 16 November 2026. If you spot a mistake, send a note through the contact page.",
    rankingTitle: "How to read a squad card",
    ranking: [
      "Average rating tells you depth. A high average means the squad has few weak spots. It does not guarantee a title. Brazil 1982 had one of the best midfields ever and lost to Italy. Italy 1982 started slowly and won the cup.",
      "The top player matters, but fit matters more. A 95-rated forward is only a 95 if he plays in a forward slot. If your formation needs a centre-back, a star striker will not solve it. Use the card to see the best player, the formation and the positions the squad can fill.",
      "Formation is the other clue. Brazil 1970 played 4-2-4. Netherlands 1974 used total football. Italy 2006 built on defence. Spain 2010 controlled the ball. Pick squads that can fill the slots you still need, not just the ones with the biggest names.",
      "Ratings are role-weighted. A goalkeeper is judged on reflexes, positioning and distribution. A centre-back is judged on tackling, aerial ability and passing. A midfielder is judged on passing, dribbling, work rate and stamina. A forward is judged on finishing, dribbling, pace and off-ball movement. That is why a 90-rated defender and a 90-rated striker are not the same kind of player.",
    ],
    faqTitle: "Questions about the squads",
    faq: [
      {
        q: "Which World Cup squad was the best?",
        a: "There is no single answer. Brazil 1970 won all six matches and scored 19 goals. Spain 2010 and Germany 2014 dominated their eras. Argentina 2022 won a final for the ages. The game lets you test the argument on the pitch.",
      },
      {
        q: "What formation did Brazil 1970 play?",
        a: "Brazil 1970 lined up in a 4-2-4. It gave them four attackers and two deep midfielders. The shape is still used as shorthand for attacking football.",
      },
      {
        q: "Which World Cup team had the highest rating?",
        a: "The cards on this page rank every squad by average player rating. Open the top teams to see the exact numbers. A high rating helps, but chemistry and slot fit decide most simulated cups.",
      },
      {
        q: "Are the 2026 squads included?",
        a: "Yes. The 2026 squads are real and verified. They are rated on the same scale as every other team, so you can draft them beside Brazil 1970 or Argentina 2022.",
      },
      {
        q: "How do I use this page to draft better?",
        a: "Find two or three squads that fit your open slots. Check the best player, the formation and the average rating. Then draft a core from one nation for chemistry and fill the rest with the best available fits.",
      },
    ],
    playCta: "Draft these squads",
    howCta: "Read the draft guide",
  },

  de: {
    eyebrow: "Kader-Bibliothek",
    h1: "WM-Kader: Jedes Team zum Draften",
    blogLink: "Willst du Draft-Strategie? Lies die Simulator-Guides im Blog",
    intro: (count: number) =>
      `Jeder WM-Kader in My World Cup XI steht hier. Das sind ${count} Turnierteams von 1970 bis 2026, sortiert nach durchschnittlicher Spielerbewertung und bereit zum Scouten. Du draftest aus diesen ${count} Kadern. Das Spiel nutzt zusätzlich neun Gruppengegner als KI-Teams, damit kommt der volle Pool auf 86 Teams. Diese Seite ist die Bibliothek hinter dem WM-Team-Builder. Jeder Kader hat eine Formation, Spielernamen und eine Bewertung für jeden Spieler. Die Bewertungen nutzen eine Skala, damit du Brasilien 1970 mit Argentinien 2022 vergleichen kannst. Suche nach Nation, Jahr oder Formation. Öffne einen Kader für die Spielerliste. Dann nimm das Wissen mit in den Draft.`,
    erasTitle: "Sechs Jahrzehnte, eine Skala",
    eras: [
      {
        years: "1970-1979",
        title: "Der Angriffsbauplan",
        body: "Brasilien 1970 ist der Maßstab: sechs Siege, 19 Tore und ein 4-2-4, das noch modern wirkt. Niederlande 1974 verloren das Finale, veränderten aber das Denken über Bewegung und Raum. Westdeutschland 1974 gewann zu Hause mit Beckenbauer und Müller. Polen 1974 wurde Dritter, Grzegorz Lato schoss sieben Tore. Argentinien 1978 holte den ersten Titel, Mario Kempes schoss sechs.",
      },
      {
        years: "1980-1989",
        title: "Härte, Debatten und Maradona",
        body: "Italien 1982 startete mit drei Unentschieden, dann schlug es Brasilien, Argentinien, Polen und Westdeutschland. Paolo Rossi schoss sechs Tore nach einer stillen Gruppenphase. Frankreich 1982 hatte Platini und ein Mittelfeld, das durch jede Abwehr passte, verlor aber das Halbfinale gegen Westdeutschland im Elfmeterschießen. Argentinien 1986 war Maradonas Turnier: fünf Tore, fünf Vorlagen und die zwei berühmtesten Tore des Jahrzehnts. Dänemark 1986 war der Liebling der Neutralen, bevor es 1:5 gegen Spanien verlor.",
      },
      {
        years: "1990-1999",
        title: "Abwehr, Elfmeter und neue Nationen",
        body: "Westdeutschland 1990 gewann das Finale 1:0 gegen Argentinien. Brasilien 1994 beendete eine 24-jährige Wartezeit im Elfmeterschießen gegen Italien. Frankreich 1998 gewann zu Hause, Zidane traf zweimal im Finale, und die Abwehr kassierte zwei Tore in sieben Spielen. Kroatien 1998 wurde Dritter bei der ersten WM als unabhängige Nation, Davor Šuker schoss sechs Tore. Bulgarien 1994 und Schweden 1994 waren die Überraschungs-Halbfinalisten.",
      },
      {
        years: "2000-2009",
        title: "Die drei R und die Wand",
        body: "Brasilien 2002 hatte Ronaldo, Rivaldo und Ronaldinho und gewann alle sieben Spiele. Deutschland 2002 erreichte das Finale mit einem jungen Michael Ballack und Oliver Kahn. Italien 2006 kassierte zwei Tore im Turnier, eines davon ein Eigentor, und gewann im Elfmeterschießen. Frankreich 2006 hatte Zidanes letzten Lauf. Portugal 2006 erreichte das Halbfinale mit einem jungen Cristiano Ronaldo.",
      },
      {
        years: "2010-2019",
        title: "Ballbesitz, Pressing und ein 7:1",
        body: "Spanien 2010 gewann mit Tiki-Taka und vier 1:0-Siegen in Folge im K.-o.-Spiel. Niederlande 2010 erreichten das Finale mit Arjen Robben und Wesley Sneijder. Deutschland 2014 schlug Brasilien 7:1 und gewann das Finale in der Verlängerung. Frankreich 2018 gewann mit einem jungen Kader und Kylian Mbappé. Kroatien 2018 erreichte das Finale nach drei Verlängerungen. Belgien 2018 wurde Dritter.",
      },
      {
        years: "2020-2026",
        title: "Messi, Mbappé und das Feld 2026",
        body: "Argentinien 2022 gewann das Finale im Elfmeterschießen gegen Frankreich nach einem 3:3, Messi schoss sieben Tore. Frankreich 2022 hatte Mbappés Hattrick im Finale. Marokko 2022 wurde der erste afrikanische Halbfinalist. Japan 2022 schlug Deutschland und Spanien in der Gruppe. Die Kader 2026 sind echt und geprüft: Spanien, Argentinien, England, Frankreich, Norwegen, Brasilien und Portugal sind im Pool.",
      },
    ],
    sourceNote:
      "Kader und Turnierdaten werden mit öffentlichen WM-Aufzeichnungen geprüft. Bewertungen sind redaktionelle Schätzungen für das Spiel, keine offiziellen FIFA-Daten. Zuletzt aktualisiert am 16. November 2026. Wenn du einen Fehler findest, schreib über die Kontaktseite.",
    rankingTitle: "So liest du eine Kaderkarte",
    ranking: [
      "Die Durchschnittsbewertung zeigt Tiefe. Ein hoher Wert bedeutet wenige Schwachstellen. Er garantiert keinen Titel. Brasilien 1982 hatte eines der besten Mittelfelder aller Zeiten und verlor gegen Italien. Italien 1982 startete langsam und gewann den Pokal.",
      "Der beste Spieler zählt, aber Passung zählt mehr. Ein 95er Stürmer ist nur dann 95, wenn er auf einer Stürmerposition spielt. Wenn deine Formation einen Innenverteidiger braucht, löst ein Star-Stürmer das Problem nicht. Nutze die Karte, um besten Spieler, Formation und mögliche Positionen zu sehen.",
      "Die Formation ist der andere Hinweis. Brasilien 1970 spielte 4-2-4. Niederlande 1974 nutzten Total Football. Italien 2006 bauten auf Abwehr. Spanien 2010 kontrollierten den Ball. Wähle Kader, die deine offenen Plätze füllen, nicht nur die mit den größten Namen.",
      "Bewertungen sind rollengewichtet. Ein Torwart wird nach Reflexen, Stellungsspiel und Spielaufbau beurteilt. Ein Innenverteidiger nach Zweikampf, Kopfball und Passspiel. Ein Mittelfeldspieler nach Passspiel, Dribbling, Laufarbeit und Ausdauer. Ein Stürmer nach Abschluss, Dribbling, Tempo und Laufwegen. Deshalb sind ein 90er Verteidiger und ein 90er Stürmer nicht derselbe Spielertyp.",
      "Öffne zwei Kader und vergleiche sie, bevor du draftest. Ein Team mit vielen 85ern kann besser passen als ein Team mit einem 95er und drei Lücken. Die Karten zeigen den besten Spieler und die Formation. Mehr brauchst du für den ersten Plan nicht.",
    ],
    faqTitle: "Fragen zu den Kadern",
    faq: [
      {
        q: "Welcher WM-Kader war der beste?",
        a: "Es gibt keine einzige Antwort. Brasilien 1970 gewann alle sechs Spiele und schoss 19 Tore. Spanien 2010 und Deutschland 2014 dominierten ihre Epochen. Argentinien 2022 gewann ein Finale für die Ewigkeit. Das Spiel lässt dich die Debatte auf dem Platz testen.",
      },
      {
        q: "Welche Formation spielte Brasilien 1970?",
        a: "Brasilien 1970 spielte ein 4-2-4. Es gab ihnen vier Angreifer und zwei tiefe Mittelfeldspieler. Die Form gilt noch heute als Kurzform für Angriffsfußball.",
      },
      {
        q: "Welches WM-Team hatte die höchste Bewertung?",
        a: "Die Karten auf dieser Seite sortieren jeden Kader nach durchschnittlicher Spielerbewertung. Öffne die Top-Teams für die genauen Zahlen. Eine hohe Bewertung hilft, aber Chemie und Platzpassung entscheiden die meisten simulierten Pokale.",
      },
      {
        q: "Sind die Kader 2026 dabei?",
        a: "Ja. Die Kader 2026 sind echt und geprüft. Sie werden auf derselben Skala bewertet wie jedes andere Team, deshalb kannst du sie neben Brasilien 1970 oder Argentinien 2022 draften.",
      },
      {
        q: "Wie nutze ich diese Seite für einen besseren Draft?",
        a: "Finde zwei oder drei Kader, die zu deinen offenen Plätzen passen. Prüfe besten Spieler, Formation und Durchschnittsbewertung. Dann draftest du einen Kern aus einer Nation für Chemie und füllst den Rest mit den besten verfügbaren Passungen.",
      },
    ],
    playCta: "Diese Kader draften",
    howCta: "Draft-Anleitung lesen",
  },
  fr: {
    eyebrow: "Bibliothèque d'effectifs",
    h1: "Effectifs de Coupe du Monde : chaque équipe à drafter",
    blogLink:
      "Besoin de stratégie ? Lisez les guides du simulateur sur le blog",
    intro: (count: number) =>
      `Chaque effectif de Coupe du Monde de My World Cup XI est ici. Cela fait ${count} équipes de tournoi de 1970 à 2026, classées par note moyenne et prêtes à observer. Vous draftez parmi ces ${count} effectifs. Le jeu utilise aussi neuf adversaires de groupe comme équipes IA, ce qui porte le pool complet à 86 équipes. Cette page est la bibliothèque derrière le constructeur d'équipe. Chaque effectif a une formation, des noms et une note par joueur. Les notes utilisent une seule échelle, pour comparer le Brésil 1970 avec l'Argentine 2022. Cherchez par nation, année ou formation. Ouvrez un effectif pour voir la liste des joueurs. Puis entrez dans le draft avec ces informations.`,
    erasTitle: "Six décennies, une échelle",
    eras: [
      {
        years: "1970-1979",
        title: "Le modèle offensif",
        body: "Le Brésil 1970 est la référence : six victoires, 19 buts et un 4-2-4 qui semble encore moderne. Les Pays-Bas 1974 ont perdu la finale mais changé la pensée sur le mouvement et l'espace. L'Allemagne de l'Ouest 1974 a gagné à domicile avec Beckenbauer et Müller. La Pologne 1974 a fini troisième, Grzegorz Lato a marqué sept buts. L'Argentine 1978 a gagné son premier titre, Mario Kempes a marqué six buts.",
      },
      {
        years: "1980-1989",
        title: "Dureté, débats et Maradona",
        body: "L'Italie 1982 a commencé par trois nuls, puis a battu le Brésil, l'Argentine, la Pologne et l'Allemagne de l'Ouest. Paolo Rossi a marqué six buts après une phase de groupes discrète. La France 1982 avait Platini et un milieu capable de passer à travers tout, mais a perdu la demi-finale contre l'Allemagne de l'Ouest aux tirs au but. L'Argentine 1986 était le tournoi de Maradona : cinq buts, cinq passes et les deux buts les plus célèbres de la décennie. Le Danemark 1986 était le favori des neutres avant une défaite 5-1 contre l'Espagne.",
      },
      {
        years: "1990-1999",
        title: "Défense, tirs au but et nouvelles nations",
        body: "L'Allemagne de l'Ouest 1990 a gagné la finale 1-0 contre l'Argentine. Le Brésil 1994 a mis fin à 24 ans d'attente aux tirs au but contre l'Italie. La France 1998 a gagné à domicile, Zidane a marqué deux fois en finale et la défense a encaissé deux buts en sept matchs. La Croatie 1998 a fini troisième pour sa première Coupe du Monde en tant que nation indépendante, Davor Šuker a marqué six buts. La Bulgarie 1994 et la Suède 1994 étaient les demi-finalistes surprises.",
      },
      {
        years: "2000-2009",
        title: "Les trois R et le mur",
        body: "Le Brésil 2002 avait Ronaldo, Rivaldo et Ronaldinho, et a gagné ses sept matchs. L'Allemagne 2002 a atteint la finale avec un jeune Michael Ballack et Oliver Kahn. L'Italie 2006 a encaissé deux buts dans le tournoi, dont un contre son camp, et a gagné aux tirs au but. La France 2006 a vécu le dernier tour de Zidane. Le Portugal 2006 a atteint les demi-finales avec un jeune Cristiano Ronaldo.",
      },
      {
        years: "2010-2019",
        title: "Possession, pressing et un 7-1",
        body: "L'Espagne 2010 a gagné avec le tiki-taka et quatre victoires 1-0 de suite en phase finale. Les Pays-Bas 2010 ont atteint la finale avec Arjen Robben et Wesley Sneijder. L'Allemagne 2014 a battu le Brésil 7-1 et gagné la finale en prolongation. La France 2018 a gagné avec un jeune groupe et Kylian Mbappé. La Croatie 2018 a atteint la finale après trois prolongations. La Belgique 2018 a fini troisième.",
      },
      {
        years: "2020-2026",
        title: "Messi, Mbappé et le plateau 2026",
        body: "L'Argentine 2022 a gagné la finale aux tirs au but contre la France après un 3-3, et Messi a marqué sept buts. La France 2022 a eu le triplé de Mbappé en finale. Le Maroc 2022 est devenu le premier demi-finaliste africain. Le Japon 2022 a battu l'Allemagne et l'Espagne en groupe. Les effectifs 2026 sont réels et vérifiés : l'Espagne, l'Argentine, l'Angleterre, la France, la Norvège, le Brésil et le Portugal sont dans le pool.",
      },
    ],
    sourceNote:
      "Les effectifs et les résultats de tournoi sont vérifiés avec les archives publiques de la Coupe du Monde. Les notes sont des estimations éditoriales pour le jeu, pas des données officielles de la FIFA. Dernière mise à jour : 16 novembre 2026. Si vous trouvez une erreur, écrivez via la page de contact.",
    rankingTitle: "Comment lire une fiche d'effectif",
    ranking: [
      "La note moyenne indique la profondeur. Une note haute signifie peu de points faibles. Elle ne garantit pas un titre. Le Brésil 1982 avait l'un des meilleurs milieux de l'histoire et a perdu contre l'Italie. L'Italie 1982 a mal commencé et a gagné la coupe.",
      "Le meilleur joueur compte, mais la justesse compte plus. Un attaquant à 95 n'est à 95 que s'il joue à un poste d'attaquant. Si votre formation a besoin d'un défenseur central, une star offensive ne résout pas le problème. Utilisez la fiche pour voir le meilleur joueur, la formation et les postes possibles.",
      "La formation est l'autre indice. Le Brésil 1970 jouait en 4-2-4. Les Pays-Bas 1974 utilisaient le football total. L'Italie 2006 s'appuyait sur la défense. L'Espagne 2010 contrôlait le ballon. Choisissez des effectifs qui remplissent vos postes libres, pas seulement ceux avec les plus grands noms.",
      "Les notes sont pondérées par rôle. Un gardien est jugé sur ses réflexes, son placement et sa relance. Un défenseur central sur son tacle, son jeu aérien et sa passe. Un milieu sur sa passe, son dribble, son activité et son endurance. Un attaquant sur sa finition, son dribble, sa vitesse et ses déplacements. C'est pourquoi un défenseur à 90 et un attaquant à 90 ne sont pas le même type de joueur.",
      "Ouvrez deux effectifs et comparez-les avant de drafter. Une équipe avec beaucoup de joueurs à 85 peut mieux convenir qu'une équipe avec un 95 et trois trous. Les fiches montrent le meilleur joueur et la formation. Vous n'avez pas besoin de plus pour votre premier plan.",
    ],
    faqTitle: "Questions sur les effectifs",
    faq: [
      {
        q: "Quel effectif de Coupe du Monde était le meilleur ?",
        a: "Il n'y a pas une seule réponse. Le Brésil 1970 a gagné ses six matchs et marqué 19 buts. L'Espagne 2010 et l'Allemagne 2014 ont dominé leur époque. L'Argentine 2022 a gagné une finale pour l'histoire. Le jeu vous laisse tester le débat sur le terrain.",
      },
      {
        q: "Quelle formation jouait le Brésil 1970 ?",
        a: "Le Brésil 1970 jouait en 4-2-4. Cela donnait quatre attaquants et deux milieux défensifs. La forme est encore utilisée comme raccourci pour le football offensif.",
      },
      {
        q: "Quelle équipe de Coupe du Monde avait la meilleure note ?",
        a: "Les fiches de cette page classent chaque effectif par note moyenne. Ouvrez les meilleures équipes pour voir les chiffres exacts. Une note haute aide, mais la chimie et la justesse des postes décident la plupart des coupes simulées.",
      },
      {
        q: "Les effectifs 2026 sont-ils inclus ?",
        a: "Oui. Les effectifs 2026 sont réels et vérifiés. Ils sont notés sur la même échelle que toutes les autres équipes, donc vous pouvez les drafter à côté du Brésil 1970 ou de l'Argentine 2022.",
      },
      {
        q: "Comment utiliser cette page pour mieux drafter ?",
        a: "Trouvez deux ou trois effectifs qui correspondent à vos postes libres. Vérifiez le meilleur joueur, la formation et la note moyenne. Puis draftez un noyau d'une nation pour la chimie et remplissez le reste avec les meilleures positions disponibles.",
      },
    ],
    playCta: "Drafter ces effectifs",
    howCta: "Lire le guide du draft",
  },
  ja: {
    eyebrow: "チームライブラリ",
    h1: "ワールドカップのチーム：ドラフトできる全チーム",
    blogLink: "ドラフト戦略を知りたい？ブログのシミュレーターガイドを読もう",
    intro: (count: number) =>
      `My World Cup XIのワールドカップ・チームがここにそろっています。1970年から2026年までの${count}チームを、平均レーティング順に並べ、スカウトできる状態にしました。あなたがドラフトできるのは、この${count}チームです。ゲームはさらに9つのグループステージ相手をAIチームとして使うので、全体では86チームになります。このページは、チームビルダーの背後にあるライブラリです。各チームにはフォーメーション、選手名、選手ごとの評価があります。評価は1つのスケールなので、ブラジル1970とアルゼンチン2022を比べられます。国、年、フォーメーションで検索してください。チームを開けば選手リストが見られます。その知識をドラフトに持っていきましょう。`,
    erasTitle: "6つの十年、1つのスケール",
    eras: [
      {
        years: "1970-1979",
        title: "攻撃の設計図",
        body: "ブラジル1970が基準です。6戦全勝、19ゴール、そして今見ても新しい4-2-4。オランダ1974は決勝に負けましたが、動きと空間の考え方を変えました。西ドイツ1974はベッケンバウアーとミュラーで地元優勝。ポーランド1974は3位で、グジェゴシュ・ラトが7ゴール。アルゼンチン1978は初優勝、マリオ・ケンペスが6ゴール。",
      },
      {
        years: "1980-1989",
        title: "激しさ、議論、そしてマラドーナ",
        body: "イタリア1982は3引き分けで始まり、その後ブラジル、アルゼンチン、ポーランド、西ドイツを破りました。パオロ・ロッシは静かなグループステージのあと6ゴール。フランス1982はプラティニと、どこでも通せる中盤を持ちながら、準決勝で西ドイツにPK負け。アルゼンチン1986はマラドーナの大会で、5ゴール、5アシスト、そして10年で最も有名な2ゴール。デンマーク1986は中立ファンの人気を集めましたが、スペインに1-5で敗れました。",
      },
      {
        years: "1990-1999",
        title: "守備、PK、新しい国々",
        body: "西ドイツ1990は決勝でアルゼンチンを1-0。ブラジル1994は24年ぶりの優勝を、イタリアとのPK戦で決めました。フランス1998は地元優勝。ジダンが決勝で2ゴール、守備は7試合で2失点。クロアチア1998は独立後初のワールドカップで3位、ダヴォール・シューケルが6ゴール。ブルガリア1994とスウェーデン1994は驚きの準決勝進出でした。",
      },
      {
        years: "2000-2009",
        title: "3Rと壁",
        body: "ブラジル2002はロナウド、リバウド、ロナウジーニョを擁し、7戦全勝。ドイツ2002は若いミヒャエル・バラックとオリバー・カーンで決勝へ。イタリア2006は大会で2失点、うち1つはオウンゴールで、PK戦で優勝。フランス2006はジダンの最後の大会。ポルトガル2006は若いクリスティアーノ・ロナウドとともに準決勝へ。",
      },
      {
        years: "2010-2019",
        title: "ポゼッション、プレス、そして7-1",
        body: "スペイン2010はティキタカと、決勝トーナメント4試合連続1-0で優勝。オランダ2010はアリエン・ロッベンとウェスレイ・スナイデルで決勝へ。ドイツ2014はブラジルを7-1で破り、決勝を延長で制しました。フランス2018は若いチームとキリアン・エムバペで優勝。クロアチア2018は3試合の延長戦を経て決勝へ。ベルギー2018は3位。",
      },
      {
        years: "2020-2026",
        title: "メッシ、エムバペ、2026年の顔ぶれ",
        body: "アルゼンチン2022は3-3の末、フランスとのPK戦を制し、メッシは7ゴール。フランス2022は決勝でエムバペのハットトリック。モロッコ2022はアフリカ勢初の準決勝進出。日本2022はグループでドイツとスペインを破りました。2026年のチームは実在し、検証済み。スペイン、アルゼンチン、イングランド、フランス、ノルウェー、ブラジル、ポルトガルがプールにいます。",
      },
    ],
    sourceNote:
      "チームと大会記録は公開されているワールドカップ記録で確認しています。評価はゲーム用の編集上の推定で、FIFAの公式データではありません。最終更新：2026年11月16日。誤りを見つけたら、コンタクトページから知らせてください。",
    rankingTitle: "チームカードの読み方",
    ranking: [
      "平均レーティングは層の厚さを示します。高いほど弱点が少ないです。ただし優勝を保証しません。ブラジル1982は史上最高の中盤の1つを持ちながら、イタリアに負けました。イタリア1982はゆっくり始まり、優勝しました。",
      "トップ選手も大事ですが、相性の方が大事です。95のFWは、FWの位置でプレーして初めて95です。フォーメーションがCBを必要としているなら、スターFWでは解決しません。カードでトップ選手、フォーメーション、埋められるポジションを確認しましょう。",
      "フォーメーションも手がかりです。ブラジル1970は4-2-4。オランダ1974はトータルフットボール。イタリア2006は守備。スペイン2010はボール支配。残っているポジションを埋められるチームを選びましょう。名前が大きいだけのチームではありません。",
      "評価はポジションごとの重み付きです。GKは反射、位置取り、配球。CBはタックル、空中戦、パス。MFはパス、ドリブル、ワークレート、スタミナ。FWはフィニッシュ、ドリブル、スピード、オフザボール。だから90のDFと90のFWは同じ種類の選手ではありません。",
      "2つのチームを開いて比べてからドラフトしましょう。85が多くそろったチームは、95が1人いて穴が3つあるチームより合うことがあります。カードにはトップ選手とフォーメーションが出ます。最初の計画にはそれで十分です。",
    ],
    faqTitle: "チームについての質問",
    faq: [
      {
        q: "史上最強のワールドカップ・チームはどれですか？",
        a: "1つの答えはありません。ブラジル1970は6戦全勝で19ゴール。スペイン2010とドイツ2014はそれぞれの時代を支配しました。アルゼンチン2022は語り継がれる決勝を制しました。ゲームでは、その議論をピッチで試せます。",
      },
      {
        q: "ブラジル1970はどんなフォーメーションでしたか？",
        a: "ブラジル1970は4-2-4でした。FWが4人、深いMFが2人。この形は今でも攻撃サッカーの代名詞として使われます。",
      },
      {
        q: "最も評価の高いワールドカップチームはどれですか？",
        a: "このページのカードが、全チームを平均レーティング順に並べています。上位チームを開けば正確な数字が見られます。高い評価は助けになりますが、シミュレートされた大会の多くはケミストリーとポジション相性で決まります。",
      },
      {
        q: "2026年のチームは入っていますか？",
        a: "はい。2026年のチームは実在し、検証済みです。ほかの全チームと同じスケールで評価されているので、ブラジル1970やアルゼンチン2022の隣でドラフトできます。",
      },
      {
        q: "このページをドラフトにどう使えばいいですか？",
        a: "空いているポジションに合うチームを2つか3つ見つけます。トップ選手、フォーメーション、平均レーティングを確認します。そしてケミストリーのために1か国の核をドラフトし、残りは空きポジションに合う最良の選手で埋めます。",
      },
    ],
    playCta: "このチームでドラフト",
    howCta: "ドラフトガイドを読む",
  },
  es: {
    eyebrow: "Biblioteca de plantillas",
    h1: "Plantillas del Mundial: cada equipo para draftear",
    blogLink: "¿Quieres estrategia? Lee las guías del simulador en el blog",
    intro: (count: number) =>
      `Cada plantilla del Mundial de My World Cup XI está aquí. Son ${count} equipos de torneo de 1970 a 2026, ordenados por valoración media y listos para observar. Drafteas de estas ${count} plantillas. El juego también usa nueve rivales de grupo como equipos IA, así que el pool completo llega a 86 equipos. Esta página es la biblioteca detrás del constructor de equipo. Cada plantilla tiene formación, nombres y una valoración por jugador. Las valoraciones usan una sola escala, para comparar el Brasil 1970 con la Argentina 2022. Busca por nación, año o formación. Abre una plantilla para ver la lista de jugadores. Luego entra al draft con esa información.`,
    erasTitle: "Seis décadas, una escala",
    eras: [
      {
        years: "1970-1979",
        title: "El plano ofensivo",
        body: "Brasil 1970 es la referencia: seis victorias, 19 goles y un 4-2-4 que todavía parece moderno. Países Bajos 1974 perdió la final pero cambió la forma de pensar el movimiento y el espacio. Alemania Occidental 1974 ganó en casa con Beckenbauer y Müller. Polonia 1974 fue tercera, Grzegorz Lato marcó siete goles. Argentina 1978 ganó su primer título, Mario Kempes marcó seis.",
      },
      {
        years: "1980-1989",
        title: "Dureza, debates y Maradona",
        body: "Italia 1982 empezó con tres empates, luego venció a Brasil, Argentina, Polonia y Alemania Occidental. Paolo Rossi marcó seis goles tras una fase de grupos discreta. Francia 1982 tenía a Platini y un medio que pasaba por cualquier defensa, pero perdió la semifinal contra Alemania Occidental en penales. Argentina 1986 fue el torneo de Maradona: cinco goles, cinco asistencias y los dos goles más famosos de la década. Dinamarca 1986 era el favorito de los neutrales antes de una derrota 5-1 contra España.",
      },
      {
        years: "1990-1999",
        title: "Defensa, penales y nuevas naciones",
        body: "Alemania Occidental 1990 ganó la final 1-0 contra Argentina. Brasil 1994 terminó una espera de 24 años en penales contra Italia. Francia 1998 ganó en casa, Zidane marcó dos veces en la final y la defensa encajó dos goles en siete partidos. Croacia 1998 fue tercera en su primer Mundial como nación independiente, Davor Šuker marcó seis. Bulgaria 1994 y Suecia 1994 fueron los semifinalistas sorpresa.",
      },
      {
        years: "2000-2009",
        title: "Las tres R y el muro",
        body: "Brasil 2002 tenía a Ronaldo, Rivaldo y Ronaldinho, y ganó sus siete partidos. Alemania 2002 llegó a la final con un joven Michael Ballack y Oliver Kahn. Italia 2006 encajó dos goles en el torneo, uno en propia puerta, y ganó en penales. Francia 2006 tuvo el último recorrido de Zidane. Portugal 2006 llegó a semifinales con un joven Cristiano Ronaldo.",
      },
      {
        years: "2010-2019",
        title: "Posesión, presión y un 7-1",
        body: "España 2010 ganó con tiki-taka y cuatro victorias 1-0 seguidas en eliminación. Países Bajos 2010 llegó a la final con Arjen Robben y Wesley Sneijder. Alemania 2014 venció 7-1 a Brasil y ganó la final en prórroga. Francia 2018 ganó con un grupo joven y Kylian Mbappé. Croacia 2018 llegó a la final tras tres prórrogas. Bélgica 2018 fue tercera.",
      },
      {
        years: "2020-2026",
        title: "Messi, Mbappé y el campo de 2026",
        body: "Argentina 2022 ganó la final en penales contra Francia tras un 3-3, y Messi marcó siete goles. Francia 2022 tuvo el hat-trick de Mbappé en la final. Marruecos 2022 se convirtió en el primer semifinalista africano. Japón 2022 venció a Alemania y España en el grupo. Las plantillas de 2026 son reales y verificadas: España, Argentina, Inglaterra, Francia, Noruega, Brasil y Portugal están en el pool.",
      },
    ],
    sourceNote:
      "Las plantillas y los registros del torneo se comprueban con archivos públicos del Mundial. Las valoraciones son estimaciones editoriales para el juego, no datos oficiales de la FIFA. Última actualización: 16 de noviembre de 2026. Si ves un error, escribe por la página de contacto.",
    rankingTitle: "Cómo leer una ficha de plantilla",
    ranking: [
      "La valoración media indica profundidad. Una nota alta significa pocos puntos débiles. No garantiza un título. Brasil 1982 tenía uno de los mejores medios de la historia y perdió contra Italia. Italia 1982 empezó lento y ganó la copa.",
      "El mejor jugador importa, pero el encaje importa más. Un delantero de 95 solo es 95 si juega en un puesto de delantero. Si tu formación necesita un central, una estrella ofensiva no resuelve el problema. Usa la ficha para ver el mejor jugador, la formación y los puestos posibles.",
      "La formación es la otra pista. Brasil 1970 jugaba 4-2-4. Países Bajos 1974 usaba fútbol total. Italia 2006 se apoyaba en la defensa. España 2010 controlaba el balón. Elige plantillas que llenen tus puestos libres, no solo las de nombres más grandes.",
      "Las valoraciones se ponderan por puesto. Un portero se mide por reflejos, colocación y distribución. Un central por entradas, juego aéreo y pase. Un medio por pase, regate, trabajo y resistencia. Un delantero por definición, regate, velocidad y desmarque. Por eso un defensa de 90 y un delantero de 90 no son el mismo tipo de jugador.",
      "Abre dos plantillas y compáralas antes de draftear. Un equipo con muchos 85 puede encajar mejor que uno con un 95 y tres huecos. Las fichas muestran el mejor jugador y la formación. No necesitas más para tu primer plan.",
    ],
    faqTitle: "Preguntas sobre las plantillas",
    faq: [
      {
        q: "¿Cuál fue la mejor plantilla del Mundial?",
        a: "No hay una sola respuesta. Brasil 1970 ganó sus seis partidos y marcó 19 goles. España 2010 y Alemania 2014 dominaron su época. Argentina 2022 ganó una final para la historia. El juego te deja probar el debate en la cancha.",
      },
      {
        q: "¿Qué formación jugaba Brasil 1970?",
        a: "Brasil 1970 jugaba un 4-2-4. Le daba cuatro atacantes y dos medios profundos. La forma se sigue usando como sinónimo de fútbol ofensivo.",
      },
      {
        q: "¿Qué equipo del Mundial tuvo la valoración más alta?",
        a: "Las fichas de esta página ordenan cada plantilla por valoración media. Abre los mejores equipos para ver los números exactos. Una nota alta ayuda, pero la química y el encaje de puestos deciden la mayoría de las copas simuladas.",
      },
      {
        q: "¿Están las plantillas de 2026?",
        a: "Sí. Las plantillas de 2026 son reales y verificadas. Se valoran en la misma escala que todos los demás equipos, así que puedes draftearlas junto al Brasil 1970 o la Argentina 2022.",
      },
      {
        q: "¿Cómo uso esta página para draftear mejor?",
        a: "Encuentra dos o tres plantillas que encajen en tus puestos libres. Revisa el mejor jugador, la formación y la valoración media. Luego draftea un núcleo de una nación para la química y llena el resto con los mejores encajes disponibles.",
      },
    ],
    playCta: "Draftear estas plantillas",
    howCta: "Leer la guía del draft",
  },
};

export type TeamsIndexContent = Omit<
  (typeof teamsIndex)["en"],
  "eras" | "faqTitle" | "faq" | "playCta" | "howCta" | "sourceNote"
> & {
  eras?: { years: string; title: string; body: string }[];
  sourceNote?: string;
  faqTitle?: string;
  faq?: { q: string; a: string }[];
  playCta?: string;
  howCta?: string;
};
