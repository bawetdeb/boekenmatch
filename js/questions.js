(function () {
  const groups = {
    Sport: [
      "voetbal",
      "Formule 1",
      "fitness",
      "vechtsport",
      "basketbal",
      "skateboarden",
      "wintersport",
    ],
    Entertainment: [
      "games",
      "social media",
      "YouTube",
      "films",
      "series",
      "muziek",
      "influencers",
      "reality-tv",
    ],
    Techniek: [
      "computers",
      "AI",
      "auto's",
      "motoren",
      "machines",
      "bouwen",
      "wetenschap",
    ],
    Mensen: [
      "vriendschap",
      "verliefdheid",
      "relaties",
      "familie",
      "school",
      "pesten",
      "identiteit",
      "volwassen worden",
    ],
    Wereld: [
      "oorlog",
      "geschiedenis",
      "criminaliteit",
      "waargebeurde verhalen",
      "rampen",
      "reizen",
    ],
    Fantasie: [
      "magie",
      "fantasy",
      "monsters",
      "superkrachten",
      "sciencefiction",
      "dystopie",
      "zombies",
      "mythologie",
    ],
    "Dieren & natuur": ["dieren", "natuur", "paarden", "honden", "survival"],
  };
  const questions = [
    {
      key: "level",
      title: "Welk niveau doe je?",
      hint: "We zoeken boeken die bij je passen. Je hoeft geen leesexpert te zijn.",
      options: [
        ["basis", "Basis"],
        ["kader", "Kader"],
        ["gt", "GT"],
      ],
    },
    {
      key: "schoolYear",
      title: "In welk leerjaar zit je?",
      options: [
        [3, "Leerjaar 3"],
        [4, "Leerjaar 4"],
      ],
    },
    {
      key: "readingMotivation",
      title: "Hoe voel jij je over lezen?",
      options: [
        [1, "😅 Liever iets anders"],
        [2, "🙂 Soms best leuk"],
        [3, "📚 Ik lees graag"],
        [4, "🔥 Geef mij maar boeken"],
      ],
    },
    {
      key: "readingDifficulty",
      title: "Hoe uitdagend mag het zijn?",
      options: [
        [1, "Lekker makkelijk"],
        [2, "Goed te volgen"],
        [3, "Een beetje uitdaging"],
        [4, "Laat me nadenken"],
      ],
    },
    {
      key: "interests",
      title: "Waar word jij enthousiast van?",
      hint: "Kies meerdere interesses en daarna één favoriet. Je favoriet telt dubbel.",
      type: "interests",
    },
    {
      key: "storyPreferences",
      title: "Wat zoek je in een verhaal?",
      hint: "Je kunt meerdere kiezen, of deze stap overslaan.",
      type: "multi",
      options: [
        "spanning",
        "humor",
        "romantiek",
        "mysterie",
        "fantasy",
        "oorlog",
        "school",
        "vriendschap",
      ].map((x) => [x, x]),
    },
    {
      key: "themes",
      title: "Stel jouw verhaal samen",
      hint: "0 = liever niet · 5 = heel veel. Lage scores tellen ook mee.",
      type: "sliders",
    },
    {
      key: "realismFantasy",
      title: "Echt gebeurd of een andere wereld?",
      options: [
        [1, "Helemaal realistisch"],
        [2, "Meestal realistisch"],
        [3, "Een beetje van allebei"],
        [4, "Veel fantasie"],
        [5, "Een compleet andere wereld"],
      ],
    },
    {
      key: "readingSpeed",
      title: "Welk tempo vind je fijn?",
      options: [
        [5, "Snel: er moet veel gebeuren"],
        [3, "Een fijne afwisseling"],
        [1, "Rustig: tijd voor details"],
      ],
    },
    {
      key: "maxPages",
      title: "Hoe dik mag jouw boek zijn?",
      hint: "Een zachte voorkeur: een iets langer boek kan toch goed bij je passen.",
      options: [
        [160, "Dun · tot ongeveer 160 pagina’s"],
        [250, "Gemiddeld · ongeveer 250 pagina’s"],
        [400, "Dik · ongeveer 400 pagina’s"],
        [1000, "Maakt mij niet uit"],
      ],
    },
    {
      key: "avoidTopics",
      title: "Wat wil je liever niet lezen?",
      hint: "Boeken met deze onderwerpen sluiten we uit. Kies niets als alles mag.",
      type: "multi",
      options: [
        "geweld",
        "oorlog",
        "dood",
        "pesten",
        "zelfdoding",
        "drugs",
        "huiselijk geweld",
        "ziekte",
      ].map((x) => [x, x]),
    },
  ];

  groups.Sport.push("andere sport");
  groups.Wereld.push("politiek", "andere landen");
  questions.splice(3, 0, {
    key: "readingAbility",
    title: "Hoe gaat lezen bij jou?",
    hint: "Dit is geen toets. Kies wat jij prettig vindt.",
    options: [
      [1, "📖 Korte, duidelijke zinnen helpen mij"],
      [2, "🙂 Gewone verhalen gaan prima"],
      [3, "🧠 Ook ingewikkelde verhalen gaan goed"],
    ],
  });
  const byKey = (key) => questions.find((q) => q.key === key);
  byKey("readingDifficulty").options.push(["any", "Maakt mij niet uit"]);
  byKey("interests").maxSelections = 6;
  byKey("interests").hint =
    "Kies maximaal 6 interesses en daarna één favoriet. Je favoriet telt dubbel.";
  byKey("storyPreferences").maxSelections = 5;
  byKey("storyPreferences").hint =
    "Kies maximaal 5 ingrediënten, of sla deze stap over.";
  byKey("storyPreferences").options = [
    ["spanning", "🔥 Spanning"],
    ["humor", "😂 Humor"],
    ["romantiek", "❤️ Liefde"],
    ["oorlog", "⚔️ Oorlog"],
    ["mysterie", "🕵️ Mysterie"],
    ["horror", "👻 Horror"],
    ["fantasy", "🐉 Fantasy"],
    ["sport", "⚽ Sport"],
    ["technologie", "🎮 Games / technologie"],
    ["vriendschap", "🤝 Vriendschap"],
    ["school", "🏫 School"],
    ["waargebeurd", "🌍 Waargebeurd"],
    ["misdaad", "🔎 Misdaad"],
    ["psychologie", "🧠 Psychologie / diepgang"],
    ["sciencefiction", "🚀 Sciencefiction"],
    ["actie", "💥 Actie"],
    ["emotioneel", "😢 Emotioneel"],
    ["donker", "🌑 Donker"],
    ["feelgood", "🌈 Feelgood"],
  ];
  byKey("realismFantasy").title = "De echte wereld of een andere wereld?";
  byKey("realismFantasy").options = [
    [1, "🌍 Helemaal de echte wereld"],
    [2, "🏙️ Vooral realistisch"],
    ["any", "Maakt mij niet uit"],
    [4, "✨ Een beetje fantasie mag"],
    [5, "🐉 Een totaal andere wereld"],
  ];
  byKey("readingSpeed").options = [
    [5, "⚡ Meteen actie"],
    [2, "🌿 Het mag rustig beginnen"],
    ["any", "Maakt mij niet uit"],
  ];
  byKey("maxPages").options = [
    [150, "Liefst dun · ongeveer 150 pagina’s"],
    [200, "Niet te dik · ongeveer 200 pagina’s"],
    [300, "Gemiddeld · ongeveer 300 pagina’s"],
    [450, "Dik is prima"],
    ["any", "Maakt mij niet uit"],
  ];
  byKey("avoidTopics").options.push(
    ...["seks", "racisme", "dierenleed"].map((x) => [x, x]),
  );
  window.quizConfig = { groups, questions };
})();
