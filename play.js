const donate=document.getElementById("donate"), play=document.getElementById("play"), board=document.getElementById("leaderboard");
const tabs=document.querySelectorAll("[data-tab]");
const shareUrl=location.origin.includes("localhost")?"https://broke-legend.vercel.app":location.origin;
const KEY="bl_play", BEST="bl_best", STREAK="bl_streak", NAME="bl_name", PLAYERS="bl_players";
const START=250;
const ROASTS=["Legend down.","Felt took it.","House needed that more.","Blackjack still will not pay rent."];
const WINS=["Table blinked.","The legend lives.","Dealer folded the vibe.","Chips stay pretend. Pride is real."];
function show(tab){[donate,play,board].forEach(el=>el&&el.classList.remove("show"));({donate,play,leaderboard:board}[tab]||donate).classList.add("show");tabs.forEach(el=>el.classList.toggle("active",el.dataset.tab===tab));if(tab==="leaderboard")paintBoard();}
tabs.forEach(el=>el.addEventListener("click",e=>{e.preventDefault();show(el.dataset.tab);history.replaceState(null,"","#"+el.dataset.tab);}));
function toast(t){const el=document.getElementById("toast");if(!el)return;el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800);}
function bank(){const n=Number(localStorage.getItem(KEY));return Number.isFinite(n)?Math.max(0,n):START;}
function setBank(n){n=Math.max(0,Math.round(n));localStorage.setItem(KEY,String(n));const best=Math.max(n,Number(localStorage.getItem(BEST)||0));localStorage.setItem(BEST,String(best));const st=document.getElementById("stack");if(st)st.textContent=n+" chips";const be=document.getElementById("best");if(be)be.textContent=best;document.querySelectorAll("[data-stack]").forEach(el=>el.textContent=n+" chips");paintBoard();}
function streak(){return Math.max(0,Number(localStorage.getItem(STREAK)||0));}
function setStreak(n){localStorage.setItem(STREAK,String(Math.max(0,n)));const h=document.getElementById("hot");if(h)h.textContent=streak();}
const S=["\u2660","\u2665","\u2666","\u2663"], R=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let shoe=[], player=[], dealer=[], bet=10, inHand=false, hide=true, dealing=false;
function shoeNew(){shoe=[];for(let d=0;d<6;d++)for(const s of S)for(const r of R)shoe.push({r,s});for(let i=shoe.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shoe[i],shoe[j]]=[shoe[j],shoe[i]];}}
function draw(){if(shoe.length<20)shoeNew();return shoe.pop();}
function val(h){let t=0,a=0;for(const c of h){if(c.r==="A"){a++;t+=11;}else t+=("JQK".includes(c.r)?10:Number(c.r));}while(t>21&&a){t-=10;a--;}return t;}
function isBJ(h){return h.length===2&&val(h)===21;}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function cardEl(c,back,motion){const el=document.createElement("div");el.className="card"+(back?" back":("\u2665\u2666".includes(c.s)?" red":""))+(motion?" "+motion:"");if(!back)el.innerHTML="<span>"+c.r+"</span><span>"+c.s+"</span>";return el;}
function totals(){const pt=document.getElementById("playerTotal"),dt=document.getElementById("dealerTotal"),bl=document.getElementById("betLabel");if(pt)pt.textContent=player.length?"\u00b7 "+val(player):"";if(dt)dt.textContent=dealer.length?(hide?"\u00b7 ?":"\u00b7 "+val(dealer)):"";if(bl)bl.textContent=bet;}
function clearHands(){const d=document.getElementById("dealerCards"),p=document.getElementById("playerCards");if(d)d.innerHTML="";if(p)p.innerHTML="";}
function seat(who,back,motion){const hand=who==="p"?player:dealer;const box=document.getElementById(who==="p"?"playerCards":"dealerCards");if(box)box.appendChild(cardEl(hand[hand.length-1],back,motion||"deal"));totals();}
function render(){clearHands();const db=document.getElementById("dealerCards"),pb=document.getElementById("playerCards");if(db)dealer.forEach((c,i)=>db.appendChild(cardEl(c,hide&&i===1)));if(pb)player.forEach(c=>pb.appendChild(cardEl(c,false)));totals();}
function phase(p){inHand=p;const pre=document.getElementById("preActions"),act=document.getElementById("playActions");if(pre)pre.style.display=p?"none":"flex";if(act)act.style.display=p?"flex":"none";}
function say(t){const m=document.getElementById("msg");if(m)m.textContent=t;}
function lock(on){dealing=on;["dealBtn","hitBtn","standBtn","doubleBtn"].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=on;});}
async function start(){if(dealing)return;if(bet<1)bet=10;if(bank()<bet){say("Need chips. Hit free refill.");return;}setBank(bank()-bet);player=[];dealer=[];hide=true;clearHands();totals();phase(true);lock(true);say("Dealing...");player.push(draw());seat("p");await sleep(170);dealer.push(draw());seat("d");await sleep(170);player.push(draw());seat("p");await sleep(170);dealer.push(draw());seat("d",true);totals();lock(false);if(isBJ(player)||isBJ(dealer))finish();else say("Hit, stand, or double.");}
async function dealerDraw(){const kids=document.getElementById("dealerCards");hide=false;const hole=kids&&kids.children[1];if(hole){hole.replaceWith(cardEl(dealer[1],false,"flip"));totals();await sleep(220);}while(val(dealer)<17){dealer.push(draw());seat("d");await sleep(220);}}
async function finish(){const p=val(player);if(p>21){hide=false;setStreak(0);say(ROASTS[Math.floor(Math.random()*ROASTS.length)]+" -"+bet);phase(false);totals();lock(false);return;}lock(true);await dealerDraw();const d=val(dealer);let pay=0,text="";if(isBJ(player)&&!isBJ(dealer)){pay=bet+Math.floor(bet*1.5);text="Blackjack. +"+Math.floor(bet*1.5);}else if(d>21||p>d){pay=bet*2;text=WINS[Math.floor(Math.random()*WINS.length)]+" +"+bet;}else if(p===d){pay=bet;text="Push. Chips back.";}else text=ROASTS[Math.floor(Math.random()*ROASTS.length)];if(pay>bet)setStreak(streak()+1);else if(pay===0)setStreak(0);if(pay)setBank(bank()+pay);say(text+(streak()>1?"  Hot x"+streak():""));phase(false);totals();lock(false);}
function keyName(s){return String(s||"").trim().toLowerCase();}
function uniq(list){const map={};(list||[]).forEach(p=>{const k=keyName(p.name);if(!k)return;const amt=Number(p.amt||0);if(!map[k]||amt>map[k].amt)map[k]={name:p.name,amt:Math.max(amt,map[k]&&map[k].amt||0)};});return Object.values(map);}
function donorList(){let list=[];try{list=JSON.parse(localStorage.getItem("bl_public_donors")||"[]");}catch(e){list=[];}return uniq(list).sort((a,b)=>b.amt-a.amt).slice(0,20);}
async function loadPublicBoard(){try{const res=await fetch("board.json?t="+Date.now(),{cache:"no-store"});if(!res.ok)return;const data=await res.json();if(Array.isArray(data.donors))localStorage.setItem("bl_public_donors",JSON.stringify(uniq(data.donors)));}catch(e){}}
function paintBoard(){const donors=document.getElementById("boardDonors");if(!donors)return;const tips=donorList();donors.innerHTML=tips.length?tips.map((d,i)=>'<div class="row"><b>'+(i+1)+". "+d.name+"</b><span>$"+d.amt+"</span></div>").join("")+'<p class="note">Public tip board. One seat per name.</p>':'<div class="empty">No donators yet. First chip takes the top seat.</div>';}
document.querySelectorAll("[data-game]").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll("[data-game]").forEach(b=>b.classList.toggle("on",b===btn));
  document.querySelectorAll(".gamebox").forEach(g=>g.classList.toggle("on",g.id===btn.dataset.game));
  if(btn.dataset.game!=="crossy"&&typeof stopCrossy==="function")stopCrossy();
});
const betDown=document.getElementById("betDown"), betUp=document.getElementById("betUp");
if(betDown)betDown.onclick=()=>{if(inHand||dealing)return;bet=Math.max(1,bet-5);totals();};
if(betUp)betUp.onclick=()=>{if(inHand||dealing)return;bet=Math.min(Math.max(1,bank()),bet+5);totals();};
const dealBtn=document.getElementById("dealBtn");if(dealBtn)dealBtn.onclick=start;
const hitBtn=document.getElementById("hitBtn");if(hitBtn)hitBtn.onclick=async()=>{if(!inHand||dealing)return;player.push(draw());seat("p");if(val(player)>=21)await finish();};
const standBtn=document.getElementById("standBtn");if(standBtn)standBtn.onclick=()=>{if(inHand&&!dealing)finish();};
const doubleBtn=document.getElementById("doubleBtn");if(doubleBtn)doubleBtn.onclick=async()=>{if(!inHand||dealing||player.length!==2)return toast("Double on first two cards only");if(bank()<bet)return toast("Not enough chips");setBank(bank()-bet);bet*=2;totals();player.push(draw());seat("p");await finish();};
const refill=document.getElementById("refill");if(refill)refill.onclick=()=>{setBank(START);setStreak(0);toast("Fresh 250 play chips");say("New stack. Still fake money.");};
const toDonate=document.getElementById("toDonate");if(toDonate)toDonate.onclick=()=>show("donate");
const shareBtn=document.getElementById("shareBtn");if(shareBtn)shareBtn.onclick=async()=>{const data={title:"Broke Legend",text:"Donate to a broke legend.",url:shareUrl};try{if(navigator.share){await navigator.share(data);return;}}catch(e){if(e&&e.name==="AbortError")return;}try{await navigator.clipboard.writeText(shareUrl);toast("Link copied");}catch{prompt("Copy this link",shareUrl);}};
if(!localStorage.getItem(KEY))localStorage.setItem(KEY,String(START));
shoeNew();setBank(bank());setStreak(streak());render();say("Set a bet and deal.");
const startTab=(location.hash||"#donate").replace("#","");
show(["donate","play","leaderboard"].includes(startTab)?startTab:"donate");
loadPublicBoard().then(paintBoard);
