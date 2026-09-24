/* Our Home: a living vision. No build step, no framework. */
(function () {
  "use strict";

  /* Escape hatch: opening the app with ?reset clears the service worker and
   * its caches, then reloads clean. Saved ideas and decisions are untouched.
   * Use it if a bad cached copy ever leaves the app unable to start. */
  if (/[?&]reset(=|&|$)/.test(location.search)) {
    document.documentElement.style.visibility = "hidden";
    (async () => {
      try {
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
        if (window.caches) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        /* nothing more we can do; reload anyway */
      }
      location.replace(location.pathname);
    })();
    return;
  }

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
      name: "The Study & Office",
      tagline: "Two desks, one room, one door.",
      priority: "must",
      photo: {
        src: "images/study.jpg",
        // Hold the middle band: the shared desk, the window, and her desk on the right.
        position: "center 52%",
        alt:
          "Concept render of the study and office: a long shared wood desk in the middle of the room with an open Bible and a laptop on it, floor-to-ceiling built-in bookshelves with a rolling library ladder along the left wall, tall windows looking out over pines and water at sunset, an armchair and side table forming a reading nook, and a second desk with its own lamp and shelves along the right wall.",
      },
      summary:
        "A room we work in together. A long shared desk in the middle, her own desk off to the side with her own lamp and shelves, and a reading chair for when neither of us wants to be at a desk.",
      features: [
        ["The shared desk", "One long surface in the middle of the room. Deep enough for an open Bible, a commentary, a notebook, and a laptop at once, with room to sit across from each other."],
        ["Her desk", "Her own desk along the side wall, with her own lamp, her own drawers, and her own shelves. Hers, not a chair in my study."],
        ["Floor-to-ceiling shelves", "Built-ins on at least one wall, tall enough to need a rolling ladder. Bibles, commentaries, journals, and room to grow."],
        ["A reading nook", "An armchair and a side table for when the desk is the wrong place to sit."],
        ["The window", "The best wall goes to glass. Light to work by, and something worth looking up at."],
        ["A wall for memorizing", "Corkboard or a framed chalkboard for verses we are working on together."],
        ["One door that closes", "Two of us inside, and the rest of the house on the other side of it."],
      ],
      notes: [
        "If the study and prayer room can sit next to each other, the prayer room becomes the natural place to go after reading.",
        "Two people working in one room means two people on calls in one room. Worth deciding early whether that is fine, or whether one of us moves out for meetings.",
        "A big window beside a screen means glare and afternoon heat. Set the desks perpendicular to the glass rather than facing it, and budget for blinds.",
        "Run power and data to both desks and to the reading nook before the walls close. Adding outlets behind finished built-ins is miserable.",
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
        ["His side: about her", "Song of Solomon 4:1-7, 9-10, the verses that describe the bride."],
        ["Her side: about him", "Song of Solomon 5:10-16, the verses that describe the bridegroom."],
        ["The words themselves", "A real page, a hand-lettered sheet, a letterpress print, or text etched into the glass. Still deciding."],
        ["Over the bed", "Song of Solomon 8:6-7, set as a seal."],
      ],
      notes: [
        "See the full text of both sides in the Nightstands section below.",
        "The translation is settled: ESV.",
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

  /* ---------- The standard ----------
   * Cross-cutting build principles. These govern every room. */
  const STANDARDS = [
    {
      title: "Take the whole Disneyland lesson, not half of it",
      body:
        "The park looks that good for two reasons, and only one is construction. It is built from materials chosen to survive millions of hands, and it is repainted and repaired on a schedule almost no building sees. Copy the first, and lay the house out so the second stays short.",
    },
    {
      title: "Water is what actually destroys houses",
      body:
        "Deep roof overhangs, flashing at every penetration, gutters that discharge well clear of the foundation, and ground that slopes away on all four sides. Nothing else on this list matters if water gets in.",
    },
    {
      title: "Pick materials that age instead of wearing out",
      body:
        "Stone, solid wood, real plaster, brass and bronze that take on a patina, a metal roof. These look better in twenty years. Painted exterior wood, hollow-core doors, and thin laminate only ever look worse.",
    },
    {
      title: "Overbuild whatever hands touch",
      body:
        "Door hardware, stair treads, thresholds, the entry floor, the counters. These take a thousand times the wear of a wall, and they are what makes a house feel solid or cheap under your hand.",
    },
    {
      title: "Make service easy or it will not happen",
      body:
        "Shutoffs labelled and within reach. An access panel at every valve. Filters you can change without a ladder. A real utility room rather than a crawlspace. Upkeep that takes ten minutes gets done. Upkeep that takes an afternoon does not.",
    },
    {
      title: "One palette, held everywhere",
      body:
        "The same hinge, the same knob, the same trim profile, the same paint sheen, room to room. Consistency is most of what reads as well crafted, and deciding it once costs nothing.",
    },
    {
      title: "Design what you see from where you stand",
      body:
        "Disney plans the sight line: what you see from the front door, from the end of the hall, from the bed, from the kitchen sink. A handful of views is the house anyone actually experiences.",
    },
    {
      title: "Finish the parts nobody sees",
      body:
        "Inside the cabinets, the back of the closet, the garage wall. When the hidden parts are finished, the visible parts stay that way, because everyone treats the house the way it was built.",
    },
    {
      title: "Budget for the rhythm, not just the build",
      body:
        "Even a well-built house needs a cadence: seal the stone, service the HVAC, touch up the paint, clear the gutters. A short list on a schedule is what keeps a house looking new. A long list that never happens is how houses age.",
    },
  ];

  /* ---------- Decisions ---------- */
  const DECISIONS = [
    { id: "roof", room: "standard", q: "Roof: what goes on top?", options: ["Standing seam metal", "Architectural shingle", "Clay or concrete tile", "Slate"] },
    { id: "exterior", room: "standard", q: "Exterior: what do we clad it in?", options: ["Brick or stone", "Fiber cement", "Stucco", "Wood siding"] },
    { id: "floors", room: "standard", q: "Main floors: what do we walk on?", options: ["White oak, site-finished", "Engineered wood", "Tile or stone", "Polished concrete"] },
    { id: "page", room: "bedroom", q: "How do the words go under the glass?", options: ["A real Bible page", "Hand-lettered", "Letterpress print", "Etched glass"] },
    { id: "location", room: "prayer", q: "Where does the prayer room go?", options: ["Interior room, main floor", "Basement", "Off the study", "Detached"] },
    { id: "vestibule", room: "prayer", q: "Add a vestibule (two doors) for true silence?", options: ["Yes", "No", "If budget allows"] },
    { id: "study-layout", room: "study", q: "How is her space arranged?", options: ["Shared desk plus her own", "Second desk, same wall", "Reading nook, off to the side", "Facing desks", "L-shaped shared desk"] },
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
    if (r) return r.name;
    if (id === "standard") return "The Standard";
    return "General";
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

  /* ---------- The standard ---------- */
  function renderStandards() {
    const list = $("#standard-list");
    if (!list) return;
    list.innerHTML = "";
    for (const s of STANDARDS) {
      list.append(
        el("li", { class: "standard" }, [
          el("h3", { text: s.title }),
          el("p", { text: s.body }),
        ])
      );
    }
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
    roomSelect.append(el("option", { value: "standard", text: "The Standard" }));
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
              room:
                ROOMS.some((r) => r.id === idea.room) || idea.room === "standard"
                  ? idea.room
                  : "general",
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

  /* ---------- Boot ----------
   * Each step is independent, so one failure cannot leave the whole page blank. */
  for (const step of [
    initTheme,
    initLightbox,
    renderStandards,
    renderRooms,
    initFilters,
    initNightstands,
    renderDecisions,
    initIdeas,
    renderIdeas,
    initInstall,
    initOffline,
  ]) {
    try {
      step();
    } catch (err) {
      console.error(`Our Home: ${step.name} failed`, err);
    }
  }
})();
