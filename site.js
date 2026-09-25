const panels = {
  chips: document.getElementById("chips"),
  box: document.getElementById("box"),
  pocket: document.getElementById("pocket"),
  leaderboard: document.getElementById("leaderboard")
};
const tabs = document.querySelectorAll("[data-tab]");
const shareUrl = location.origin.includes("localhost") ? "https://brokelegend.com" : location.origin;
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
  { amt: 1, cls: "c1", name: "Broke", place: "LOS ANGELES", box: "Penny box" },
  { amt: 5, cls: "c5", name: "Legend", place: "LOS ANGELES", box: "Holo box" },
  { amt: 10, cls: "c10", name: "Broke", place: "WESTSIDE", box: "Westside box" },
  { amt: 25, cls: "c25", name: "Legend", place: "VENICE", box: "Venice box" },
  { amt: 50, cls: "c50", name: "Broke", place: "SUNSET", box: "Sunset box" },
  { amt: 100, cls: "c100", name: "Legend", place: "LOS ANGELES", box: "Alt-art box" },
  { amt: 1000, cls: "c1000", name: "Crown", place: "HOLLYWOOD", box: "Crown box" }
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
  if (tab === "leaderboard") paintBoard();
  if (tab === "box") paintOdds();
  if (tab === "pocket") paintPocket();
  if (tab === "chips") paintOwned();
}
tabs.forEach(el => el.addEventListener("click", e => {
  e.preventDefault();
  show(el.dataset.tab);
  history.replaceState(null, "", "#" + el.dataset.tab);
}));
function keyName(s) { return String(s || "").trim().toLowerCase(); }
function uniq(list) {
  const map = {};
  (list || []).forEach(p => {
    const k = keyName(p.name);
    if (!k) return;
    const amt = Number(p.amt || 0);
    if (!map[k] || amt > map[k].amt) map[k] = { name: p.name, amt };
  });
  return Object.values(map);
}
function donorList() {
  let list = [];
  try { list = JSON.parse(localStorage.getItem("bl_public_donors") || "[]"); } catch (e) { list = []; }
  return uniq(list).sort((a, b) => b.amt - a.amt).slice(0, 20);
}
function saveDonors(list) { localStorage.setItem("bl_public_donors", JSON.stringify(uniq(list))); }
function paintMeter() {
  const throne = document.getElementById("throne");
  const first = donorList()[0];
  if (!throne) return;
  if (first) throne.innerHTML = '<div class="seat">♛</div><h3>' + first.name + ' holds the throne</h3><p>$' + first.amt + ' \u00b7 the board finally blinked.</p>';
  else throne.innerHTML = '<div class="seat">♛</div><h3>Seat 1 is empty</h3><p>First chip takes the Hollywood seat.</p>';
}
async function loadPublicBoard() {
  try {
    const res = await fetch("board.json?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data.donors)) saveDonors(uniq(data.donors.concat(donorList())));
  } catch (e) {}
}
function paintBoard() {
  const donors = document.getElementById("boardDonors");
  if (!donors) return;
  const tips = donorList();
  donors.innerHTML = tips.length
    ? tips.map((d, i) => '<div class="row"><b>' + (i === 0 ? "♛ " : "") + (i + 1) + ". " + d.name + '</b><span>$' + d.amt + "</span></div>").join("") + '<p class="note">One seat per name. Board refreshes after each buy-in.</p>'
    : '<div class="empty">Nobody yet. The crown is still on the table.</div>';
  paintMeter();
}
function currentUser() {
  try {
    const s = JSON.parse(localStorage.getItem("bl_session") || "null");
    if (s && s.user) return s.user;
  } catch (e) {}
  return localStorage.getItem("bl_name") || "";
}
function recordTip(amt) {
  amt = Number(amt || 0); if (!amt) return;
  const name = currentUser() || "Whale";
  const list = donorList();
  const k = keyName(name);
  const prev = list.find(d => keyName(d.name) === k);
  const next = prev ? Number(prev.amt) + amt : amt;
  saveDonors([{ name: name, amt: next }].concat(list.filter(d => keyName(d.name) !== k)));
  paintBoard(); paintMeter();
}
function selectedChip() {
  return CHIP_META.find(c => c.amt === state().selected) || CHIP_META[0];
}
function paintChips() {
  const grid = document.getElementById("chipGrid");
  const sel = state().selected;
  grid.innerHTML = CHIP_META.map(c =>
    '<button type="button" class="chip ' + c.cls + (c.amt === sel ? " on" : "") + '" data-amt="' + c.amt + '">' +
      '<span class="label"><em>' + c.name + '</em><small>' + c.place + '</small><b>' + (c.amt >= 1000 ? "$1K" : "$" + c.amt) + '</b></span>' +
    '</button>'
  ).join("");
}
function paintOwned() {
  const owned = state().owned;
  const bits = CHIP_META.map(c => (owned[c.amt] || 0) > 0 ? "$" + (c.amt >= 1000 ? "1K" : c.amt) + " \u00d7" + owned[c.amt] : "").filter(Boolean);
  document.getElementById("ownedLine").textContent = bits.length ? ("On you: " + bits.join("   ")) : "No chips in your pocket yet.";
  paintCredit();
}
function paintCredit() {
  document.getElementById("creditPill").textContent = "Credit " + money(state().credit);
}
function paintOdds() {
  const chip = selectedChip();
  const prizes = prizesFor(chip);
  const label = chip.box + " \u00b7 $" + (chip.amt >= 1000 ? "1,000" : chip.amt) + " chip";
  const eye = document.getElementById("boxEyebrow");
  const title = document.getElementById("boxTitle");
  const sub = document.getElementById("boxSub");
  if (eye) eye.textContent = chip.place;
  if (title) title.textContent = chip.box;
  if (sub) sub.textContent = "This box only opens with the $" + (chip.amt >= 1000 ? "1,000" : chip.amt) + " " + chip.name + " chip. Cards and merch sell back as store credit.";
  const felt = document.querySelector(".felt");
  if (felt) felt.setAttribute("data-box", chip.box);
  document.getElementById("oddsBox").innerHTML = "<p>" + label + "</p>" +
    prizes.map(p => "<div><span>" + p.name + (p.sellOnly ? " \u00b7 sell only" : "") + "</span><span>" + p.chance + "%</span></div>").join("");
  buildReel(prizes, prizes[0], 16);
}
function paintPocket() {
  const list = document.getElementById("pocketList");
  const pocket = state().pocket;
  if (!pocket.length) {
    list.innerHTML = '<div class="empty">Empty pocket. Pull a card and it lands here.</div>';
    return;
  }
  list.innerHTML = pocket.map((it, i) =>
    '<div class="row"><div><b>' + it.name + '</b><div class="note" style="margin:4px 0 0;text-align:left">Sell-only \u00b7 ' + money(it.value) + ' store credit</div></div>' +
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
  paintChips();
  paintOwned();
}
document.getElementById("chipGrid").addEventListener("click", e => {
  const btn = e.target.closest("[data-amt]");
  if (!btn) return;
  patch({ selected: Number(btn.dataset.amt) });
  paintChips();
  paintOdds();
});
document.getElementById("buyChip").onclick = () => {
  const chip = selectedChip();
  sessionStorage.setItem("bl_pending_tip", String(chip.amt));
  sessionStorage.setItem("bl_pending_chip", String(chip.amt));
  location.href = CHECKOUT[chip.amt];
};
document.getElementById("toBox").onclick = () => show("box");
document.getElementById("pocketList").addEventListener("click", e => {
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
document.getElementById("spinBtn").onclick = () => {
  const s = state();
  if (s.spinning) return;
  const chip = selectedChip();
  const have = s.owned[chip.amt] || 0;
  if (have < 1) {
    document.getElementById("spinResult").textContent = "Buy the " + chip.name + " chip first. It lives on the Chips page.";
    toast("No chip for that box.");
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
  document.getElementById("spinBtn").disabled = true;
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
      document.getElementById("spinResult").textContent = "Landed on " + winner.name + ". " + money(winner.value) + " to your store credit.";
    } else {
      const pocket = now.pocket.slice();
      pocket.push({ name: winner.name, value: winner.value, at: Date.now() });
      patch({ pocket: pocket, spinning: false });
      document.getElementById("spinResult").textContent = "You pulled " + winner.name + ". It sits in your pocket until you sell it.";
    }
    paintCredit();
    document.getElementById("spinBtn").disabled = false;
  }, 5000);
};
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) shareBtn.onclick = async () => {
  const data = { title: "Broke Legend", text: "Buy a chip. Open the box.", url: shareUrl };
  try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e && e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(shareUrl); toast("Link copied"); } catch (e) { prompt("Copy this link", shareUrl); }
};
function rainCards() {
  const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const suits = ["\u2660","\u2665","\u2666","\u2663"];
  const bits = [];
  const H = window.innerHeight, W = window.innerWidth;
  function spawn(i) {
    const s = suits[i % 4], left = i % 2 === 0;
    const el = document.createElement("div");
    el.className = "flycard" + ((s === "\u2665" || s === "\u2666") ? " red" : "");
    el.innerHTML = "<b>" + ranks[i % 13] + "</b><i>" + s + "</i>";
    document.body.appendChild(el);
    const ang = (30 + Math.random() * 40) * Math.PI / 180;
    const speed = 8 + Math.random() * 5;
    bits.push({ el: el, x: left ? 14 : W - 52, y: H - 58, vx: (left ? 1 : -1) * Math.cos(ang) * speed, vy: -Math.sin(ang) * speed, g: 0.18, rot: 0, spin: (left ? 1 : -1) * 3, life: 0, max: 2800 });
  }
  let n = 0;
  const emitter = setInterval(() => { spawn(n++); spawn(n++); if (n >= 60) clearInterval(emitter); }, 40);
  function tick() {
    for (let i = bits.length - 1; i >= 0; i--) {
      const c = bits[i];
      c.vy += c.g; c.x += c.vx; c.y += c.vy; c.rot += c.spin; c.life += 16;
      c.el.style.transform = "translate(" + c.x + "px," + c.y + "px) rotate(" + c.rot + "deg)";
      c.el.style.opacity = c.life > c.max - 400 ? String(Math.max(0, 1 - (c.life - (c.max - 400)) / 400)) : "1";
      if (c.life > c.max || c.y > H + 80) { c.el.remove(); bits.splice(i, 1); }
    }
    if (bits.length || n < 60) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  toast("Chip is on the felt.");
}
(function extraCss() {
  const s = document.createElement("style");
  s.textContent = ".flycard{position:fixed;left:0;top:0;width:40px;height:56px;background:#fffdf8;border-radius:6px;z-index:80;pointer-events:none;font:700 12px/1 DM Sans,sans-serif;color:#1a1a1a;padding:5px;box-shadow:0 10px 16px rgba(0,0,0,.3)}.flycard.red{color:#b4232c}";
  document.head.appendChild(s);
})();
paintChips();
paintOwned();
paintOdds();
buildReel(prizesFor(selectedChip()), prizesFor(selectedChip())[0], 16);
const startTab = (location.hash || "#chips").replace("#", "");
show(["chips", "box", "pocket", "leaderboard"].includes(startTab) ? startTab : "chips");
loadPublicBoard().then(() => { paintBoard(); paintMeter(); });
paintMeter();
if (/[?&]tipped=1/.test(location.search) || /[?&]amt=/.test(location.search)) {
  const q = new URLSearchParams(location.search);
  const pending = Number(q.get("amt") || sessionStorage.getItem("bl_pending_chip") || sessionStorage.getItem("bl_pending_tip") || 0);
  if (pending) {
    addChip(pending, 1);
    recordTip(pending);
    setTimeout(rainCards, 200);
    show("box");
    document.getElementById("spinResult").textContent = "$" + pending + " chip is on the table. Unlock the box.";
  }
  sessionStorage.removeItem("bl_pending_tip");
  sessionStorage.removeItem("bl_pending_chip");
  history.replaceState({}, "", location.pathname + "#box");
}
