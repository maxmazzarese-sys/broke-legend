const donate=document.getElementById("donate"), board=document.getElementById("leaderboard");
const tabs=document.querySelectorAll("[data-tab]");
const shareUrl=location.origin.includes("localhost")?"https://brokenlegend.com":location.origin;
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
  const ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const suits=["\u2660","\u2665","\u2666","\u2663"];
  const bits=[];
  const start=performance.now();
  const H=window.innerHeight, W=window.innerWidth;
  function spawn(i){
    const s=suits[i%4], left=i%2===0;
    const el=document.createElement("div");
    el.className="flycard"+((s==="\u2665"||s==="\u2666")?" red":"");
    el.innerHTML="<b>"+ranks[i%13]+"</b><i>"+s+"</i><span>"+s+"</span>";
    document.body.appendChild(el);
    const sweep=0.35+0.65*Math.abs(Math.sin((performance.now()-start)/420));
    const ang=(22+sweep*58)*Math.PI/180;
    const speed=7.2+Math.random()*5.4;
    bits.push({el,x:left?14:W-52,y:H-58,vx:(left?1:-1)*Math.cos(ang)*speed*(0.85+Math.random()*0.4),vy:-Math.sin(ang)*speed*(1.05+Math.random()*0.35),g:0.16+Math.random()*0.08,rot:Math.random()*40-20,spin:(left?1:-1)*(2.4+Math.random()*4.2),flip:Math.random()*180,flipV:8+Math.random()*14,life:0,max:2600+Math.random()*1400});
  }
  let n=0;
  const emitter=setInterval(()=>{spawn(n++);spawn(n++);if(n>=80)clearInterval(emitter);},42);
  let last=performance.now();
  function tick(now){const dt=Math.min(32,now-last)/16.67;last=now;for(let i=bits.length-1;i>=0;i--){const c=bits[i];c.vy+=c.g*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.rot+=c.spin*dt;c.flip+=c.flipV*dt;c.life+=16.67*dt;const fade=c.life>c.max-500?Math.max(0,1-(c.life-(c.max-500))/500):1;c.el.style.transform="translate("+c.x+"px,"+c.y+"px) rotate("+c.rot+"deg) rotateY("+c.flip+"deg)";c.el.style.opacity=String(fade);if(c.life>c.max||c.y>H+80){c.el.remove();bits.splice(i,1);}}if(bits.length||n<80)requestAnimationFrame(tick);}requestAnimationFrame(tick);
  toast("Legend tipped. Cards on the felt.");
}
const startTab=(location.hash||"#donate").replace("#","");
show(startTab==="leaderboard"?"leaderboard":"donate");
loadPublicBoard().then(()=>{paintBoard();paintMeter();});
paintMeter();
if(/[?&]tipped=1/.test(location.search)){show("donate");setTimeout(rainCards,200);history.replaceState({}, "", location.pathname+location.hash);}
(function(){
  const css=".palms{position:fixed;inset:0;pointer-events:none;z-index:0;background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320'%3E%3Cpath fill='%23080808' d='M98 320v-150c-28-8-52-4-78 18 22-28 48-40 78-36-30-18-48-42-52-78 18 24 40 40 52 44-8-32 2-62 28-92-4 32 2 58 16 72 8-30 28-54 62-70-22 28-28 54-20 74 22-6 46-4 72 14-26-4-50 6-68 24 24 2 48 16 66 42-24-14-50-18-72-10v148z'/%3E%3C/svg%3E\") no-repeat -30px bottom,url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320'%3E%3Cpath fill='%23080808' d='M98 320v-150c-28-8-52-4-78 18 22-28 48-40 78-36-30-18-48-42-52-78 18 24 40 40 52 44-8-32 2-62 28-92-4 32 2 58 16 72 8-30 28-54 62-70-22 28-28 54-20 74 22-6 46-4 72 14-26-4-50 6-68 24 24 2 48 16 66 42-24-14-50-18-72-10v148z'/%3E%3C/svg%3E\") no-repeat right -50px bottom;background-size:300px auto,360px auto;opacity:.75}.flycard{position:fixed;left:0;top:0;width:40px;height:56px;background:linear-gradient(165deg,#fffdf8 0%,#f4ead4 100%);border-radius:6px;z-index:80;pointer-events:none;font:700 12px/1 DM Sans,sans-serif;color:#1a1a1a;padding:5px;box-shadow:0 10px 16px rgba(0,0,0,.3);display:flex;flex-direction:column;justify-content:space-between;will-change:transform,opacity}.flycard i{font-style:normal;font-size:18px;text-align:center}.flycard.red{color:#b4232c}";
  const s=document.createElement("style");s.textContent=css;document.head.appendChild(s);
  if(!document.querySelector(".palms")){const d=document.createElement("div");d.className="palms";document.body.appendChild(d);}
  const byClass={c1:"https://whop.com/checkout/ch_T195O0GEqmnu5BD/",c5:"https://whop.com/checkout/ch_RgTbYfHeBAf88dx/",c10:"https://whop.com/checkout/ch_jIEu4Od8B4pk5eS/",c25:"https://whop.com/checkout/ch_l4z4HQw4qwHtXYp/",c50:"https://whop.com/checkout/ch_FDoizbDnifrbUDR/",c100:"https://whop.com/checkout/ch_l1lUoVayDGnGSRM/",c1000:"https://whop.com/checkout/ch_OkjMRrPtoXwsDMR/"};
  document.querySelectorAll("a.chip").forEach(a=>{Object.keys(byClass).forEach(k=>{if(a.classList.contains(k))a.href=byClass[k];});});
})();
