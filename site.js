const panels = {
  chips: document.getElementById("chips"),
  box: document.getElementById("box"),
  pocket: document.getElementById("pocket"),
  leaderboard: document.getElementById("leaderboard")
};
const tabs = document.querySelectorAll("[data-tab]");
const shareUrl = location.origin.includes("localhost") ? "https://brokelegend.com" : location.origin;
const GOAL = 250;

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
  { amt: 1, cls: "c1", name: "Broke", place: "LOS ANGELES", card: "Common card", sell: 0.4 },
  { amt: 5, cls: "c5", name: "Legend", place: "LOS ANGELES", card: "Holo card", sell: 2 },
  { amt: 10, cls: "c10", name: "Broke", place: "WESTSIDE", card: "Reverse holo", sell: 4 },
  { amt: 25, cls: "c25", name: "Legend", place: "VENICE", card: "Promo card", sell: 10 },
  { amt: 50, cls: "c50", name: "Broke", place: "SUNSET", card: "Full art", sell: 20 },
  { amt: 100, cls: "c100", name: "Legend", place: "LOS ANGELES", card: "Alt art", sell: 40 },
  { amt: 1000, cls: "c1000", name: "Crown", place: "HOLLYWOOD", card: "Grailed pull", sell: 250 }
];

function prizesFor(chip) {
  return [
    { id: "cents", name: "0.15¢ credit", value: 0.0015, chance: 98, type: "credit", kind: "common", ico: "¢" },
    { id: "five", name: "$5 credit", value: 5, chance: 1, type: "credit", kind: "mid", ico: "$" },
    { id: "card", name: chip.card, value: chip.sell, chance: 0.99, type: "item", kind: "card", ico: "🃏", sellOnly: true },
    { id: "grand", name: "$1,000 credit", value: 1000, chance: 0.01, type: "credit", kind: "jack", ico: "♛" }
  ];
}

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

