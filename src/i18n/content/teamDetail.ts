type TeamArgs = {
  nation: string;
  year: string;
  formation: string;
  top: string;
  rating: number;
};

export const teamDetail = {
  en: {
    eyebrow: "Historical Squad",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `The ${nation} World Cup ${year} squad played a ${formation}. ${top} was the highest-rated player at ${rating}. Every listed player uses the same rating scale as the rest of the game, so you can compare this side with Brazil 1970 or Argentina 2022. Draft them and see how they fare.`,
    ctaPlay: "Play",
    ctaAll: "All teams",
    other: (nation: string) => `Other ${nation} squads:`,
    rosterTitle: "Roster & ratings",
    wcHeading: (nation: string, year: string) =>
      `${nation} at the ${year} World Cup`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation} arrived at the ${year} World Cup with a squad built around ${top}, their highest-rated player at ${rating} overall. The ${formation} shape mixed experienced leaders with newer talent. The ratings above show where the team was strong and where it was thin.`,
      `Average rating says something about depth, not about how a tournament will go. Form, the draw and a single mistake can decide a knockout match. That is why the same squad can look unstoppable in one run and go out early in the next.`,
      `You can compare ${nation} ${year} with every other squad in the index, from Brazil 1970 to Argentina 2022. Use the year navigation above to see the other ${nation} sides and how the squad changed.`,
      `When you are ready, draft this squad or build your own XI from World Cup history, then take it through a full tournament.`,
    ],
    readMoreBtn: "Read more",
    showLessBtn: "Show less",
  },
  de: {
    eyebrow: "Historische Mannschaft",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `Der Kader von ${nation} für die WM ${year} spielte eine ${formation}. ${top} war mit ${rating} der bestbewertete Spieler. Alle gelisteten Spieler sind auf derselben Skala bewertet, die im ganzen Spiel gilt. So kannst du dieses Team mit Brasilien 1970 oder Argentinien 2022 vergleichen. Draft es und sieh, wie es sich schlägt.`,
    ctaPlay: "Spielen",
    ctaAll: "Alle Teams",
    other: (nation: string) => `Weitere ${nation}-Kader:`,
    rosterTitle: "Kader & Bewertungen",
    wcHeading: (nation: string, year: string) => `${nation} bei der WM ${year}`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation} kam zur WM ${year} mit einem Kader rund um ${top}, den bestbewerteten Spieler der Mannschaft mit ${rating}. Die ${formation} mischte erfahrene Führungsspieler mit jüngeren Talenten. Die Bewertungen oben zeigen, wo das Team stark war und wo es dünn besetzt war.`,
      `Die Durchschnittsbewertung sagt etwas über die Tiefe des Kaders, nicht über den Turnierverlauf. Form, Losglück und ein einzelner Fehler können ein K.-o.-Spiel entscheiden. Deshalb kann derselbe Kader in einem Lauf unaufhaltsam wirken und im nächsten früh ausscheiden.`,
      `Du kannst ${nation} ${year} mit jedem anderen Kader im Index vergleichen, von Brasilien 1970 bis Argentinien 2022. Nutze die Jahresnavigation oben, um die anderen Teams von ${nation} zu sehen und zu verfolgen, wie sich der Kader verändert hat.`,
      `Wenn du bereit bist, draft diesen Kader oder baue dein eigenes XI aus der WM-Geschichte und nimm es durch ein ganzes Turnier.`,
    ],
    readMoreBtn: "Mehr lesen",
    showLessBtn: "Weniger",
  },
  fr: {
    eyebrow: "Équipe historique",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `L'effectif ${nation} de la Coupe du Monde ${year} jouait en ${formation}. ${top} était le joueur le mieux noté avec ${rating}. Chaque joueur listé est noté sur la même échelle que le reste du jeu, ce qui permet de comparer cette équipe au Brésil 1970 ou à l'Argentine 2022. Draftez-la et voyez ce qu'elle donne.`,
    ctaPlay: "Jouer",
    ctaAll: "Toutes les équipes",
    other: (nation: string) => `Autres effectifs ${nation} :`,
    rosterTitle: "Effectif & notes",
    wcHeading: (nation: string, year: string) =>
      `${nation} à la Coupe du Monde ${year}`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation} est arrivé à la Coupe du Monde ${year} avec un effectif construit autour de ${top}, son joueur le mieux noté à ${rating}. La forme ${formation} mêlait des cadres expérimentés à de jeunes talents. Les notes ci-dessus montrent où l'équipe était forte et où elle manquait de profondeur.`,
      `La note moyenne renseigne sur la profondeur du groupe, pas sur le déroulement d'un tournoi. La forme, le tirage et une seule erreur peuvent décider d'un match à élimination directe. C'est pourquoi le même effectif peut sembler imbattable dans une partie et sortir tôt dans la suivante.`,
      `Vous pouvez comparer ${nation} ${year} à chaque autre effectif de l'index, du Brésil 1970 à l'Argentine 2022. Utilisez la navigation par année ci-dessus pour voir les autres équipes de ${nation} et suivre l'évolution du groupe.`,
      `Quand vous êtes prêt, draftez cet effectif ou composez votre propre XI avec toute l'histoire de la Coupe du Monde, puis faites-le jouer un tournoi complet.`,
    ],
    readMoreBtn: "Lire plus",
    showLessBtn: "Voir moins",
  },
  ja: {
    eyebrow: "歴代チーム",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `${nation}のワールドカップ${year}代表は${formation}で戦いました。最高評価は${top}の総合${rating}です。掲載選手はすべてゲーム共通の尺度で評価しているので、ブラジル1970やアルゼンチン2022とも比べられます。ドラフトして、どこまで通用するか見てみましょう。`,
    ctaPlay: "プレイ",
    ctaAll: "全チーム",
    other: (nation: string) => `他の${nation}チーム：`,
    rosterTitle: "ロースター＆レーティング",
    wcHeading: (nation: string, year: string) =>
      `${nation}のワールドカップ${year}`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation}は${top}を中心にチームを作り、ワールドカップ${year}に臨みました。${top}は総合${rating}でチーム最高評価です。${formation}の形で、経験のあるリーダーと若手が混ざっていました。上の評価を見れば、どこが強く、どこが薄いか分かります。`,
      `平均評価は層の厚さを示す数字で、大会の結果を約束するものではありません。調子、抽選、1つのミスで決勝トーナメントは変わります。だから同じチームが、ある大会では強く見え、次の大会では早く敗退することがあります。`,
      `${nation} ${year}は、ブラジル1970からアルゼンチン2022まで、ほかの全チームと比べられます。上の年ナビゲーションで${nation}の別の大会を開き、チームがどう変わったか見てみましょう。`,
      `準備ができたら、このチームをドラフトするか、ワールドカップ史から自分のXIを組んで、大会を最後まで戦わせてみましょう。`,
    ],
    readMoreBtn: "もっと読む",
    showLessBtn: "閉じる",
  },
  es: {
    eyebrow: "Equipo histórico",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `La plantilla de ${nation} del Mundial ${year} jugaba en ${formation}. ${top} era el jugador mejor valorado, con ${rating}. Cada jugador de la lista usa la misma escala que el resto del juego, así puedes comparar este equipo con Brasil 1970 o Argentina 2022. Draftéalo y mira cómo responde.`,
    ctaPlay: "Jugar",
    ctaAll: "Todos los equipos",
    other: (nation: string) => `Otras plantillas de ${nation}:`,
    rosterTitle: "Plantilla y valoraciones",
    wcHeading: (nation: string, year: string) =>
      `${nation} en el Mundial ${year}`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation} llegó al Mundial ${year} con una plantilla construida alrededor de ${top}, su jugador mejor valorado con ${rating}. La forma ${formation} mezclaba líderes con experiencia y talento joven. Las valoraciones de arriba muestran dónde era fuerte el equipo y dónde tenía poco fondo.`,
      `La valoración media habla de la profundidad de la plantilla, no de cómo saldrá un torneo. La forma, el sorteo y un solo error pueden decidir una eliminatoria. Por eso el mismo equipo puede parecer imparable en una partida y caer pronto en la siguiente.`,
      `Puedes comparar ${nation} ${year} con cada plantilla del índice, del Brasil 1970 a la Argentina 2022. Usa la navegación por año de arriba para ver los otros equipos de ${nation} y cómo cambió la plantilla.`,
      `Cuando estés listo, draftéa esta plantilla o arma tu propio XI con toda la historia del Mundial y llévalo por un torneo completo.`,
    ],
    readMoreBtn: "Leer más",
    showLessBtn: "Ver menos",
  },
};

export type TeamDetailContent = (typeof teamDetail)["en"];
