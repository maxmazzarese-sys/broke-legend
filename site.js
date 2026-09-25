const donate=document.getElementById("donate"), board=document.getElementById("leaderboard");
const tabs=document.querySelectorAll("[data-tab]");
const shareUrl=location.origin.includes("localhost")?"https://broke-legend.vercel.app":location.origin;
const GOAL=250;
function toast(t){const el=document.getElementById("toast");if(!el)return;el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800);}
function show(tab){[donate,board].forEach(el=>el&&el.classList.remove("show"));(tab==="leaderboard"?board:donate).classList.add("show");tabs.forEach(el=>el.classList.toggle("active",el.dataset.tab===tab));if(tab==="leaderboard")paintBoard();}
tabs.forEach(el=>el.addEventListener("click",e=>{e.preventDefault();show(el.dataset.tab);history.replaceState(null,"","#"+el.dataset.tab);}));
function keyName(s){return String(s||"").trim().toLowerCase();}
function uniq(list){const map={};(list||[]).forEach(p=>{const k=keyName(p.name);if(!k)return;const amt=Number(p.amt||0);if(!map[k]||amt>map[k].amt)map[k]={name:p.name,amt};});return Object.values(map);}
function donorList(){let list=[];try{list=JSON.parse(localStorage.getItem("bl_public_donors")||"[]");}catch(e){list=[];}return uniq(list).sort((a,b)=>b.amt-a.amt).slice(0,20);}
function totalRaised(){return donorList().reduce((s,d)=>s+Number(d.amt||0),0);}
function paintMeter(){const raised=totalRaised();const pct=Math.max(0,Math.min(100,Math.round(raised/GOAL*100)));const fill=document.getElementById("fill"), lab=document.getElementById("raised"), throne=document.getElementById("throne");if(lab)lab.textContent="$"+raised+" / $"+GOAL;if(fill)fill.style.width=pct+"%";const first=donorList()[0];if(throne){if(first){throne.innerHTML='<div class="seat">\u265B</div><h3>'+first.name+' holds the throne</h3><p>$'+first.amt+' \u00b7 the board finally blinked.</p>';}else{throne.innerHTML='<div class="seat">\u265B</div><h3>Seat 1 is empty</h3><p>Whoever tips first becomes the original whale.</p>';}}}
async function loadPublicBoard(){try{const res=await fetch("board.json?t="+Date.now(),{cache:"no-store"});if(!res.ok)return;const data=await res.json();if(Array.isArray(data.donors))localStorage.setItem("bl_public_donors",JSON.stringify(uniq(data.donors)));}catch(e){}}
function paintBoard(){const donors=document.getElementById("boardDonors");if(!donors)return;const tips=donorList();donors.innerHTML=tips.length?tips.map((d,i)=>'<div class="row"><b>'+(i===0?"\u265B ":"")+(i+1)+". "+d.name+'</b><span>$'+d.amt+"</span></div>").join("")+'<p class="note">One seat per name.</p>':'<div class="empty">Nobody yet. The crown is still on the table.</div>';paintMeter();}
const shareBtn=document.getElementById("shareBtn");
if(shareBtn)shareBtn.onclick=async()=>{const data={title:"Broke Legend",text:"Bankroll critical. First chip takes the throne.",url:shareUrl};try{if(navigator.share){await navigator.share(data);return;}}catch(e){if(e&&e.name==="AbortError")return;}try{await navigator.clipboard.writeText(shareUrl);toast("Link copied");}catch{prompt("Copy this link",shareUrl);}};
const startTab=(location.hash||"#donate").replace("#","");
show(startTab==="leaderboard"?"leaderboard":"donate");
loadPublicBoard().then(()=>{paintBoard();paintMeter();});
paintMeter();
