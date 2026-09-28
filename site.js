const panels = {
  chips: document.getElementById("chips"),
  box: document.getElementById("box"),
  pocket: document.getElementById("pocket")
};
const tabs = document.querySelectorAll("[data-tab]");
const TILE = 154;
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
  { amt: 1, name: "Penny box", place: "Los Angeles", box: "Penny box" },
  { amt: 5, name: "Holo box", place: "Los Angeles", box: "Holo box" },
  { amt: 10, name: "Westside box", place: "Westside", box: "Westside box" },
  { amt: 25, name: "Venice box", place: "Venice", box: "Venice box" },
  { amt: 50, name: "Sunset box", place: "Sunset", box: "Sunset box" },
  { amt: 100, name: "Alt-art box", place: "Los Angeles", box: "Alt-art box" },
  { amt: 1000, name: "Crown box", place: "Hollywood", box: "Crown box" }
];
function P(tag, art, chance, value, type, kind, name) {
  return { tag: tag, art: art, chance: chance, value: value, type: type, kind: kind, name: name, sellOnly: type === "item" };
}
const BOXES = {
  1: [
    P("Penny", "coin", 68, 0.0015, "credit", "common", "House penny"),
    P("Nickel", "coin", 16, 0.05, "credit", "common", "House nickel"),
    P("Sticker", "sticker", 8, 0.25, "item", "card", "Sticker pack"),
    P("Common", "card", 5, 0.4, "item", "card", "Common card"),
    P("One", "cash", 2.4, 1, "credit", "mid", "Folded one"),
    P("Foil", "foil", 0.4, 1.2, "item", "card", "Foil card"),
    P("Five", "cash", 0.19, 5, "credit", "mid", "Five stack"),
    P("Crown", "crown", 0.01, 25, "credit", "jack", "Small crown")
  ],
  5: [
    P("Penny", "coin", 52, 0.01, "credit", "common", "House penny"),
    P("Quarter", "coin", 24, 0.25, "credit", "common", "House quarter"),
    P("Holo", "sticker", 10, 1, "item", "card", "Holo sticker"),
    P("Holo", "foil", 7, 2, "item", "card", "Holo card"),
    P("Two", "cash", 4, 2, "credit", "mid", "Two stack"),
    P("Five", "cash", 2.4, 5, "credit", "mid", "Five stack"),
    P("Signed", "card", 0.5, 8, "item", "card", "Signed card"),
    P("Crown", "crown", 0.09, 25, "credit", "jack", "Blue crown"),
    P("Jack", "crown", 0.01, 100, "credit", "jack", "Gold book")
  ],
  10: [
    P("Nickel", "coin", 48, 0.05, "credit", "common", "House nickel"),
    P("Half", "coin", 24, 0.5, "credit", "common", "Half dollar"),
    P("Pin", "pin", 10, 2, "item", "card", "Enamel pin"),
    P("Reverse", "foil", 8, 4, "item", "card", "Reverse holo"),
    P("Five", "cash", 6, 5, "credit", "mid", "Five stack"),
    P("Ten", "cash", 3.2, 10, "credit", "mid", "Ten stack"),
    P("Slab", "slab", 0.6, 12, "item", "card", "Promo slab"),
    P("Crown", "crown", 0.18, 50, "credit", "jack", "Westside crown"),
    P("Jack", "crown", 0.02, 250, "credit", "jack", "Heavy crown")
  ],
  25: [
    P("Dime", "coin", 42, 0.1, "credit", "common", "House dime"),
    P("One", "cash", 26, 1, "credit", "common", "Folded one"),
    P("Patch", "patch", 12, 6, "item", "card", "Felt patch"),
    P("Promo", "card", 10, 10, "item", "card", "Promo card"),
    P("Ten", "cash", 6, 10, "credit", "mid", "Ten stack"),
    P("Twenty", "cash", 3.2, 25, "credit", "mid", "Twenty-five"),
    P("Numbered", "foil", 0.6, 30, "item", "card", "Numbered card"),
    P("Crown", "crown", 0.18, 100, "credit", "jack", "Venice crown"),
    P("Jack", "crown", 0.02, 500, "credit", "jack", "Green book")
  ],
  50: [
    P("Quarter", "coin", 38, 0.25, "credit", "common", "House quarter"),
    P("Two", "cash", 28, 2, "credit", "common", "Two stack"),
    P("Zippo", "zippo", 12, 8, "item", "card", "House zippo"),
    P("Full art", "foil", 10, 20, "item", "card", "Full art"),
    P("Twenty", "cash", 7, 20, "credit", "mid", "Twenty stack"),
    P("Fifty", "cash", 4, 50, "credit", "mid", "Fifty stack"),
    P("Gold", "foil", 0.7, 45, "item", "card", "Gold border"),
    P("Crown", "crown", 0.28, 250, "credit", "jack", "Sunset crown"),
    P("Jack", "crown", 0.02, 1000, "credit", "jack", "Grand book")
  ],
  100: [
    P("Half", "coin", 34, 0.5, "credit", "common", "Half dollar"),
    P("Five", "cash", 28, 5, "credit", "common", "Five stack"),
    P("Cap", "cap", 12, 15, "item", "card", "House cap"),
    P("Alt art", "foil", 12, 40, "item", "card", "Alt art"),
    P("Forty", "cash", 8, 40, "credit", "mid", "Forty stack"),
    P("Hundred", "cash", 4.6, 100, "credit", "mid", "Hundred stack"),
    P("First", "slab", 1, 80, "item", "card", "1st edition"),
    P("Crown", "crown", 0.38, 500, "credit", "jack", "Alt crown"),
    P("Jack", "crown", 0.02, 2500, "credit", "jack", "Museum book")
  ],
  1000: [
    P("Five", "cash", 32, 5, "credit", "common", "Five stack"),
    P("Twenty", "cash", 28, 25, "credit", "common", "Twenty-five"),
    P("Silk", "jacket", 12, 80, "item", "card", "Silk jacket"),
    P("Grailed", "foil", 12, 250, "item", "card", "Grailed pull"),
    P("Stack", "cash", 9, 250, "credit", "mid", "Fat stack"),
    P("Grand", "cash", 5.4, 1000, "credit", "mid", "Grand stack"),
    P("Museum", "slab", 1.2, 600, "item", "card", "Museum slab"),
    P("Crown", "crown", 0.36, 5000, "credit", "jack", "Hollywood crown"),
    P("Throne", "crown", 0.04, 25000, "credit", "jack", "The throne")
  ]
};
function prizesFor(chip) { return BOXES[chip.amt] || BOXES[1]; }
function toast(t) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = t;
  el.classList.add("show");
  setTimeout(function(){ el.classList.remove("show"); }, 1800);
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
  Object.keys(panels).forEach(function(k){ if (panels[k]) panels[k].classList.remove("show"); });
  (panels[tab] || panels.chips).classList.add("show");
  tabs.forEach(function(el){ el.classList.toggle("active", el.dataset.tab === tab); });
  if (tab === "box") paintOdds();
  if (tab === "pocket") paintPocket();
  if (tab === "chips") paintChips();
}
tabs.forEach(function(el){
  el.addEventListener("click", function(e){
    e.preventDefault();
    show(el.dataset.tab);
    history.replaceState(null, "", "#" + el.dataset.tab);
  });
});
function selectedChip() {
  return CHIP_META.find(function(c){ return c.amt === state().selected; }) || CHIP_META[0];
}
function paintChips() {
  const grid = document.getElementById("chipGrid");
  if (!grid) return;
  const sel = state().selected;
  const owned = state().owned || {};
  grid.querySelectorAll("[data-amt]").forEach(function(btn){
    const amt = Number(btn.dataset.amt);
    btn.classList.toggle("on", amt === sel);
    const have = btn.querySelector(".have");
    if (have) have.textContent = owned[amt] ? (owned[amt] + " ready") : "";
  });
}
function paintOwned() {
  const owned = state().owned;
  const bits = CHIP_META.map(function(c){ return (owned[c.amt] || 0) > 0 ? c.box + " x" + owned[c.amt] : ""; }).filter(Boolean);
  const line = document.getElementById("ownedLine");
  if (line) line.textContent = bits.length ? ("On you: " + bits.join("   ")) : "No boxes waiting to open.";
  paintCredit();
  paintChips();
}
function paintCredit() {
  const pill = document.getElementById("creditPill");
  if (pill) pill.textContent = "Credit " + money(state().credit);
}
function tileHTML(p) {
  return '<div class="tile kind-' + p.kind + '"><div class="band"></div><div class="art art-' + p.art + '"></div><div class="tag">' + p.tag + '</div></div>';
}
function paintOdds() {
  const chip = selectedChip();
  const prizes = prizesFor(chip);
  const eye = document.getElementById("boxEyebrow");
  const title = document.getElementById("boxTitle");
  const sub = document.getElementById("boxSub");
  if (eye) eye.textContent = chip.place;
  if (title) title.textContent = chip.box;
  if (sub) sub.textContent = "Items on the reel. Credit you land can buy another box.";
  const odds = document.getElementById("oddsBox");
  if (odds) odds.innerHTML = prizes.map(function(p){
    return '<div class="oddsrow"><div class="mini art art-' + p.art + '"></div><span>' + p.name + (p.sellOnly ? " · sell only" : "") + '</span><span>' + p.chance + '%</span></div>';
  }).join("");
  buildReel(prizes, prizes[0], 18);
}
function paintPocket() {
  const list = document.getElementById("pocketList");
  if (!list) return;
  const pocket = state().pocket;
  if (!pocket.length) {
    list.innerHTML = '<div class="empty">Empty pocket. Pull a card and it lands here.</div>';
    return;
  }
  list.innerHTML = pocket.map(function(it, i){
    return '<div class="row"><div><b>' + it.name + '</b><div style="margin:4px 0 0;text-align:left;color:#d8cbb6">Sell-only · ' + money(it.value) + '</div></div><button class="sell" data-sell="' + i + '">Sell it</button></div>';
  }).join("");
}
function pickPrize(prizes) {
  const r = Math.random() * 100;
  let acc = 0;
  for (let i = 0; i < prizes.length; i++) { acc += prizes[i].chance; if (r <= acc) return prizes[i]; }
  return prizes[prizes.length - 1];
}
function buildReel(prizes, winner, copies) {
  const reel = document.getElementById("reel");
  if (!reel) return { reel: reel, winIndex: 0 };
  const strip = [];
  for (let i = 0; i < copies; i++) strip.push(prizes[i % prizes.length]);
  const winIndex = copies - 4;
  strip[winIndex] = winner;
  reel.innerHTML = strip.map(tileHTML).join("");
  reel.style.transition = "none";
  reel.style.transform = "translate3d(0,0,0)";
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
function tickSound(freq) {
  try {
    const ctx = tickSound.ctx || (tickSound.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = freq || 420;
    g.gain.value = 0.03;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}
function showWin(prize, preview) {
  const pop = document.getElementById("winPop");
  const art = document.getElementById("winArt");
  if (!pop) return;
  art.innerHTML = '<div class="art art-' + prize.art + '"></div>';
  document.getElementById("winName").textContent = preview ? (prize.name + " · preview") : prize.name;
  document.getElementById("winNote").textContent = preview
    ? "Demo spin. Buy the box to keep a pull."
    : (prize.type === "credit" ? money(prize.value) + " went to store credit." : "Sits in your pocket. Sell it for " + money(prize.value) + ".");
  pop.classList.add("show");
}
function runSpin(winner, prizes, after) {
  const wrap = document.getElementById("reelWrap");
  const built = buildReel(prizes, winner, 28);
  const reel = built.reel;
  const tiles = reel.children;
  const center = wrap.clientWidth / 2;
  const target = built.winIndex * TILE - (center - 70) + (Math.random() * 12 - 6);
  wrap.classList.add("spinning");
  patch({ spinning: true });
  reel.style.transition = "none";
  reel.style.transform = "translate3d(0,0,0)";
  void reel.offsetWidth;
  const duration = 1350;
  reel.style.transition = "transform " + duration + "ms cubic-bezier(0.12, 0.82, 0.08, 1)";
  reel.style.transform = "translate3d(" + (-target) + "px,0,0)";
  let lastTile = 0;
  const started = performance.now();
  function ticks(now) {
    const t = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const x = target * eased;
    const idx = Math.floor((x + center) / TILE);
    if (idx !== lastTile) {
      lastTile = idx;
      tickSound(340 + (idx % 6) * 28);
    }
    if (t < 1) requestAnimationFrame(ticks);
  }
  requestAnimationFrame(ticks);
  setTimeout(function(){
    wrap.classList.remove("spinning");
    reel.style.transition = "none";
    reel.style.transform = "translate3d(" + (-target) + "px,0,0)";
    if (tiles[built.winIndex]) tiles[built.winIndex].classList.add("win");
    tickSound(880);
    patch({ spinning: false });
    if (after) after();
  }, duration + 40);
}
const grid = document.getElementById("chipGrid");
if (grid) grid.addEventListener("click", function(e){
  const btn = e.target.closest("[data-amt]");
  if (!btn) return;
  patch({ selected: Number(btn.dataset.amt) });
  paintChips();
  paintOdds();
});
const buyChip = document.getElementById("buyChip");
if (buyChip) buyChip.onclick = function(){
  const chip = selectedChip();
  setPending(chip.amt);
  const back = encodeURIComponent(location.href.split("#")[0] + "?tipped=1&amt=" + chip.amt);
  location.href = CHECKOUT[chip.amt] + (CHECKOUT[chip.amt].indexOf("?") >= 0 ? "&" : "?") + "redirect=" + back;
};
const buyCredit = document.getElementById("buyCredit");
if (buyCredit) buyCredit.onclick = function(){
  const chip = selectedChip();
  const s = state();
  if (s.credit < chip.amt) { toast("Need " + money(chip.amt) + " credit for this box"); return; }
  patch({ credit: s.credit - chip.amt });
  addChip(chip.amt, 1);
  toast(chip.box + " unlocked with credit");
  show("box");
};
const paidBtn = document.getElementById("paidBtn");
if (paidBtn) paidBtn.onclick = function(){
  const pending = readPending();
  const amt = (pending && pending.amt) || selectedChip().amt;
  addChip(amt, 1);
  clearPending();
  toast("Box added");
  show("box");
};
const toBox = document.getElementById("toBox");
if (toBox) toBox.onclick = function(){ show("box"); };
const pocketList = document.getElementById("pocketList");
if (pocketList) pocketList.addEventListener("click", function(e){
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
function settle(winner) {
  const now = state();
  if (winner.type === "credit") {
    patch({ credit: now.credit + winner.value });
    document.getElementById("spinResult").textContent = "Landed the " + winner.tag + ".";
  } else {
    const pocket = now.pocket.slice();
    pocket.push({ name: winner.name, value: winner.value, at: Date.now() });
    patch({ pocket: pocket });
    document.getElementById("spinResult").textContent = "Pulled the " + winner.tag + ".";
  }
  paintCredit();
  showWin(winner, false);
}
const spinBtn = document.getElementById("spinBtn");
if (spinBtn) spinBtn.onclick = function(){
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
  spinBtn.disabled = true;
  document.getElementById("spinResult").textContent = "Lid is off.";
  runSpin(winner, prizes, function(){
    settle(winner);
    spinBtn.disabled = false;
  });
};
const demoBtn = document.getElementById("demoBtn");
if (demoBtn) demoBtn.onclick = function(){
  if (state().spinning) return;
  const prizes = prizesFor(selectedChip());
  const winner = pickPrize(prizes);
  document.getElementById("spinResult").textContent = "Preview only. Nothing is kept.";
  runSpin(winner, prizes, function(){ showWin(winner, true); });
};
const winClose = document.getElementById("winClose");
if (winClose) winClose.onclick = function(){ document.getElementById("winPop").classList.remove("show"); };
(function sharpenCards(){
  const s = document.createElement("style");
  s.textContent = ".reel-wrap.spinning .tile,.tile,.art,.art-foil,.art-crown{filter:none!important;-webkit-filter:none!important}.tile{flex:0 0 140px;height:188px;transform:translateZ(0);backface-visibility:hidden}.art{width:96px;height:96px;flex:0 0 96px}.reel{transform:translate3d(0,0,0)}";
  document.head.appendChild(s);
})();
function giveDemoCredit(force) {
  const gate = document.getElementById("gate");
  if (gate) gate.classList.add("hidden");
  const s = store();
  if (force || !s.demo10) {
    patch({ credit: Number(s.credit || 0) + 10, demo10: true });
    toast("$10 demo credit loaded");
  }
  paintCredit();
}
(function setupDemo(){
  const row = document.querySelector(".chiprow");
  if (row && !document.getElementById("demoCreditBtn")) {
    const b = document.createElement("button");
    b.id = "demoCreditBtn";
    b.className = "ghost";
    b.type = "button";
    b.textContent = "Add $10 demo credit";
    b.onclick = function(){ giveDemoCredit(true); };
    row.appendChild(b);
  }
  giveDemoCredit(/[?&]demo=1/.test(location.search) || !store().demo10);
})();
paintChips();
paintOwned();
paintOdds();
const startTab = (location.hash || "#chips").replace("#", "");
show(["chips", "box", "pocket"].indexOf(startTab) >= 0 ? startTab : "chips");
if (/[?&]tipped=1/.test(location.search) || /[?&]amt=/.test(location.search)) {
  const q = new URLSearchParams(location.search);
  const pend = readPending();
  const pending = Number(q.get("amt") || (pend && pend.amt) || 0);
  if (pending) {
    addChip(pending, 1);
    document.getElementById("spinResult").textContent = selectedChip().box + " is ready.";
    show("box");
  }
  clearPending();
  history.replaceState({}, "", location.pathname + "#box");
}
