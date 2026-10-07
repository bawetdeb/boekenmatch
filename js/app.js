(async function () {
  const app = document.getElementById("app"),
    books = await bookRepository.getBooks(),
    state = appState,
    p = state.profile;
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const { groups, questions } = quizConfig;
  let current = [],
    resultVersion = 0;
  function frame(content) {
    app.innerHTML = `<div class="shell"><header><a href="#" id="home" aria-label="BoekenMatch opnieuw beginnen"><span class="logo">B<span>✦</span></span> BoekenMatch</a><span class="school">csg Bogerman <span class="badge">TESTCOLLECTIE</span></span></header>${content}<footer>Jouw smaak. Jouw verhaal. <span>Geen account of persoonsgegevens · antwoorden blijven in deze sessie</span></footer></div>`;
    document.getElementById("home").onclick = (e) => {
      e.preventDefault();
      welcome();
    };
  }
  function welcome() {
    resultVersion++;
    frame(
      `<main class="hero"><div><span class="eyebrow">ONTDEK JOUW VOLGENDE VERHAAL</span><h1>Een boek dat<br>bij <em>jou</em> past.</h1><p>Geen eindeloze boekenlijst. Vertel wat jij leuk vindt en ontdek vijf verhalen die jouw aandacht verdienen.</p><button id="start" class="primary">Vind mijn boeken <span>↗</span></button><p class="small">${questions.length} korte stappen · ongeveer 3 minuten</p></div><div class="hero-art" aria-hidden="true"><div class="paper purple">EEN ANDERE<br>WERELD <span>✦</span></div><div class="paper red">NOG ÉÉN<br>HOOFDSTUK <span>↗</span></div><div class="paper yellow">JOUW<br>VERHAAL <span>☺</span></div></div></main><section class="intro"><span>01 <strong>Vertel wat je raakt</strong></span><span>02 <strong>Ontdek jouw top 5</strong></span><span>03 <strong>Kies je volgende boek</strong></span></section>`,
    );
    document.getElementById("start").onclick = () => {
      state.step = 0;
      state.shown.clear();
      quiz();
    };
  }
  const choices = (q, options) =>
    `<div class="choices">${options
      .map(([value, label]) => {
        const selected = Array.isArray(p[q.key])
          ? p[q.key].includes(value)
          : p[q.key] === (value === "any" ? null : value);
        return `<button class="choice ${selected ? "selected" : ""}" data-value="${esc(value)}" aria-pressed="${selected}">${esc(label)} <span>${selected ? "✓" : "+"}</span></button>`;
      })
      .join("")}</div>`;
  function quiz() {
    const q = questions[state.step];
    frame(
      `<main class="quiz"><div class="progress-meta"><span>JOUW LEESPROFIEL</span><span>Stap ${state.step + 1} van ${questions.length}</span></div><progress max="${questions.length}" value="${state.step + 1}" aria-label="Voortgang vragenlijst"></progress><div class="question" tabindex="-1"><span class="eyebrow">${String(state.step + 1).padStart(2, "0")} / LET’S MATCH</span><h1>${q.title}</h1><p>${q.hint || "Kies wat het beste bij jou past."}</p><div id="answers">${
        q.type === "interests"
          ? Object.entries(groups)
              .map(
                ([g, values]) =>
                  `<fieldset><legend>${g}</legend>${choices(
                    q,
                    values.map((x) => [x, x]),
                  )}</fieldset>`,
              )
              .join("") +
            `<label class="favorite">Mijn belangrijkste interesse<select id="primary"><option value="">Kies je favoriet</option>${p.interests.map((i) => `<option ${p.primaryInterest === i ? "selected" : ""}>${esc(i)}</option>`).join("")}</select></label>`
          : q.type === "sliders"
            ? Object.entries(p.themes)
                .map(
                  ([k, v]) =>
                    `<label class="slider">${k}<output id="out-${k}">${v}</output><input type="range" min="0" max="5" step="1" value="${v}" data-theme="${k}" aria-label="${k}"></label>`,
                )
                .join("")
            : choices(q, q.options)
      }</div><p id="validation" role="status"></p><nav><button id="back" class="secondary">← ${state.step ? "Vorige" : "Startpagina"}</button><button id="next" class="primary">${state.step === questions.length - 1 ? "Ontdek mijn top 5 ✦" : "Volgende →"}</button></nav></div></main>`,
    );
    document.querySelectorAll("[data-value]").forEach(
      (btn) =>
        (btn.onclick = () => {
          let v = btn.dataset.value;
          if (
            [
              "schoolYear",
              "readingMotivation",
              "readingAbility",
              "readingDifficulty",
              "realismFantasy",
              "readingSpeed",
              "maxPages",
            ].includes(q.key)
          )
            v = v === "any" ? null : Number(v);
          if (q.type === "multi" || q.type === "interests") {
            if (
              !p[q.key].includes(v) &&
              q.maxSelections &&
              p[q.key].length >= q.maxSelections
            ) {
              document.getElementById("validation").textContent =
                `Kies maximaal ${q.maxSelections}. Haal eerst een keuze weg.`;
              return;
            }
            p[q.key] = p[q.key].includes(v)
              ? p[q.key].filter((x) => x !== v)
              : [...p[q.key], v];
            if (!p.interests.includes(p.primaryInterest))
              p.primaryInterest = "";
          } else p[q.key] = v;
          quiz();
          document
            .querySelector(`[data-value="${CSS.escape(String(v))}"]`)
            ?.focus();
        }),
    );
    document.querySelectorAll("[data-theme]").forEach(
      (el) =>
        (el.oninput = () => {
          p.themes[el.dataset.theme] = Number(el.value);
          document.getElementById("out-" + el.dataset.theme).value = el.value;
        }),
    );
    const primary = document.getElementById("primary");
    if (primary) primary.onchange = () => (p.primaryInterest = primary.value);
    document.getElementById("back").onclick = () => {
      if (state.step) {
        state.step--;
        quiz();
      } else welcome();
    };
    document.getElementById("next").onclick = () => {
      if (
        q.key === "interests" &&
        (!p.interests.length || !p.primaryInterest)
      ) {
        document.getElementById("validation").textContent =
          "Kies minstens één interesse en je favoriet.";
        return;
      }
      if (state.step < questions.length - 1) {
        state.step++;
        quiz();
        document.querySelector(".question").focus();
        window.scrollTo(0, 0);
      } else {
        state.shown.clear();
        results();
      }
    };
  }
  function feedbackButtons(b) {
    return `<div class="feedback" aria-label="Feedback voor ${esc(b.title)}"><button data-feedback="1" data-id="${b.id}" aria-pressed="${state.feedback[b.id] === 1}">👍 Dit lijkt me leuk</button><button data-feedback="-1" data-id="${b.id}" aria-pressed="${state.feedback[b.id] === -1}">👎 Niks voor mij</button></div>`;
  }
  function results(keep = false) {
    const version = ++resultVersion;
    if (!keep) {
      current = matchingEngine.recommend(books, p, 5, {
        exclude: [...state.shown],
        feedback: state.feedback,
        seed: state.seed + state.round++,
      });
      current.forEach((b) => state.shown.add(b.id));
    }
    frame(
      `<main class="results"><span class="eyebrow">JOUW SMAAK, VERTAALD NAAR VERHALEN</span><h1>Dit is jouw <em>top ${current.length}.</em></h1><p>Een startpunt om iets nieuws te ontdekken. Matchpercentages zijn een schatting op basis van je antwoorden.</p><p class="notice">Fase 1 · ${books.length} testtitels. Niveau, pagina’s en beschikbaarheid zijn illustratief en nog niet gecontroleerd in Aura.</p>${!current.length ? '<p role="status">Geen veilige matches gevonden bij deze uitsluitingen. Pas je antwoorden aan om opnieuw te zoeken.</p>' : ""}<div class="book-grid">${current
        .map(
          (b, i) =>
            `<article class="book-card ${i === 0 ? "featured" : ""}"><button class="book-open" data-book="${b.id}" aria-label="Bekijk ${esc(b.title)}"><div class="cover-wrap"><img data-cover="${b.id}" src="${coverService.fallback(b)}" alt="Omslag ${esc(b.title)}"><span class="rank">${i + 1}</span><div class="hover-summary">${esc(b.teaser || b.summary)}</div></div><div class="book-text"><span class="match">${b.matchScore}% match</span><h2>${esc(b.title)}</h2><p class="author">${esc(b.author)}</p><div class="tags">${b.interests
              .slice(0, 3)
              .map((t) => `<span>${esc(t)}</span>`)
              .join(
                "",
              )}</div><ul>${b.matchReasons.map((r) => `<li>${esc(r)}</li>`).join("")}</ul><span class="detail-link">Ontdek het verhaal ↗</span></div></button>${feedbackButtons(b)}</article>`,
        )
        .join(
          "",
        )}</div><div class="result-actions"><button id="more" class="primary" ${current.length ? "" : "disabled"}>🔄 Geef mij vijf andere</button><button id="edit" class="secondary">Pas mijn antwoorden aan</button></div><p class="small">Nieuwe rondes gebruiken eerst ongeziene boeken. Als die op zijn, kunnen titels terugkomen. Feedback wordt alleen in deze browsersessie bewaard.</p></main><dialog id="details"></dialog>`,
    );
    document.getElementById("more").onclick = () => results();
    document.getElementById("edit").onclick = () => {
      state.step = 0;
      quiz();
    };
    document.querySelectorAll("[data-book]").forEach(
      (btn) =>
        (btn.onclick = () =>
          modal(
            current.find((b) => b.id === btn.dataset.book),
            btn,
          )),
    );
    bindFeedback();
    current.forEach((b) =>
      coverService.findCover(b).then((url) => {
        if (version === resultVersion)
          document
            .querySelectorAll(`[data-cover="${b.id}"]`)
            .forEach((img) => (img.src = url));
      }),
    );
  }
  function bindFeedback() {
    document.querySelectorAll("[data-feedback]").forEach(
      (btn) =>
        (btn.onclick = () => {
          const id = btn.dataset.id,
            value = Number(btn.dataset.feedback);
          if (state.feedback[id] === value) delete state.feedback[id];
          else state.feedback[id] = value;
          saveFeedback();
          current = current
            .map((b) => ({
              ...b,
              matchScore: matchingEngine.scoreBook(b, p, state.feedback),
            }))
            .sort((a, b) => b.matchScore - a.matchScore);
          results(true);
        }),
    );
  }
  function modal(b, trigger) {
    const d = document.getElementById("details");
    const safeAura = (() => {
      try {
        const u = new URL(b.auraUrl);
        return u.protocol === "https:" &&
          u.hostname === "bogerman.auralibrary.nl"
          ? u.href
          : null;
      } catch {
        return null;
      }
    })();
    d.innerHTML = `<button id="close" class="close" aria-label="Sluiten">✕</button><div class="modal-content"><img src="${esc(document.querySelector(`[data-cover="${b.id}"]`).src)}" alt="Omslag ${esc(b.title)}"><div><span class="match">${b.matchScore}% match</span><h2 id="modal-title">${esc(b.title)}</h2><p>${esc(b.author)}</p><p>${esc(b.summary)}</p><ul>${b.matchReasons.map((r) => `<li>${esc(r)}</li>`).join("")}</ul><dl><dt>Niveau</dt><dd>${b.levels.join(" / ")}</dd><dt>Pagina’s (testwaarde)</dt><dd>${b.pages}</dd><dt>Thema’s</dt><dd>${Object.entries(
      b.themes,
    )
      .filter(([, v]) => v >= 3)
      .map(([k]) => k)
      .join(
        ", ",
      )}</dd><dt>Locatie</dt><dd>${esc(b.location)}</dd><dt>Beschikbaarheid</dt><dd>${b.available ? "Beschikbaar in de testcollectie" : "Niet beschikbaar"} · Aura nog niet gekoppeld</dd></dl>${safeAura ? `<a class="primary" href="${esc(safeAura)}" target="_blank" rel="noopener">Bekijk in Aura ↗</a>` : '<button class="secondary" disabled>Bekijk in Aura · nog niet gekoppeld</button>'}</div></div>`;
    d.setAttribute("aria-labelledby", "modal-title");
    d.showModal();
    document.getElementById("close").onclick = () => d.close();
    d.onclick = (e) => {
      if (e.target === d) d.close();
    };
    d.onclose = () => trigger.focus();
  }
  welcome();
})();
