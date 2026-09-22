/* Our Home: a living vision. No build step, no framework. */
(function () {
  "use strict";

  const STORAGE = {
    theme: "home.theme",
    priorities: "home.priorities",
    decisions: "home.decisions",
    ideas: "home.ideas",
  };

  const PRIORITY_LABEL = { must: "Must have", love: "Would love", maybe: "Maybe" };
  const PRIORITY_ORDER = { must: 0, love: 1, maybe: 2 };

  /* ---------- Room illustrations (inline SVG, inherit theme colours) ---------- */
  const ART = {
    prayer: `
      <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="pad" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect x="4" y="4" width="42" height="42" rx="10" fill="none" stroke="var(--line)" stroke-width="1.5"/>
          </pattern>
          <radialGradient id="glow" cx="50%" cy="45%" r="55%">
            <stop offset="0" stop-color="var(--gold)" stop-opacity="0.35"/>
            <stop offset="1" stop-color="var(--gold)" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="150" fill="url(#pad)"/>
        <rect width="400" height="150" fill="url(#glow)"/>
        <g fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round">
          <path d="M200 40v50"/>
          <path d="M182 58h36"/>
        </g>
        <path d="M150 128c20-18 80-18 100 0" fill="none" stroke="var(--ink-mute)" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    study: `
      <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="var(--line)" stroke-width="2">
          <path d="M40 30h320M40 70h320M40 110h320"/>
        </g>
        <g fill="var(--gold-soft)" stroke="var(--ink-mute)" stroke-width="1.5">
          <rect x="60" y="40" width="14" height="30"/><rect x="78" y="44" width="10" height="26"/><rect x="92" y="38" width="16" height="32"/>
          <rect x="130" y="42" width="12" height="28"/><rect x="146" y="46" width="18" height="24"/><rect x="168" y="40" width="10" height="30"/>
          <rect x="220" y="80" width="14" height="30"/><rect x="238" y="84" width="16" height="26"/><rect x="258" y="78" width="10" height="32"/>
          <rect x="300" y="82" width="18" height="28"/><rect x="322" y="86" width="12" height="24"/><rect x="338" y="80" width="14" height="30"/>
          <rect x="60" y="86" width="60" height="24"/>
          <rect x="230" y="46" width="52" height="24"/>
        </g>
        <path d="M0 130h400" stroke="var(--ink-mute)" stroke-width="2"/>
      </svg>`,
    bedroom: `
      <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="var(--ink-mute)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M110 40h180a10 10 0 0 1 10 10v70H100V50a10 10 0 0 1 10-10z"/>
          <path d="M100 120v14M300 120v14"/>
          <rect x="120" y="70" width="70" height="18" rx="6" fill="var(--bg-elev)"/>
          <rect x="210" y="70" width="70" height="18" rx="6" fill="var(--bg-elev)"/>
          <rect x="40" y="90" width="44" height="30" rx="4" fill="var(--gold-soft)"/>
          <rect x="316" y="90" width="44" height="30" rx="4" fill="var(--gold-soft)"/>
        </g>
        <g fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round">
          <path d="M48 100h28M48 106h20M48 112h26"/>
          <path d="M324 100h28M324 106h20M324 112h26"/>
        </g>
        <path d="M100 134h200" stroke="var(--ink-mute)" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    sauna: `
      <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g stroke="var(--line)" stroke-width="2">
          <path d="M0 22h400M0 46h400M0 70h400M0 94h400M0 118h400"/>
        </g>
        <g fill="none" stroke="var(--ink-mute)" stroke-width="2" stroke-linecap="round">
          <path d="M60 100h180M60 100v30M240 100v30M80 100v-20h140v20"/>
        </g>
        <g fill="var(--gold-soft)" stroke="var(--ink-mute)" stroke-width="1.5">
          <ellipse cx="310" cy="114" rx="26" ry="9"/>
          <ellipse cx="300" cy="104" rx="12" ry="6"/>
          <ellipse cx="322" cy="102" rx="10" ry="5"/>
        </g>
        <g fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round">
          <path d="M300 88c4-6-4-10 0-16M312 84c4-6-4-10 0-16M324 88c4-6-4-10 0-16"/>
        </g>
      </svg>`,
  };

  /* ---------- Rooms ---------- */
  const ROOMS = [
    {
      id: "prayer",
      name: "The Prayer Room",
      tagline: "A place to pour everything out.",
      priority: "must",
      photo: {
        src: "images/prayer-room.jpg",
        spec: "images/prayer-room-spec.jpg",
        // Favour the upper band of the render, where the cross and the shelf sit.
        position: "center 45%",
        alt:
          "Concept render of the prayer room: padded dark acoustic panels on every wall, a wooden cross lit from above, a low shelf holding an open Bible and a candle, a kneeler and floor cushions on carpet, a mini-split air conditioner high on the right wall, a speaker in the corner, and a solid-core door at the left.",
      },
      summary:
        "Padded, soundproof, and finished to a high standard inside. A room you can go into and scream as loud as you want, and it hinders no one.",
      features: [
        ["Real sound isolation", "Room-within-a-room framing, decoupled walls, a solid-core door with perimeter seals. Not just foam."],
        ["Padded walls and floor", "Thick upholstered panels you can kneel against, lean on, or fall against. Soft, but built to last."],
        ["Its own air conditioning", "A sealed room heats up fast. A dedicated mini-split with fresh-air ventilation keeps it comfortable for as long as you need."],
        ["Good speakers", "A proper system for worship, Scripture audio, or silence with no hum. Cabling hidden behind the panels."],
        ["Warm, dimmable light", "Low, indirect light. Bright enough to read, dim enough to weep."],
        ["Small and sacred", "A Bible, a journal, a kneeler, floor cushions. Nothing that doesn't belong."],
        ["A modest prayer board", "A small board for verses, names you're carrying, and answered prayers. Encouragement, not clutter."],
      ],
      notes: [
        "Best spot is an interior room with no shared wall to a bedroom, or a corner of the basement. Fewer exterior walls means less sound to fight.",
        "Soundproofing lives or dies on the door and the HVAC penetrations. Budget for those first.",
        "Consider a small vestibule (two doors) if we want it truly silent from the outside.",
      ],
    },
    {
      id: "study",
      name: "The Study",
      tagline: "Where we get into the Word together.",
      priority: "must",
      summary:
        "A study that is mine, with a place for her off to the side, in the same room. Two desks, one door, so we can be in it together without being on top of each other.",
      features: [
        ["My desk", "Deep enough for an open Bible, a commentary, a notebook, and a laptop at once."],
        ["Her nook", "A second desk or a reading chair and side table, set off to the side with its own lamp and shelves."],
        ["Floor-to-ceiling shelves", "Built-ins on at least one wall. Bibles, commentaries, journals, and room to grow."],
        ["A shared table", "One big surface for spreading things out when we study side by side."],
        ["A wall for memorizing", "Corkboard or a framed chalkboard for verses we're working on together."],
        ["Natural light and a door that closes", "Morning light if we can get it. Quiet when we need it."],
      ],
      notes: [
        "If the study and prayer room can sit next to each other, the prayer room becomes the natural place to go after reading.",
        "Her space should be hers: her own drawers, her own lamp, her own shelf. Not just a chair in my study.",
      ],
    },
    {
      id: "bedroom",
      name: "Our Bedroom",
      tagline: "The Song of Solomon, under glass.",
      priority: "love",
      summary:
        "A bed with two nightstands. Under the glass top of each one, the Song of Solomon's words about the person on the other side. His side holds the verses about her. Her side holds the verses about him.",
      features: [
        ["Two glass-topped nightstands", "Solid wood with an inset glass top, so the words sit protected just beneath the surface."],
        ["His side: about her", "Song of Solomon 4 and the verses that describe the bride."],
        ["Her side: about him", "Song of Solomon 5:10-16, the verses that describe the bridegroom."],
        ["The words themselves", "A real page, a hand-lettered sheet, a letterpress print, or text etched into the glass. Still deciding."],
        ["Over the bed", "Song of Solomon 8:6-7, set as a seal."],
      ],
      notes: [
        "See the full text of both sides in the Nightstands section below.",
        "If we take a page from a real Bible, it should be one we bought for this purpose, not the one we read from.",
        "Low-iron glass keeps the page from looking green. Worth the upgrade.",
      ],
    },
    {
      id: "sauna",
      name: "The Sauna",
      tagline: "A random thought, but a good one.",
      priority: "maybe",
      summary:
        "Not necessary. Not forgotten either. A small cedar sauna off the master bath or out in the yard.",
      features: [
        ["Cedar interior", "Smells right, holds up to heat, and looks better with age."],
        ["Traditional or infrared", "Traditional for the real thing; infrared for lower cost and easier wiring."],
        ["Two-person bench", "Small on purpose."],
      ],
      notes: ["Could live in a garden shed later on. Doesn't need to be in the first build."],
    },
  ];

  /* ---------- Decisions ---------- */
  const DECISIONS = [
    { id: "page", room: "bedroom", q: "How do the words go under the glass?", options: ["A real Bible page", "Hand-lettered", "Letterpress print", "Etched glass"] },
    { id: "translation", room: "bedroom", q: "Which translation for the nightstands?", options: ["ESV", "NIV", "KJV", "NASB", "Other"] },
    { id: "location", room: "prayer", q: "Where does the prayer room go?", options: ["Interior room, main floor", "Basement", "Off the study", "Detached"] },
    { id: "vestibule", room: "prayer", q: "Add a vestibule (two doors) for true silence?", options: ["Yes", "No", "If budget allows"] },
    { id: "study-layout", room: "study", q: "How is her space arranged?", options: ["Second desk, same wall", "Reading nook, off to the side", "Facing desks", "L-shaped shared desk"] },
    { id: "sauna", room: "sauna", q: "Sauna: in the first build?", options: ["Yes", "Later", "Skip it"] },
  ];

  /* ---------- Storage helpers ---------- */
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage may be unavailable in private mode; the app still works */
    }
  }

  const state = {
    priorities: load(STORAGE.priorities, {}),
    decisions: load(STORAGE.decisions, {}),
    ideas: load(STORAGE.ideas, []),
    filter: "all",
  };

  /* ---------- Utilities ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, "");
      else if (v !== false && v != null) node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) {
      if (c == null) continue;
      node.append(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  let toastTimer;
  function toast(message) {
    const t = $("#toast");
    t.textContent = message;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2400);
  }

  function roomPriority(room) {
    return state.priorities[room.id] || room.priority;
  }
  function roomName(id) {
    const r = ROOMS.find((x) => x.id === id);
    return r ? r.name : "General";
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    const saved = load(STORAGE.theme, null);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    $("#theme-btn").addEventListener("click", () => {
      const root = document.documentElement;
      const current =
        root.getAttribute("data-theme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      save(STORAGE.theme, next);
    });
  }

  /* ---------- Rooms ---------- */
  // A room shows its render when it has one, and falls back to the line drawing.
  function roomArt(room) {
    if (!room.photo) return el("div", { class: "room-art", html: ART[room.id] || "" });
    const img = el("img", {
      src: room.photo.src,
      alt: room.photo.alt,
      loading: "lazy",
      decoding: "async",
      style: room.photo.position ? `object-position: ${room.photo.position}` : null,
    });
    return el(
      "button",
      {
        type: "button",
        class: "room-art room-art-photo",
        "aria-label": `View the full ${room.name} render`,
        onclick: () => openLightbox(room),
      },
      [img, el("span", { class: "art-badge", text: "Concept render" })]
    );
  }

  function openLightbox(room) {
    const dlg = $("#lightbox");
    const img = $("#lightbox-img");
    img.src = (room.photo && room.photo.spec) || room.photo.src;
    img.alt = room.photo.alt;
    $("#lightbox-cap").textContent = `${room.name} — concept render, not a photograph`;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  }

  function initLightbox() {
    const dlg = $("#lightbox");
    const close = () => (typeof dlg.close === "function" ? dlg.close() : dlg.removeAttribute("open"));
    $("#lightbox-close").addEventListener("click", close);
    // Clicking the backdrop (the dialog element itself, outside the figure) closes it.
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) close();
    });
  }

  function renderRooms() {
    const list = $("#room-list");
    list.innerHTML = "";
    const sorted = [...ROOMS].sort(
      (a, b) => PRIORITY_ORDER[roomPriority(a)] - PRIORITY_ORDER[roomPriority(b)]
    );
    for (const room of sorted) {
      const priority = roomPriority(room);
      const select = el("select", { "aria-label": `Priority for ${room.name}` });
      for (const [value, label] of Object.entries(PRIORITY_LABEL)) {
        select.append(el("option", { value, selected: value === priority, text: label }));
      }
      select.addEventListener("change", () => {
        state.priorities[room.id] = select.value;
        save(STORAGE.priorities, state.priorities);
        renderRooms();
        toast(`${room.name}: ${PRIORITY_LABEL[select.value]}`);
      });

      const card = el(
        "article",
        { class: "room", "data-priority": priority, hidden: state.filter !== "all" && state.filter !== priority },
        [
          roomArt(room),
          el("div", { class: "room-body" }, [
            el("div", { class: "room-top" }, [
              el("h3", { text: room.name }),
              el("label", { class: "priority", "data-priority": priority }, [PRIORITY_LABEL[priority], select]),
            ]),
            el("p", { class: "tagline", text: room.tagline }),
            el("p", { class: "summary", text: room.summary }),
            el(
              "ul",
              { class: "features" },
              room.features.map(([title, detail]) =>
                el("li", {}, [el("div", {}, [el("strong", { text: title }), " ", el("span", { text: detail })])])
              )
            ),
            room.notes && room.notes.length
              ? el("details", { class: "room-more" }, [
                  el("summary", { text: "Build notes" }),
                  el("div", { class: "notes" }, room.notes.map((n) => el("p", { text: n }))),
                ])
              : null,
          ]),
        ]
      );
      list.append(card);
    }
  }

  function initFilters() {
    $$(".filters .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.filter = chip.dataset.filter;
        $$(".filters .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
        $$("#room-list .room").forEach((card) => {
          card.hidden = state.filter !== "all" && card.dataset.priority !== state.filter;
        });
      });
    });
  }

  /* ---------- Nightstand tabs (mobile only) ---------- */
  function initNightstands() {
    const tabs = $$('.nightstand-toggle [role="tab"]');
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
          $("#" + t.getAttribute("aria-controls")).hidden = !active;
        });
      });
    });
  }

  /* ---------- Decisions ---------- */
  function renderDecisions() {
    const list = $("#decision-list");
    list.innerHTML = "";
    for (const d of DECISIONS) {
      const chosen = state.decisions[d.id];
      const options = el(
        "div",
        { class: "options", role: "group", "aria-label": d.q },
        d.options.map((opt) =>
          el("button", {
            type: "button",
            class: "chip" + (opt === chosen ? " is-active" : ""),
            "aria-pressed": String(opt === chosen),
            text: opt,
            onclick: () => {
              if (state.decisions[d.id] === opt) delete state.decisions[d.id];
              else state.decisions[d.id] = opt;
              save(STORAGE.decisions, state.decisions);
              renderDecisions();
            },
          })
        )
      );
      list.append(
        el("li", { class: "decision" + (chosen ? " is-decided" : "") }, [
          el("p", { class: "room-tag", text: roomName(d.room) }),
          el("p", { class: "q", text: d.q }),
          options,
        ])
      );
    }
  }

  /* ---------- Ideas ---------- */
  function renderIdeas() {
    const list = $("#idea-list");
    list.innerHTML = "";
    $("#idea-empty").hidden = state.ideas.length > 0;
    const sorted = [...state.ideas].sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || b.created - a.created
    );
    for (const idea of sorted) {
      list.append(
        el("li", { class: "idea" }, [
          el("span", { class: "dot", "data-priority": idea.priority, "aria-hidden": "true" }),
          el("div", {}, [
            el("p", { class: "text", text: idea.text }),
            el("p", {
              class: "meta",
              text: `${roomName(idea.room)} · ${PRIORITY_LABEL[idea.priority]} · ${new Date(idea.created).toLocaleDateString()}`,
            }),
          ]),
          el("button", {
            class: "del",
            type: "button",
            "aria-label": `Remove idea: ${idea.text}`,
            html: "&times;",
            onclick: () => {
              state.ideas = state.ideas.filter((i) => i.id !== idea.id);
              save(STORAGE.ideas, state.ideas);
              renderIdeas();
              toast("Idea removed");
            },
          }),
        ])
      );
    }
  }

  function initIdeas() {
    const roomSelect = $("#idea-room");
    roomSelect.append(el("option", { value: "general", text: "General" }));
    for (const r of ROOMS) roomSelect.append(el("option", { value: r.id, text: r.name }));

    $("#idea-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#idea-text");
      const text = input.value.trim();
      if (!text) return;
      state.ideas.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        text,
        room: roomSelect.value,
        priority: $("#idea-priority").value,
        created: Date.now(),
      });
      save(STORAGE.ideas, state.ideas);
      input.value = "";
      input.focus();
      renderIdeas();
      toast("Idea saved");
    });

    $("#export-btn").addEventListener("click", () => {
      const payload = {
        app: "our-home",
        exported: new Date().toISOString(),
        priorities: state.priorities,
        decisions: state.decisions,
        ideas: state.ideas,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = el("a", { href: url, download: `our-home-${new Date().toISOString().slice(0, 10)}.json` });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("Exported");
    });

    $("#import-input").addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (data.app !== "our-home") throw new Error("Not an Our Home export");
        const incoming = Array.isArray(data.ideas) ? data.ideas : [];
        const known = new Set(state.ideas.map((i) => i.id));
        let added = 0;
        for (const idea of incoming) {
          if (idea && idea.id && idea.text && !known.has(idea.id)) {
            state.ideas.push({
              id: String(idea.id),
              text: String(idea.text).slice(0, 200),
              room: ROOMS.some((r) => r.id === idea.room) ? idea.room : "general",
              priority: PRIORITY_LABEL[idea.priority] ? idea.priority : "love",
              created: Number(idea.created) || Date.now(),
            });
            added++;
          }
        }
        if (data.priorities && typeof data.priorities === "object") {
          for (const [id, p] of Object.entries(data.priorities)) {
            if (ROOMS.some((r) => r.id === id) && PRIORITY_LABEL[p]) state.priorities[id] = p;
          }
        }
        if (data.decisions && typeof data.decisions === "object") {
          for (const [id, v] of Object.entries(data.decisions)) {
            const d = DECISIONS.find((x) => x.id === id);
            if (d && d.options.includes(v)) state.decisions[id] = v;
          }
        }
        save(STORAGE.ideas, state.ideas);
        save(STORAGE.priorities, state.priorities);
        save(STORAGE.decisions, state.decisions);
        renderRooms();
        renderDecisions();
        renderIdeas();
        toast(added ? `Imported ${added} idea${added === 1 ? "" : "s"}` : "Nothing new to import");
      } catch (err) {
        toast("Couldn't read that file");
      } finally {
        e.target.value = "";
      }
    });
  }

  /* ---------- Install prompt ---------- */
  function initInstall() {
    let deferred = null;
    const btn = $("#install-btn");
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferred = e;
      btn.hidden = false;
    });
    btn.addEventListener("click", async () => {
      if (!deferred) return;
      deferred.prompt();
      await deferred.userChoice;
      deferred = null;
      btn.hidden = true;
    });
    window.addEventListener("appinstalled", () => {
      btn.hidden = true;
      toast("Installed. Find it on your home screen.");
    });
  }

  /* ---------- Offline status + service worker ---------- */
  function initOffline() {
    const status = $("#offline-status");
    const update = () => {
      status.hidden = navigator.onLine;
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("./sw.js")
          .then((reg) => {
            reg.addEventListener("updatefound", () => {
              const worker = reg.installing;
              if (!worker) return;
              worker.addEventListener("statechange", () => {
                if (worker.state === "installed" && navigator.serviceWorker.controller) {
                  toast("Updated. Reopen to see the latest.");
                }
              });
            });
          })
          .catch(() => {
            /* offline support is a bonus, not a requirement */
          });
      });
    }
  }

  /* ---------- Boot ---------- */
  initTheme();
  initLightbox();
  renderRooms();
  initFilters();
  initNightstands();
  renderDecisions();
  initIdeas();
  renderIdeas();
  initInstall();
  initOffline();
})();
