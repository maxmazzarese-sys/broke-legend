const panels = {
  chips: document.getElementById("chips"),
  box: document.getElementById("box"),
  pocket: document.getElementById("pocket"),
  leaderboard: document.getElementById("leaderboard")
};
const tabs = document.querySelectorAll("[data-tab]");
const shareUrl = location.href.split("#")[0];
const CHECKOUT = {
  1: "https://whop.com/checkout/ch_T195O0GEqmnu5BD/",
  5: "https://whop.com/checkout/ch_RgTbYfHeBAf88dx/",
  10: "https://whop.com/checkout/ch_jIEu4Od8B4pk5eS/",
  25: "https://whop.com/checkout/ch_l4z4HQw4qwHtXYp/",
  50: "https://whop.com/checkout/ch_FDoizbDnifrbUDR/",
  100: "https://whop.com/checkout/ch_l1lUoVayDGnGSRM/",
  1000: "https://whop.com/checkout/ch_OkjMRrPtoXwsDMR/"
};
const CHIP_META = [
  { amt: 1, cls: "b1", name: "Penny box", place: "Los Angeles", box: "Penny box" },
  { amt: 5, cls: "b5", name: "Holo box", place: "Los Angeles", box: "Holo box" },
  { amt: 10, cls: "b10", name: "Westside box", place: "Westside", box: "Westside box" },
  { amt: 25, cls: "b25", name: "Venice box", place: "Venice", box: "Venice box" },
  { amt: 50, cls: "b50", name: "Sunset box", place: "Sunset", box: "Sunset box" },
  { amt: 100, cls: "b100", name: "Alt-art box", place: "Los Angeles", box: "Alt-art box" },
  { amt: 1000, cls: "b1000", name: "Crown box", place: "Hollywood", box: "Crown box" }
];
const BOXES = {
  1: [
    { name: "0.15¢ credit", value: 0.0015, chance: 68, type: "credit", kind: "common", ico: "¢" },
    { name: "5¢ credit", value: 0.05, chance: 16, type: "credit", kind: "common", ico: "¢" },
    { name: "Sticker pack", value: 0.25, chance: 8, type: "item", kind: "card", ico: "★", sellOnly: true },
    { name: "Common card", value: 0.4, chance: 5, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$1 credit", value: 1, chance: 2.4, type: "credit", kind: "mid", ico: "$" },
    { name: "Foil card", value: 1.2, chance: 0.4, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$5 credit", value: 5, chance: 0.19, type: "credit", kind: "mid", ico: "$" },
    { name: "$25 credit", value: 25, chance: 0.01, type: "credit", kind: "jack", ico: "♛" }
  ],
  5: [
    { name: "1¢ credit", value: 0.01, chance: 52, type: "credit", kind: "common", ico: "¢" },
    { name: "25¢ credit", value: 0.25, chance: 24, type: "credit", kind: "common", ico: "¢" },
    { name: "Holo sticker", value: 1, chance: 10, type: "item", kind: "card", ico: "★", sellOnly: true },
    { name: "Holo card", value: 2, chance: 7, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$2 credit", value: 2, chance: 4, type: "credit", kind: "mid", ico: "$" },
    { name: "$5 credit", value: 5, chance: 2.4, type: "credit", kind: "mid", ico: "$" },
    { name: "Signed card", value: 8, chance: 0.5, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$25 credit", value: 25, chance: 0.09, type: "credit", kind: "jack", ico: "♛" },
    { name: "$100 credit", value: 100, chance: 0.01, type: "credit", kind: "jack", ico: "♛" }
  ],
  10: [
    { name: "5¢ credit", value: 0.05, chance: 48, type: "credit", kind: "common", ico: "¢" },
    { name: "50¢ credit", value: 0.5, chance: 24, type: "credit", kind: "common", ico: "¢" },
    { name: "Enamel pin", value: 2, chance: 10, type: "item", kind: "card", ico: "✦", sellOnly: true },
    { name: "Reverse holo", value: 4, chance: 8, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$5 credit", value: 5, chance: 6, type: "credit", kind: "mid", ico: "$" },
    { name: "$10 credit", value: 10, chance: 3.2, type: "credit", kind: "mid", ico: "$" },
    { name: "Promo slab", value: 12, chance: 0.6, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$50 credit", value: 50, chance: 0.18, type: "credit", kind: "jack", ico: "♛" },
    { name: "$250 credit", value: 250, chance: 0.02, type: "credit", kind: "jack", ico: "♛" }
  ],
  25: [
    { name: "10¢ credit", value: 0.1, chance: 42, type: "credit", kind: "common", ico: "¢" },
    { name: "$1 credit", value: 1, chance: 26, type: "credit", kind: "common", ico: "$" },
    { name: "Felt patch", value: 6, chance: 12, type: "item", kind: "card", ico: "✦", sellOnly: true },
    { name: "Promo card", value: 10, chance: 10, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$10 credit", value: 10, chance: 6, type: "credit", kind: "mid", ico: "$" },
    { name: "$25 credit", value: 25, chance: 3.2, type: "credit", kind: "mid", ico: "$" },
    { name: "Numbered card", value: 30, chance: 0.6, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$100 credit", value: 100, chance: 0.18, type: "credit", kind: "jack", ico: "♛" },
    { name: "$500 credit", value: 500, chance: 0.02, type: "credit", kind: "jack", ico: "♛" }
  ],
  50: [
    { name: "25¢ credit", value: 0.25, chance: 38, type: "credit", kind: "common", ico: "¢" },
    { name: "$2 credit", value: 2, chance: 28, type: "credit", kind: "common", ico: "$" },
    { name: "Zippo", value: 8, chance: 12, type: "item", kind: "card", ico: "✦", sellOnly: true },
    { name: "Full art", value: 20, chance: 10, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$20 credit", value: 20, chance: 7, type: "credit", kind: "mid", ico: "$" },
    { name: "$50 credit", value: 50, chance: 4, type: "credit", kind: "mid", ico: "$" },
    { name: "Gold border", value: 45, chance: 0.7, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$250 credit", value: 250, chance: 0.28, type: "credit", kind: "jack", ico: "♛" },
    { name: "$1,000 credit", value: 1000, chance: 0.02, type: "credit", kind: "jack", ico: "♛" }
  ],
  100: [
    { name: "50¢ credit", value: 0.5, chance: 34, type: "credit", kind: "common", ico: "¢" },
    { name: "$5 credit", value: 5, chance: 28, type: "credit", kind: "common", ico: "$" },
    { name: "House cap", value: 15, chance: 12, type: "item", kind: "card", ico: "✦", sellOnly: true },
    { name: "Alt art", value: 40, chance: 12, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$40 credit", value: 40, chance: 8, type: "credit", kind: "mid", ico: "$" },
    { name: "$100 credit", value: 100, chance: 4.6, type: "credit", kind: "mid", ico: "$" },
    { name: "1st edition", value: 80, chance: 1, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$500 credit", value: 500, chance: 0.38, type: "credit", kind: "jack", ico: "♛" },
    { name: "$2,500 credit", value: 2500, chance: 0.02, type: "credit", kind: "jack", ico: "♛" }
  ],
  1000: [
    { name: "$5 credit", value: 5, chance: 32, type: "credit", kind: "common", ico: "$" },
    { name: "$25 credit", value: 25, chance: 28, type: "credit", kind: "common", ico: "$" },
    { name: "Silk jacket", value: 80, chance: 12, type: "item", kind: "card", ico: "✦", sellOnly: true },
    { name: "Grailed pull", value: 250, chance: 12, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$250 credit", value: 250, chance: 9, type: "credit", kind: "mid", ico: "$" },
    { name: "$1,000 credit", value: 1000, chance: 5.4, type: "credit", kind: "mid", ico: "$" },
    { name: "Museum slab", value: 600, chance: 1.2, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { name: "$5,000 credit", value: 5000, chance: 0.36, type: "credit", kind: "jack", ico: "♛" },
    { name: "$25,000 credit", value: 25000, chance: 0.04, type: "credit", kind: "jack", ico: "♛" }
  ]
};
function prizesFor(chip) { return BOXES[chip.amt] || BOXES[1]; }
function toast(t) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = t;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
}
function money(n) {
  if (n > 0 && n < 0.01) return "$" + n.toFixed(4);
  return "$" + Number(n).toFixed(2);
}
function store() { try { return JSON.parse(localStorage.getItem("bl_case") || "{}"); } catch (e) { return {}; } }
function saveStore(next) { localStorage.setItem("bl_case", JSON.stringify(next)); }
function state() {
  const s = store();
  return { selected: Number(s.selected || 1), owned: s.owned || {}, credit: Number(s.credit || 0), pocket: s.pocket || [], spinning: false };
}
function patch(partial) { saveStore(Object.assign(store(), partial)); }
function show(tab) {
  Object.keys(panels).forEach(k => panels[k] && panels[k].classList.remove("show"));
  (panels[tab] || panels.chips).classList.add("show");
  tabs.forEach(el => el.classList.toggle("active", el.dataset.tab === tab));
  if (tab === "box") paintOdds();
  if (tab === "pocket") paintPocket();
  if (tab === "chips") paintChips();
}
tabs.forEach(el => el.addEventListener("click", e => {
  e.preventDefault();
  show(el.dataset.tab);
  history.replaceState(null, "", "#" + el.dataset.tab);
}));
function currentUser() {
  try {
    const s = JSON.parse(localStorage.getItem("bl_session") || "null");
    if (s && s.user) return s.user;
  } catch (e) {}
  return localStorage.getItem("bl_name") || "";
}
function selectedChip() {
  return CHIP_META.find(c => c.amt === state().selected) || CHIP_META[0];
}
function paintChips() {
  const grid = document.getElementById("chipGrid");
  if (!grid) return;
  const sel = state().selected;
  const owned = state().owned || {};
  grid.querySelectorAll("[data-amt]").forEach(btn => {
    const amt = Number(btn.dataset.amt);
    btn.classList.toggle("on", amt === sel);
    const have = btn.querySelector(".have");
    if (have) have.textContent = owned[amt] ? (owned[amt] + " ready") : "";
  });
}
function paintOwned() {
  const owned = state().owned;
  const bits = CHIP_META.map(c => (owned[c.amt] || 0) > 0 ? c.box + " ×" + owned[c.amt] : "").filter(Boolean);
  const line = document.getElementById("ownedLine");
  if (line) line.textContent = bits.length ? ("On you: " + bits.join("   ")) : "No boxes waiting to open.";
  paintCredit();
  paintChips();
}
function paintCredit() {
  const pill = document.getElementById("creditPill");
  if (pill) pill.textContent = "Credit " + money(state().credit);
}
function paintOdds() {
  const chip = selectedChip();
  const prizes = prizesFor(chip);
  const eye = document.getElementById("boxEyebrow");
  const title = document.getElementById("boxTitle");
  const sub = document.getElementById("boxSub");
  if (eye) eye.textContent = chip.place;
  if (title) title.textContent = chip.box;
  if (sub) sub.textContent = "This box opens after you buy it. Credit won here can buy another box.";
  const felt = document.querySelector(".felt");
  if (felt) felt.setAttribute("data-box", chip.box);
  const odds = document.getElementById("oddsBox");
  if (odds) odds.innerHTML = "<p>" + chip.box + " · $" + (chip.amt >= 1000 ? "1,000" : chip.amt) + "</p>" +
    prizes.map(p => "<div><span>" + p.name + (p.sellOnly ? " · sell only" : "") + "</span><span>" + p.chance + "%</span></div>").join("");
  buildReel(prizes, prizes[0], 16);
}
function paintPocket() {
  const list = document.getElementById("pocketList");
  if (!list) return;
  const pocket = state().pocket;
  if (!pocket.length) {
    list.innerHTML = '<div class="empty">Empty pocket. Pull a card and it lands here.</div>';
    return;
  }
  list.innerHTML = pocket.map((it, i) =>
    '<div class="row"><div><b>' + it.name + '</b><div class="note" style="margin:4px 0 0;text-align:left">Sell-only · ' + money(it.value) + ' store credit</div></div>' +
    '<button class="sell" data-sell="' + i + '">Sell it</button></div>'
  ).join("");
}
function pickPrize(prizes) {
  const r = Math.random() * 100;
  let acc = 0;
  for (const p of prizes) { acc += p.chance; if (r <= acc) return p; }
  return prizes[prizes.length - 1];
}
function buildReel(prizes, winner, copies) {
  const reel = document.getElementById("reel");
  if (!reel) return { reel: reel, winIndex: 0 };
  const strip = [];
  for (let i = 0; i < copies; i++) strip.push(prizes[i % prizes.length]);
  const winIndex = copies - 5;
  strip[winIndex] = winner;
  reel.innerHTML = strip.map(p =>
    '<div class="tile ' + p.kind + '"><div class="ico">' + p.ico + '</div><div class="nm">' + p.name + '</div><div class="vl">' +
      (p.type === "item" ? "sell " + money(p.value) : money(p.value)) +
    "</div></div>"
  ).join("");
  return { reel: reel, winIndex: winIndex };
}
function addChip(amt, n) {
  const owned = Object.assign({}, state().owned);
  owned[amt] = (owned[amt] || 0) + (n || 1);
  patch({ owned: owned, selected: amt });
  paintOwned();
}
function setPending(amt) {
  localStorage.setItem("bl_pending", JSON.stringify({ amt: Number(amt), at: Date.now() }));
  sessionStorage.setItem("bl_pending_chip", String(amt));
}
function readPending() {
  try { return JSON.parse(localStorage.getItem("bl_pending") || "null"); } catch (e) { return null; }
}
function clearPending() {
  localStorage.removeItem("bl_pending");
  sessionStorage.removeItem("bl_pending_chip");
  sessionStorage.removeItem("bl_pending_tip");
}
const grid = document.getElementById("chipGrid");
if (grid) grid.addEventListener("click", e => {
  const btn = e.target.closest("[data-amt]");
  if (!btn) return;
  patch({ selected: Number(btn.dataset.amt) });
  paintChips();
  paintOdds();
});
const buyChip = document.getElementById("buyChip");
if (buyChip) buyChip.onclick = () => {
  const chip = selectedChip();
  setPending(chip.amt);
  const back = encodeURIComponent(location.href.split("#")[0] + "?tipped=1&amt=" + chip.amt);
  location.href = CHECKOUT[chip.amt] + (CHECKOUT[chip.amt].indexOf("?") >= 0 ? "&" : "?") + "redirect=" + back;
};
const buyCredit = document.getElementById("buyCredit");
if (buyCredit) buyCredit.onclick = () => {
  const chip = selectedChip();
  const s = state();
  if (s.credit < chip.amt) {
    toast("Need " + money(chip.amt) + " credit for this box");
    return;
  }
  patch({ credit: s.credit - chip.amt });
  addChip(chip.amt, 1);
  toast(chip.box + " unlocked with credit");
  show("box");
};
const paidBtn = document.getElementById("paidBtn");
if (paidBtn) paidBtn.onclick = () => {
  const pending = readPending();
  const amt = (pending && pending.amt) || selectedChip().amt;
  addChip(amt, 1);
  clearPending();
  toast("Box added");
  show("box");
};
const toBox = document.getElementById("toBox");
if (toBox) toBox.onclick = () => show("box");
const pocketList = document.getElementById("pocketList");
if (pocketList) pocketList.addEventListener("click", e => {
  const btn = e.target.closest("[data-sell]");
  if (!btn) return;
  const s = state();
  const pocket = s.pocket.slice();
  const item = pocket.splice(Number(btn.dataset.sell), 1)[0];
  if (!item) return;
  patch({ pocket: pocket, credit: s.credit + Number(item.value) });
  paintPocket();
  paintCredit();
  toast("Sold back to the house.");
});
const spinBtn = document.getElementById("spinBtn");
if (spinBtn) spinBtn.onclick = () => {
  const s = state();
  if (s.spinning) return;
  const chip = selectedChip();
  const have = s.owned[chip.amt] || 0;
  if (have < 1) {
    document.getElementById("spinResult").textContent = "Buy " + chip.box + " first.";
    toast("No box to open");
    return;
  }
  const owned = Object.assign({}, s.owned);
  owned[chip.amt] = have - 1;
  patch({ owned: owned });
  paintOwned();
  const prizes = prizesFor(chip);
  const winner = pickPrize(prizes);
  const built = buildReel(prizes, winner, 40);
  const wrap = document.querySelector(".reel-wrap");
  const target = built.winIndex * 120 - (wrap.clientWidth / 2 - 54);
  built.reel.style.transition = "none";
  built.reel.style.transform = "translateX(0px)";
  patch({ spinning: true });
  spinBtn.disabled = true;
  document.getElementById("spinResult").textContent = "Lid is off. Don't blink.";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      built.reel.style.transition = "transform 4.8s cubic-bezier(0.15, 0.72, 0.08, 1)";
      built.reel.style.transform = "translateX(" + (-target) + "px)";
    });
  });
  setTimeout(() => {
    const now = state();
    if (winner.type === "credit") {
      patch({ credit: now.credit + winner.value, spinning: false });
      document.getElementById("spinResult").textContent = "Landed on " + winner.name + ". " + money(winner.value) + " store credit. Use it to buy another box.";
    } else {
      const pocket = now.pocket.slice();
      pocket.push({ name: winner.name, value: winner.value, at: Date.now() });
      patch({ pocket: pocket, spinning: false });
      document.getElementById("spinResult").textContent = "You pulled " + winner.name + ". Sell it in Pocket for store credit.";
    }
    paintCredit();
    spinBtn.disabled = false;
  }, 5000);
};
paintChips();
paintOwned();
paintOdds();
const startTab = (location.hash || "#chips").replace("#", "");
show(["chips", "box", "pocket"].includes(startTab) ? startTab : "chips");
if (/[?&]tipped=1/.test(location.search) || /[?&]amt=/.test(location.search)) {
  const q = new URLSearchParams(location.search);
  const pending = Number(q.get("amt") || (readPending() && readPending().amt) || 0);
  if (pending) {
    addChip(pending, 1);
    document.getElementById("spinResult").textContent = selectedChip().box + " is ready. Unlock it.";
    show("box");
  }
  clearPending();
  history.replaceState({}, "", location.pathname + "#box");
}
