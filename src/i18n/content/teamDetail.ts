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
      `The ${nation} World Cup ${year} squad — formation ${formation}, with a rating for every listed player. Led by ${top} at ${rating} overall, this is the roster as it stood at the tournament, rated player by player on a single scale so you can compare it against every team in World Cup history. Take them into the draft and see how they fare against the all-time greats.`,
    ctaPlay: "Play",
    ctaAll: "All teams",
    other: (nation: string) => `Other ${nation} squads:`,
    rosterTitle: "Roster & ratings",
    wcHeading: (nation: string, year: string) =>
      `${nation} at the ${year} World Cup`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation} arrived at the ${year} World Cup with a squad built around ${top}, the side's highest-rated player at ${rating} overall. In a ${formation} shape, the group mixed proven leaders with emerging talent, and the ratings above show exactly where the team's strength sat — and where it thinned out.`,
      `Average rating only tells part of the story. Tournaments are won on form, fixture luck and fine margins, which is why the same roster can be devastating in one simulation and knocked out early in the next. That unpredictability is the heart of a fantasy World Cup: picking a star-studded side is no guarantee, and backing a gritty underdog can pay off.`,
      `You can compare ${nation} ${year} against every other squad in the index, from Brazil 1970 to Argentina 2022. Use the year navigation above to jump between ${nation}'s other World Cup appearances and see how the squad evolved from tournament to tournament.`,
      `When you're ready, draft this squad — or build your own XI from the whole of World Cup history — and take it through a full tournament in the simulator.`,
    ],
    readMoreBtn: "Read more",
    showLessBtn: "Show less",
  },
  de: {
    eyebrow: "Historische Mannschaft",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `Der Kader von ${nation} für die WM ${year} — Formation ${formation}, mit einer Bewertung für jeden gelisteten Spieler. Angeführt von ${top} mit ${rating} insgesamt, ist das der Kader, wie er beim Turnier stand, Spieler für Spieler auf einer Skala bewertet, damit du ihn mit jedem Team der WM-Geschichte vergleichen kannst. Nimm ihn in den Draft und sieh, wie er gegen die Allzeit-Größten besteht.`,
    ctaPlay: "Spielen",
    ctaAll: "Alle Teams",
    other: (nation: string) => `Weitere ${nation}-Kadern:`,
    rosterTitle: "Kader & Bewertungen",
    wcHeading: (nation: string, year: string) => `${nation} bei der WM ${year}`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation} kam zur WM ${year} mit einem Kader rund um ${top}, den höchstbewerteten Spieler der Mannschaft mit ${rating} insgesamt. In einer ${formation}-Form mischte die Gruppe bewährte Führer mit Nachwuchstalent, und die Bewertungen oben zeigen genau, wo die Stärke der Mannschaft lag — und wo sie dünn wurde.`,
      `Die Durchschnittsbewertung erzählt nur einen Teil. Turniere werden durch Form, Losglück und knappe Ränder gewonnen, weshalb derselbe Kader in einer Simulation vernichtend und in der nächsten früh raus sein kann. Diese Unvorhersehbarkeit ist das Herz eines Fantasy-WM: Einen starrengetrübten Kader zu wählen ist keine Garantie, und ein zäher Außenseiter kann sich lohnen.`,
      `Du kannst ${nation} ${year} mit jedem anderen Kader im Index vergleichen, vom Brasilien 1970 bis Argentinien 2022. Nutze die Jahresnavigation oben, um zwischen ${nation}s anderen WM-Auftritten zu springen und zu sehen, wie sich der Kader von Turnier zu Turnier entwickelte.`,
      `Wenn du bereit bist, draft diesen Kader — oder baue dein eigenes XI aus der gesamten WM-Geschichte — und nimm ihn durch ein volles Turnier im Simulator.`,
    ],
    readMoreBtn: "Mehr lesen",
    showLessBtn: "Weniger",
  },
  fr: {
    eyebrow: "Équipe historique",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `L'effectif ${nation} de la Coupe du Monde ${year} — formation ${formation}, avec la note de chaque joueur listé. Mené par ${top} à ${rating} global, c'est l'effectif tel qu'il était au tournoi, noté joueur par joueur sur une seule échelle pour que vous puissiez le comparer à chaque équipe de l'histoire de la Coupe. Emportez-le dans le draft et voyez comment il se comporte face aux plus grands de tous les temps.`,
    ctaPlay: "Jouer",
    ctaAll: "Toutes les équipes",
    other: (nation: string) => `Autres effectifs ${nation} :`,
    rosterTitle: "Effectif & notes",
    wcHeading: (nation: string, year: string) =>
      `${nation} à la Coupe du Monde ${year}`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation} est arrivé à la Coupe du Monde ${year} avec un effectif construit autour de ${top}, le joueur le mieux noté de l'équipe à ${rating} global. Dans une forme ${formation}, le groupe a mêlé des leaders éprouvés et des talents émergents, et les notes ci-dessus montrent exactement où était la force de l'équipe — et où elle s'est amincie.`,
      `La note moyenne ne dit qu'une partie de l'histoire. Les tournois se gagnent sur la forme, la chance du tirage et les petites marges, c'est pourquoi le même effectif peut être dévastateur dans une simulation et éliminé tôt dans la suivante. Cette imprévisibilité est le cœur d'une Coupe du Monde fantasy : choisir une équipe pleine d'étoiles n'est pas une garantie, et parier sur un petit outsider peut payer.`,
      `Vous pouvez comparer ${nation} ${year} à chaque autre effectif de l'index, du Brésil 1970 à l'Argentine 2022. Utilisez la navigation par année ci-dessus pour sauter entre les autres apparitions de ${nation} en Coupe du Monde et voir comment l'effectif a évolué.`,
      `Quand vous êtes prêt, draftz cet effectif — ou construisez votre propre XI à partir de toute l'histoire de la Coupe — et menez-le dans un tournoi complet dans le simulateur.`,
    ],
    readMoreBtn: "Lire plus",
    showLessBtn: "Voir moins",
  },
  ja: {
    eyebrow: "歴代チーム",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `${nation}のワールドカップ${year}代表 — フォーメーション${formation}、掲載選手それぞれにレーティング。総合${rating}で最高評価の${top}を中心に据えた、大会時点のロースターを選手ごとに1つの尺度で評価。ワールドカップ史上のあらゆるチームと比べられる。ドラフトに連れて行き、史上最強とどう渡り合うか見よう。`,
    ctaPlay: "プレイ",
    ctaAll: "全チーム",
    other: (nation: string) => `他の${nation}チーム：`,
    rosterTitle: "ロースター＆レーティング",
    wcHeading: (nation: string, year: string) =>
      `${nation}のワールドカップ${year}`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation}は総合${rating}で最高の${top}を中心に組まれたチームでワールドカップ${year}にやって来た。${formation}の形で、実績あるリーダーと若手を混ぜ、上のレーティングはチームの強みがどこにあり、どこが薄かったかを正確に示す。`,
      `平均レーティングは話の一部に過ぎない。大会は調子、抽選の運、僅差で勝つ。だから同じロースターが1つのシミュレーションでは破壊的でも、次では早く敗退する。この予測不能さがFantasy Football ワールドカップの心だ。スター揃いのチームでも保証はなく、粘り強いアンダードッグを推すと報われることもある。`,
      `${nation} ${year}をブラジル1970からアルゼンチン2022まで、索引の他の全チームと比べられる。上の年ナビで${nation}の他のワールドカップ出場へ飛び、大会ごとにロースターがどう進化したか見てみよう。`,
      `準備ができたら、このチームをドラフトするか、ワールドカップ全体の歴史から自分のXIを作り、シミュレーターで大会全体を戦わせよう。`,
    ],
    readMoreBtn: "もっと読む",
    showLessBtn: "閉じる",
  },
  es: {
    eyebrow: "Equipo histórico",
    intro: ({ nation, year, formation, top, rating }: TeamArgs) =>
      `La plantilla ${nation} del Mundial ${year} — formación ${formation}, con una valoración para cada jugador listado. Liderada por ${top} con ${rating} global, este es el plantel tal como estaba en el torneo, valorado jugador por jugador en una sola escala para que puedas compararlo con cada equipo de la historia del Mundial. Llévalo al draft y ve cómo le va contra los grandes de todos los tiempos.`,
    ctaPlay: "Jugar",
    ctaAll: "Todos los equipos",
    other: (nation: string) => `Otros plantillas de ${nation}:`,
    rosterTitle: "Plantilla y valoraciones",
    wcHeading: (nation: string, year: string) =>
      `${nation} en el Mundial ${year}`,
    readMore: ({ nation, year, formation, top, rating }: TeamArgs) => [
      `${nation} llegó al Mundial ${year} con una plantilla construida en torno a ${top}, el jugador mejor valorado del lado con ${rating} global. En una forma ${formation}, el grupo mezcló líderes probados con talento emergente, y las valoraciones de arriba muestran exactamente dónde estaba la fuerza del equipo — y dónde se adelgazó.`,
      `La valoración media solo cuenta parte de la historia. Los torneos se ganan por forma, suerte en el sorteo y márgenes finos, por eso el mismo plantel puede ser devastador en una simulación y eliminado temprano en la siguiente. Esa imprevisibilidad es el corazón de un Mundial fantasy: elegir un equipo lleno de estrellas no garantiza nada, y apoyar a un cabeza dura puede pagar.`,
      `Puedes comparar ${nation} ${year} contra cada otro plantel del índice, del Brasil 1970 a la Argentina 2022. Usa la navegación por año de arriba para saltar entre otras presencias de ${nation} en el Mundial y ver cómo evolucionó la plantilla.`,
      `Cuando estés listo, drafta esta plantilla — o arma tu propio XI con toda la historia del Mundial — y llévalo por un torneo completo en el simulador.`,
    ],
    readMoreBtn: "Leer más",
    showLessBtn: "Ver menos",
  },
};

export type TeamDetailContent = (typeof teamDetail)["en"];
