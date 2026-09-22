const KEY="bl_play", BEST="bl_best", START=250;
const donate=document.getElementById("donate"), play=document.getElementById("play"), board=document.getElementById("leaderboard");
const tabs=document.querySelectorAll("[data-tab]");
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1600);}
function bank(){const n=Number(localStorage.getItem(KEY));return Number.isFinite(n)?Math.max(0,n):START;}
function setBank(n){n=Math.max(0,Math.round(n));localStorage.setItem(KEY,String(n));const best=Math.max(n,Number(localStorage.getItem(BEST)||0));localStorage.setItem(BEST,String(best));document.querySelectorAll("[data-stack]").forEach(el=>el.textContent=n+" chips");const bl=document.getElementById("betLabel");if(bl)bl.textContent=window.stake||10;}
function show(tab){[donate,play,board].forEach(el=>el.classList.remove("show"));({donate,play,leaderboard:board}[tab]||donate).classList.add("show");document.querySelectorAll(".side .nav").forEach(el=>el.classList.toggle("on",el.dataset.tab===tab));if(tab==="leaderboard")paintBoard();if(tab==="play")showLobby();}
tabs.forEach(el=>el.addEventListener("click",e=>{e.preventDefault();show(el.dataset.tab);history.replaceState(null,"","#"+el.dataset.tab);}));
window.stake=10;
function takeBet(){const s=Math.min(Math.max(1,window.stake||10),bank());if(bank()<s){toast("Need chips");return 0;}setBank(bank()-s);return s;}
function pay(n){setBank(bank()+Math.max(0,Math.round(n)));}
const GAMES=[{id:"dice",name:"DICE",cls:"g-dice"},{id:"mines",name:"MINES",cls:"g-mines"},{id:"keno",name:"KENO",cls:"g-keno"},{id:"limbo",name:"LIMBO",cls:"g-limbo"},{id:"plinko",name:"PLINKO",cls:"g-plinko"},{id:"crash",name:"CRASH",cls:"g-crash"},{id:"wheel",name:"WHEEL",cls:"g-wheel"},{id:"coin",name:"COINFLIP",cls:"g-coin"},{id:"bj",name:"BLACKJACK",cls:"g-bj"},{id:"roulette",name:"ROULETTE",cls:"g-roulette"},{id:"poker",name:"HOLD EM",cls:"g-poker"}];
function paintGrid(q=""){const box=document.getElementById("gameGrid");const list=GAMES.filter(g=>g.name.toLowerCase().includes(q.toLowerCase()));box.innerHTML=list.map(g=>'<button class="game '+g.cls+'" data-open="'+g.id+'"><i>PLAY</i><span>'+g.name+'</span></button>').join("");box.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openGame(b.dataset.open));}
function showLobby(){document.getElementById("lobbyView").hidden=false;document.getElementById("gameView").hidden=true;}
function openGame(id){document.getElementById("lobbyView").hidden=true;document.getElementById("gameView").hidden=false;if(window.mountGame)window.mountGame(id);}
document.getElementById("backLobby").onclick=showLobby;
document.getElementById("gameSearch").oninput=e=>paintGrid(e.target.value);
document.getElementById("refill").onclick=()=>{setBank(START);toast("Fresh 250 play chips");};
document.getElementById("shareBtn").onclick=async()=>{const url=location.origin;try{await navigator.clipboard.writeText(url);toast("Link copied");}catch{prompt("Copy",url);}};
function keyName(s){return String(s||"").trim().toLowerCase();}
function uniq(list){const map={};(list||[]).forEach(p=>{const k=keyName(p.name);if(!k)return;const amt=Number(p.amt||0);if(!map[k]||amt>map[k].amt)map[k]={name:p.name,amt:Math.max(amt,map[k]&&map[k].amt||0)};});return Object.values(map);}
function donorList(){let list=[];try{list=JSON.parse(localStorage.getItem("bl_public_donors")||"[]");}catch(e){list=[];}return uniq(list).sort((a,b)=>b.amt-a.amt).slice(0,20);}
async function loadPublicBoard(){try{const res=await fetch("board.json?t="+Date.now(),{cache:"no-store"});if(!res.ok)return;const data=await res.json();if(Array.isArray(data.donors))localStorage.setItem("bl_public_donors",JSON.stringify(uniq(data.donors)));}catch(e){}}
function paintBoard(){const donors=document.getElementById("boardDonors");if(!donors)return;const tips=donorList();donors.innerHTML=tips.length?tips.map((d,i)=>'<div class="row"><b>'+(i+1)+". "+d.name+"</b><span>$"+d.amt+"</span></div>").join("")+'<p class="note">Public tip board. One seat per name.</p>':'<div class="empty">No donators yet.</div>';}
if(!localStorage.getItem(KEY))localStorage.setItem(KEY,String(START));
setBank(bank());
paintGrid();
loadPublicBoard().then(paintBoard);
const startTab=(location.hash||"#play").replace("#","");
show(["donate","play","leaderboard"].includes(startTab)?startTab:"play");