function store() {
  try { return JSON.parse(localStorage.getItem("bl_case") || "{}"); } catch (e) { return {}; }
}
function saveStore(next) {
  localStorage.setItem("bl_case", JSON.stringify(next));
}
function state() {
  const s = store();
  return {
    selected: Number(s.selected || 1),
    owned: s.owned || {},
    credit: Number(s.credit || 0),
    pocket: s.pocket || [],
    spinning: false
  };
}
function patch(partial) {
  saveStore(Object.assign(store(), partial));
}

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
function totalRaised() { return donorList().reduce((s, d) => s + Number(d.amt || 0), 0); }
function paintMeter() {
  const raised = totalRaised();
  const pct = Math.max(0, Math.min(100, Math.round(raised / GOAL * 100)));
  const fill = document.getElementById("fill"), lab = document.getElementById("raised"), throne = document.getElementById("throne");
  if (lab) lab.textContent = "$" + raised + " / $" + GOAL;
  if (fill) fill.style.width = pct + "%";
  const first = donorList()[0];
  if (throne) {
    if (first) throne.innerHTML = '<div class="seat">\u265B</div><h3>' + first.name + ' holds the throne</h3><p>$' + first.amt + ' \u00b7 the board finally blinked.</p>';
    else throne.innerHTML = '<div class="seat">\u265B</div><h3>Seat 1 is empty</h3><p>First chip takes the Hollywood seat.</p>';
  }
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
    ? tips.map((d, i) => '<div class="row"><b>' + (i === 0 ? "\u265B " : "") + (i + 1) + ". " + d.name + '</b><span>$' + d.amt + "</span></div>").join("") + '<p class="note">One seat per name. Board refreshes after each buy-in.</p>'
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
  saveDonors([{ name, amt: next }].concat(list.filter(d => keyName(d.name) !== k)));
  paintBoard(); paintMeter();
}
function selectedChip() {
  const amt = state().selected;
  return CHIP_META.find(c => c.amt === amt) || CHIP_META[0];
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
  const box = document.getElementById("oddsBox");
  const prizes = prizesFor(chip);
  box.innerHTML = "<p>" + chip.name + " " + chip.place + " \u00b7 $" + (chip.amt >= 1000 ? "1,000" : chip.amt) + " chip</p>" +
    prizes.map(p => "<div><span>" + p.name + (p.sellOnly ? " \u00b7 sell only" : "") + "</span><span>" + p.chance + "%</span></div>").join("");
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
  for (const p of prizes) {
    acc += p.chance;
    if (r <= acc) return p;
  }
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
  return { reel, winIndex };
}
function addChip(amt, n) {
  const s = state();
  const owned = Object.assign({}, s.owned);
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
  const reel = built.reel, winIndex = built.winIndex;
  const wrap = document.querySelector(".reel-wrap");
  const tileW = 108 + 12;
  const centerPad = wrap.clientWidth / 2 - 54;
  const target = winIndex * tileW - centerPad;
  reel.style.transition = "none";
  reel.style.transform = "translateX(0px)";
  patch({ spinning: true });
  document.getElementById("spinBtn").disabled = true;
  document.getElementById("spinResult").textContent = "Lid\u2019s off. Don\u2019t blink.";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      reel.style.transition = "transform 4.8s cubic-bezier(0.15, 0.72, 0.08, 1)";
      reel.style.transform = "translateX(" + (-target) + "px)";
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
  try { await navigator.clipboard.writeText(shareUrl); toast("Link copied"); } catch { prompt("Copy this link", shareUrl); }
};
function rainCards() {
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const suits = ["\u2660", "\u2665", "\u2666", "\u2663"];
  const bits = []; const start = performance.now(); const H = window.innerHeight, W = window.innerWidth;
  function spawn(i) {
    const s = suits[i % 4], left = i % 2 === 0;
    const el = document.createElement("div");
    el.className = "flycard" + ((s === "\u2665" || s === "\u2666") ? " red" : "");
    el.innerHTML = "<b>" + ranks[i % 13] + "</b><i>" + s + "</i><span>" + s + "</span>";
    document.body.appendChild(el);
    const sweep = 0.35 + 0.65 * Math.abs(Math.sin((performance.now() - start) / 420));
    const ang = (22 + sweep * 58) * Math.PI / 180;
    const speed = 7.2 + Math.random() * 5.4;
    bits.push({ el: el, x: left ? 14 : W - 52, y: H - 58, vx: (left ? 1 : -1) * Math.cos(ang) * speed * (0.85 + Math.random() * 0.4), vy: -Math.sin(ang) * speed * (1.05 + Math.random() * 0.35), g: 0.16 + Math.random() * 0.08, rot: Math.random() * 40 - 20, spin: (left ? 1 : -1) * (2.4 + Math.random() * 4.2), flip: Math.random() * 180, flipV: 8 + Math.random() * 14, life: 0, max: 2600 + Math.random() * 1400 });
  }
  let n = 0; const emitter = setInterval(() => { spawn(n++); spawn(n++); if (n >= 80) clearInterval(emitter); }, 42);
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(32, now - last) / 16.67; last = now;
    for (let i = bits.length - 1; i >= 0; i--) {
      const c = bits[i];
      c.vy += c.g * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.spin * dt; c.flip += c.flipV * dt; c.life += 16.67 * dt;
      const fade = c.life > c.max - 500 ? Math.max(0, 1 - (c.life - (c.max - 500)) / 500) : 1;
      c.el.style.transform = "translate(" + c.x + "px," + c.y + "px) rotate(" + c.rot + "deg) rotateY(" + c.flip + "deg)";
      c.el.style.opacity = String(fade);
      if (c.life > c.max || c.y > H + 80) { c.el.remove(); bits.splice(i, 1); }
    }
    if (bits.length || n < 80) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  toast("Chip\u2019s on the felt.");
}
(function injectExtraCss() {
  const css = ".palms{position:fixed;inset:0;pointer-events:none;z-index:0;background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320'%3E%3Cpath fill='%23080808' d='M98 320v-150c-28-8-52-4-78 18 22-28 48-40 78-36-30-18-48-42-52-78 18 24 40 40 52 44-8-32 2-62 28-92-4 32 2 58 16 72 8-30 28-54 62-70-22 28-28 54-20 74 22-6 46-4 72 14-26-4-50 6-68 24 24 2 48 16 66 42-24-14-50-18-72-10v148z'/%3E%3C/svg%3E\") no-repeat -30px bottom,url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320'%3E%3Cpath fill='%23080808' d='M98 320v-150c-28-8-52-4-78 18 22-28 48-40 78-36-30-18-48-42-52-78 18 24 40 40 52 44-8-32 2-62 28-92-4 32 2 58 16 72 8-30 28-54 62-70-22 28-28 54-20 74 22-6 46-4 72 14-26-4-50 6-68 24 24 2 48 16 66 42-24-14-50-18-72-10v148z'/%3E%3C/svg%3E\") no-repeat right -50px bottom;background-size:300px auto,360px auto;opacity:.75}.flycard{position:fixed;left:0;top:0;width:40px;height:56px;background:linear-gradient(165deg,#fffdf8 0%,#f4ead4 100%);border-radius:6px;z-index:80;pointer-events:none;font:700 12px/1 DM Sans,sans-serif;color:#1a1a1a;padding:5px;box-shadow:0 10px 16px rgba(0,0,0,.3);display:flex;flex-direction:column;justify-content:space-between;will-change:transform,opacity}.flycard i{font-style:normal;font-size:18px;text-align:center}.flycard.red{color:#b4232c}";
  const s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);
  if (!document.querySelector(".palms")) {
    const d = document.createElement("div");
    d.className = "palms";
    document.body.appendChild(d);
  }
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
