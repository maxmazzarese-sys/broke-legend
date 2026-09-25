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
function paintMeter(){const raised=totalRaised();const pct=Math.max(0,Math.min(100,Math.round(raised/GOAL*100)));const fill=document.getElementById("fill"), lab=document.getElementById("raised"), throne=document.getElementById("throne");if(lab)lab.textContent="$"+raised+" / $"+GOAL;if(fill)fill.style.width=pct+"%";const first=donorList()[0];if(throne){if(first)throne.innerHTML='<div class="seat">\u265B</div><h3>'+first.name+' holds the throne</h3><p>$'+first.amt+' \u00b7 the board finally blinked.</p>';else throne.innerHTML='<div class="seat">\u265B</div><h3>Seat 1 is empty</h3><p>First tip takes the Hollywood seat.</p>';}}
async function loadPublicBoard(){try{const res=await fetch("board.json?t="+Date.now(),{cache:"no-store"});if(!res.ok)return;const data=await res.json();if(Array.isArray(data.donors))localStorage.setItem("bl_public_donors",JSON.stringify(uniq(data.donors)));}catch(e){}}
function paintBoard(){const donors=document.getElementById("boardDonors");if(!donors)return;const tips=donorList();donors.innerHTML=tips.length?tips.map((d,i)=>'<div class="row"><b>'+(i===0?"\u265B ":"")+(i+1)+". "+d.name+'</b><span>$'+d.amt+"</span></div>").join("")+'<p class="note">One seat per name.</p>':'<div class="empty">Nobody yet. The crown is still on the table.</div>';paintMeter();}
const shareBtn=document.getElementById("shareBtn");
if(shareBtn)shareBtn.onclick=async()=>{const data={title:"Broke Legend",text:"Sunset chips in Los Angeles.",url:shareUrl};try{if(navigator.share){await navigator.share(data);return;}}catch(e){if(e&&e.name==="AbortError")return;}try{await navigator.clipboard.writeText(shareUrl);toast("Link copied");}catch{prompt("Copy this link",shareUrl);}};
function rainCards(){
  const ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"], suits=["\u2660","\u2665","\u2666","\u2663"];
  const W=Math.min(window.innerWidth,900), H=window.innerHeight;
  for(let i=0;i<72;i++){
    const el=document.createElement("div");
    const s=suits[i%4];
    const left=i%2===0;
    el.className="flycard "+(left?"from-left":"from-right")+((s==="\u2665"||s==="\u2666")?" red":"");
    el.innerHTML="<b>"+ranks[i%13]+"</b><i>"+s+"</i><span>"+s+"</span>";
    const ang=(28+Math.random()*54)*Math.PI/180;
    const power=0.55+Math.random()*0.7;
    const reach=(left?1:-1)*W*power*Math.cos(ang);
    const peak=-(H*(0.42+Math.random()*0.38)*Math.sin(ang));
    const land=peak*0.15+40+Math.random()*80;
    el.style.setProperty("--dx",reach+"px");
    el.style.setProperty("--peak",peak+"px");
    el.style.setProperty("--land",land+"px");
    el.style.setProperty("--rot1",(left?1:-1)*(80+Math.random()*140)+"deg");
    el.style.setProperty("--rot",(left?1:-1)*(200+Math.random()*280)+"deg");
    el.style.animationDuration=(2.6+Math.random()*1.6)+"s";
    el.style.animationDelay=(Math.random()*1.35)+"s";
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),4600);
  }
  toast("Legend tipped. Cards on the felt.");
}
const startTab=(location.hash||"#donate").replace("#","");
show(startTab==="leaderboard"?"leaderboard":"donate");
loadPublicBoard().then(()=>{paintBoard();paintMeter();});
paintMeter();
if(/[?&]tipped=1/.test(location.search)){show("donate");setTimeout(rainCards,200);history.replaceState({}, "", location.pathname+location.hash);}
(function(){
  const css=".palms{position:fixed;inset:0;pointer-events:none;z-index:0;background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320'%3E%3Cpath fill='%23080808' d='M98 320v-150c-28-8-52-4-78 18 22-28 48-40 78-36-30-18-48-42-52-78 18 24 40 40 52 44-8-32 2-62 28-92-4 32 2 58 16 72 8-30 28-54 62-70-22 28-28 54-20 74 22-6 46-4 72 14-26-4-50 6-68 24 24 2 48 16 66 42-24-14-50-18-72-10v148z'/%3E%3C/svg%3E\") no-repeat -30px bottom,url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320'%3E%3Cpath fill='%23080808' d='M98 320v-150c-28-8-52-4-78 18 22-28 48-40 78-36-30-18-48-42-52-78 18 24 40 40 52 44-8-32 2-62 28-92-4 32 2 58 16 72 8-30 28-54 62-70-22 28-28 54-20 74 22-6 46-4 72 14-26-4-50 6-68 24 24 2 48 16 66 42-24-14-50-18-72-10v148z'/%3E%3C/svg%3E\") no-repeat right -50px bottom;background-size:300px auto,360px auto;opacity:.75}.flycard{position:fixed;bottom:4px;width:38px;height:54px;background:linear-gradient(180deg,#fffdf6,#f0e6d0);border-radius:5px;z-index:80;pointer-events:none;animation:spray 3.2s cubic-bezier(.12,.62,.28,1) forwards;font:700 11px/1 DM Sans,sans-serif;color:#1a1a1a;padding:4px 5px;box-shadow:0 8px 14px rgba(0,0,0,.28);display:flex;flex-direction:column;justify-content:space-between}.flycard i{font-style:normal;font-size:16px;text-align:center}.flycard.from-left{left:8px}.flycard.from-right{right:8px}.flycard.red{color:#b4232c}@keyframes spray{0%{transform:translate(0,0) rotate(0);opacity:1}45%{transform:translate(var(--dx),var(--peak)) rotate(var(--rot1));opacity:1}100%{transform:translate(calc(var(--dx)*1.25),var(--land)) rotate(var(--rot));opacity:0}}";
  const s=document.createElement("style");s.textContent=css;document.head.appendChild(s);
  if(!document.querySelector(".palms")){const d=document.createElement("div");d.className="palms";document.body.appendChild(d);}
  const map={"plan_VjSDuJt6qVAyN":"https://whop.com/checkout/ch_HnJwcskysXIc8WS/","plan_5QH6LReRBe40b":"https://whop.com/checkout/ch_t3bymfkB6UfR1cf/","plan_m6Xf1YtxPXhsF":"https://whop.com/checkout/ch_4hZBlhD2t15o9mT/","plan_VfC4056DZfXNB":"https://whop.com/checkout/ch_Dt2tZuevFpcwbfh/","plan_jsRI92G8xy2VR":"https://whop.com/checkout/ch_Hvixg3uxuyhz0oc/","plan_WFMehrw9zXnEz":"https://whop.com/checkout/ch_x54Gi5OmFWt4WoT/","plan_S5gy5AYJbMQS5":"https://whop.com/checkout/ch_uHUFwE5Qa5638n8/"};
  document.querySelectorAll("a.chip").forEach(a=>{const href=a.getAttribute("href")||"";Object.keys(map).forEach(k=>{if(href.indexOf(k)>=0)a.href=map[k];});});
})();
