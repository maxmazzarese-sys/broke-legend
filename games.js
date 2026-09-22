function paintStacks(){const n=bank();document.querySelectorAll("[data-stack]").forEach(el=>el.textContent=n+" chips");}
const _setBank=setBank;setBank=function(n){_setBank(n);paintStacks();};
document.querySelectorAll("[data-game]").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll("[data-game]").forEach(b=>b.classList.toggle("on",b===btn));
  document.querySelectorAll(".gamebox").forEach(g=>g.classList.toggle("on",g.id===btn.dataset.game));
  if(btn.dataset.game!=="crossy")stopCrossy();
});
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const WHEEL=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
function rColor(n){return n===0?"green":(RED.has(n)?"red":"black");}
const face=document.getElementById("wheelFace");
if(face&&!face.childElementCount){WHEEL.forEach((n,i)=>{const d=document.createElement("div");d.className="pocket "+rColor(n);d.style.transform="rotate("+((i+0.5)*(360/37))+"deg)";d.textContent=n;face.appendChild(d);});}
const CHIPS=[1,5,10,25,100], CHIPHEX=["#f6f1e4","#c23b3b","#3b6ec2","#2f7a3a","#1a1a1a"];
let rChip=5, rBets={}, rBusy=false;
const chipBar=document.getElementById("rChips");
if(chipBar&&!chipBar.childElementCount){CHIPS.forEach((v,i)=>{const b=document.createElement("button");b.type="button";b.textContent=v;b.style.background=CHIPHEX[i];if(v===100)b.style.color="#f6f1e4";if(v===5)b.classList.add("on");b.onclick=()=>{rChip=v;[...chipBar.children].forEach(x=>x.classList.toggle("on",x===b));};chipBar.appendChild(b);});}
const table=document.getElementById("rTable");
function rTotal(){return Object.values(rBets).reduce((a,b)=>a+b,0);}
function paintBets(){document.getElementById("rOn").textContent=rTotal();table.querySelectorAll(".rcell").forEach(cell=>{const k=cell.dataset.bet;let m=cell.querySelector(".marker");if(rBets[k]){if(!m){m=document.createElement("span");m.className="marker";cell.appendChild(m);}m.textContent=rBets[k];}else if(m)m.remove();});}
function drop(k){if(rBusy)return;if(bank()<rChip)return toast("Not enough chips");setBank(bank()-rChip);rBets[k]=(rBets[k]||0)+rChip;paintBets();document.getElementById("rMsg").textContent="On the felt: "+rTotal();}
if(table&&!table.childElementCount){
  const z=document.createElement("button");z.className="rcell green rzero";z.dataset.bet="n0";z.textContent="0";z.onclick=()=>drop("n0");table.appendChild(z);
  for(let col=0;col<12;col++)for(let row=0;row<3;row++){
    const n=col*3+(3-row);
    const b=document.createElement("button");b.className="rcell "+rColor(n);b.dataset.bet="n"+n;b.textContent=n;b.style.gridColumn=String(col+2);b.style.gridRow=String(row+1);b.onclick=()=>drop("n"+n);table.appendChild(b);
  }
  const red=document.createElement("button");red.className="rcell red out rout";red.dataset.bet="red";red.textContent="Red 2x";red.onclick=()=>drop("red");table.appendChild(red);
  const blk=document.createElement("button");blk.className="rcell black out rout2";blk.dataset.bet="black";blk.textContent="Black 2x";blk.onclick=()=>drop("black");table.appendChild(blk);
}
document.getElementById("rClear").onclick=()=>{if(rBusy)return;const back=rTotal();if(!back)return;setBank(bank()+back);rBets={};paintBets();document.getElementById("rMsg").textContent="Bets pulled.";};
document.getElementById("rSpin").onclick=()=>{
  if(rBusy)return;if(!rTotal())return toast("Put a chip on the table");
  rBusy=true;
  const hit=WHEEL[Math.floor(Math.random()*WHEEL.length)], idx=WHEEL.indexOf(hit);
  const wheel=document.getElementById("wheelSpin"), ball=document.getElementById("ballTrack");
  wheel.style.transition="none";ball.style.transition="none";
  wheel.style.transform="rotate(0deg)";ball.style.transform="rotate(0deg)";void wheel.offsetWidth;
  wheel.style.transition="transform 3.4s cubic-bezier(.12,.7,0,1)";
  ball.style.transition="transform 3.4s cubic-bezier(.05,.2,.15,1)";
  wheel.style.transform="rotate("+(1080+(360-idx*(360/37)))+"deg)";
  ball.style.transform="rotate(-1440deg)";
  document.getElementById("rMsg").textContent="Ball's out.";
  setTimeout(()=>{
    const color=rColor(hit);let pay=0;
    Object.entries(rBets).forEach(([k,amt])=>{if(k==="n"+hit)pay+=amt*36;else if(k===color&&color!=="green")pay+=amt*2;});
    if(pay)setBank(bank()+pay);
    document.getElementById("rMsg").textContent=hit+" "+color+(pay?"  +"+pay:"  lost "+rTotal());
    rBets={};paintBets();rBusy=false;
  },3450);
};
const PR=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
function pDeck(){const d=[];for(const s of S)for(const r of PR)d.push({r,s});for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
function pVal(r){return {A:14,K:13,Q:12,J:11}[r]||Number(r);}
function bestHand(cards){
  const vals=cards.map(c=>pVal(c.r)).sort((a,b)=>b-a);
  const suits={};cards.forEach(c=>suits[c.s]=(suits[c.s]||[]).concat(pVal(c.r)));
  const counts={};vals.forEach(v=>counts[v]=(counts[v]||0)+1);
  const groups=Object.entries(counts).map(([v,n])=>({v:+v,n})).sort((a,b)=>b.n-a.n||b.v-a.v);
  let flush=null;for(const s in suits)if(suits[s].length>=5)flush=suits[s].sort((a,b)=>b-a);
  function straight(arr){const u=[...new Set(arr)].sort((a,b)=>b-a);if(u.includes(14))u.push(1);for(let i=0;i<u.length-4;i++)if(u[i]===u[i+4]+4)return u[i];return 0;}
  const st=straight(vals);
  if(flush&&straight(flush))return [8,straight(flush)];
  if(groups[0].n===4)return [7,groups[0].v];
  if(groups[0].n===3&&groups[1]&&groups[1].n>=2)return [6,groups[0].v];
  if(flush)return [5,flush[0]];
  if(st)return [4,st];
  if(groups[0].n===3)return [3,groups[0].v];
  if(groups[0].n===2&&groups[1]&&groups[1].n===2)return [2,Math.max(groups[0].v,groups[1].v)];
  if(groups[0].n===2)return [1,groups[0].v];
  return [0,vals[0]];
}
function cmpHand(a,b){if(a[0]!==b[0])return a[0]-b[0];return a[1]-b[1];}
const RANKS=["High","Pair","Two pair","Trips","Straight","Flush","Full house","Quads","Straight flush"];
let pState=null;
function paintPokerCards(){
  if(!pState)return;
  const hide=pState.live&&!pState.reveal;
  const board=document.getElementById("pBoard");board.innerHTML="";pState.board.forEach(c=>board.appendChild(cardEl(c)));
  const you=document.getElementById("pYou");you.innerHTML="";pState.you.forEach(c=>you.appendChild(cardEl(c)));
  const house=document.getElementById("pHouse");house.innerHTML="";pState.house.forEach((c,i)=>house.appendChild(cardEl(c,hide&&i>0)));
  document.getElementById("pPot").textContent=pState.pot;
  document.getElementById("pYouRank").textContent=pState.reveal?"\u00b7 "+RANKS[bestHand(pState.you.concat(pState.board))[0]]:"";
  document.getElementById("pHouseRank").textContent=pState.reveal?"\u00b7 "+RANKS[bestHand(pState.house.concat(pState.board))[0]]:"";
}
function pokerOver(text){pState.live=false;pState.reveal=true;paintPokerCards();document.getElementById("pMsg").textContent=text;}
function nextStreet(){
  if(pState.street===0){pState.board.push(pState.deck.pop());pState.street=1;document.getElementById("pMsg").textContent="Turn. Call or raise.";}
  else if(pState.street===1){pState.board.push(pState.deck.pop());pState.street=2;document.getElementById("pMsg").textContent="River. Call to show.";}
  else{
    pState.reveal=true;
    const y=bestHand(pState.you.concat(pState.board)), h=bestHand(pState.house.concat(pState.board));
    const c=cmpHand(y,h);
    if(c>0){setBank(bank()+pState.pot);pokerOver("You take "+pState.pot+" chips.");}
    else if(c<0)pokerOver("House takes it.");
    else{setBank(bank()+Math.floor(pState.pot/2));pokerOver("Split pot.");}
    return;
  }
  paintPokerCards();
}
document.getElementById("pDeal").onclick=()=>{if(pState&&pState.live)return;if(bank()<10)return toast("Need 10 chips");setBank(bank()-10);const d=pDeck();pState={deck:d,you:[d.pop(),d.pop()],house:[d.pop(),d.pop()],board:[d.pop(),d.pop(),d.pop()],pot:20,live:true,reveal:false,street:0};paintPokerCards();document.getElementById("pMsg").textContent="Flop is out. Call 10 or raise.";};
document.getElementById("pFold").onclick=()=>{if(!pState||!pState.live)return;pokerOver("Fold. House takes the pot.");};
document.getElementById("pCall").onclick=()=>{if(!pState||!pState.live)return;if(bank()<10)return toast("Need 10 chips");setBank(bank()-10);pState.pot+=20;nextStreet();};
document.getElementById("pRaise").onclick=()=>{if(!pState||!pState.live)return;if(bank()<20)return toast("Need 20 chips");setBank(bank()-20);pState.pot+=30;nextStreet();};
let cAnim=0,cRun=null;
function stopCrossy(){if(cAnim)cancelAnimationFrame(cAnim);cAnim=0;}
function startCrossy(){
  if(cRun&&cRun.live)return;if(bank()<5)return toast("Need 5 chips");
  setBank(bank()-5);
  const canvas=document.getElementById("crossyCanvas"), ctx=canvas.getContext("2d");
  canvas.width=360;canvas.height=460;
  const lanes=16,w=canvas.width,h=canvas.height,lh=h/lanes,cols=9;
  const kinds=[];
  for(let i=0;i<lanes;i++)kinds[i]=(i===0||i===lanes-1||i===1||i===8)?"grass":((i===2||i===7)?"water":"road");
  const cars=[], logs=[];
  for(let i=0;i<lanes;i++){
    const dir=i%2?1:-1;
    if(kinds[i]==="road"){const n=2+(i%3?1:0);for(let k=0;k<n;k++)cars.push({y:i,x:(w/n)*k,dir,spd:2.4+Math.random()*1.9+(i%4)*0.3,len:24+Math.random()*18,hue:Math.random()*360});}
    if(kinds[i]==="water"){for(let k=0;k<3;k++)logs.push({y:i,x:k*128,dir,spd:1.5+Math.random(),len:68+Math.random()*22});}
  }
  cRun={live:true,x:4,y:lanes-1,score:0,cars,logs,kinds,t:0};
  document.getElementById("cMsg").textContent="Traffic is mean. Hop.";
  const tick=()=>{
    if(!cRun||!cRun.live)return;
    cRun.t++;const boost=1+cRun.score*0.09;
    ctx.fillStyle="#071018";ctx.fillRect(0,0,w,h);
    for(let i=0;i<lanes;i++){
      const y=i*lh;
      if(cRun.kinds[i]==="road"){ctx.fillStyle="#2b2b2f";ctx.fillRect(0,y,w,lh);ctx.strokeStyle="#d4c36a";ctx.setLineDash([8,10]);ctx.beginPath();ctx.moveTo(0,y+lh/2);ctx.lineTo(w,y+lh/2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#111";ctx.fillRect(0,y,w,2);ctx.fillRect(0,y+lh-2,w,2);}
      else if(cRun.kinds[i]==="water"){ctx.fillStyle="#1a5a7a";ctx.fillRect(0,y,w,lh);ctx.fillStyle="rgba(180,230,255,.12)";for(let x=0;x<w;x+=18)ctx.fillRect(x+((cRun.t/2+i*9)%18),y+6,10,2);}
      else{ctx.fillStyle=i===0?"#2f7a3a":"#245c30";ctx.fillRect(0,y,w,lh);ctx.fillStyle="rgba(0,0,0,.12)";for(let x=6;x<w;x+=16)ctx.fillRect(x,(i*13+x)%lh+y,3,3);}
    }
    cRun.logs.forEach(log=>{log.x+=log.dir*log.spd*boost;if(log.dir>0&&log.x>w+20)log.x=-log.len;if(log.dir<0&&log.x<-log.len)log.x=w+20;ctx.fillStyle="#6b3f1f";ctx.fillRect(log.x,log.y*lh+8,log.len,lh-16);ctx.fillStyle="#8a5a32";ctx.fillRect(log.x+4,log.y*lh+11,log.len-8,4);});
    const px=cRun.x*(w/cols)+6, py=cRun.y*lh+7, pw=w/cols-12, ph=lh-14;
    if(cRun.kinds[cRun.y]==="water"){
      const log=cRun.logs.find(l=>cRun.y===l.y&&px+pw>l.x&&px<l.x+l.len);
      if(!log){cRun.live=false;document.getElementById("cMsg").textContent="Splash. Score "+cRun.score+".";}
      else{cRun.x+=(log.dir*log.spd*boost)/(w/cols);if(cRun.x<0||cRun.x>cols-1){cRun.live=false;document.getElementById("cMsg").textContent="Swept off. Score "+cRun.score+".";}}
    }
    cRun.cars.forEach(car=>{car.x+=car.dir*car.spd*boost;if(car.dir>0&&car.x>w+40)car.x=-50;if(car.dir<0&&car.x<-50)car.x=w+40;const y=car.y*lh+5;ctx.fillStyle="hsl("+car.hue+" 70% 42%)";ctx.fillRect(car.x,y,car.len,lh-10);ctx.fillStyle="rgba(180,220,255,.7)";ctx.fillRect(car.x+car.len*0.18,y+3,car.len*0.28,6);ctx.fillStyle="#ffe08a";if(car.dir>0)ctx.fillRect(car.x+car.len-4,y+4,3,5);else ctx.fillRect(car.x,y+4,3,5);if(cRun.live&&cRun.y===car.y&&px+pw-2>car.x&&px+2<car.x+car.len){cRun.live=false;document.getElementById("cMsg").textContent="Splat. Score "+cRun.score+".";}});
    ctx.fillStyle="#f3f0e4";ctx.beginPath();ctx.ellipse(px+pw/2,py+ph*0.62,pw*0.42,ph*0.34,0,0,6.3);ctx.fill();
    ctx.fillStyle="#e8c36a";ctx.beginPath();ctx.ellipse(px+pw/2,py+ph*0.32,pw*0.28,ph*0.28,0,0,6.3);ctx.fill();
    ctx.fillStyle="#1a1a1a";ctx.beginPath();ctx.arc(px+pw/2+3,py+ph*0.28,1.6,0,6.3);ctx.fill();
    ctx.fillStyle="#c23b3b";ctx.beginPath();ctx.moveTo(px+pw/2+6,py+ph*0.34);ctx.lineTo(px+pw+1,py+ph*0.38);ctx.lineTo(px+pw/2+6,py+ph*0.44);ctx.fill();
    document.getElementById("cScore").textContent=cRun.score;if(cRun.live)cAnim=requestAnimationFrame(tick);
  };
  stopCrossy();cAnim=requestAnimationFrame(tick);
}
function hop(){if(!cRun||!cRun.live)return;cRun.y=Math.max(0,cRun.y-1);cRun.score++;if(cRun.y===0){cRun.live=false;const win=8+cRun.score*2;setBank(bank()+win);document.getElementById("cMsg").textContent="Made it. +"+win+" chips.";document.getElementById("cScore").textContent=cRun.score;}}
document.getElementById("cStart").onclick=startCrossy;
document.getElementById("cUp").onclick=hop;
window.addEventListener("keydown",e=>{if((e.key==="ArrowUp"||e.key===" ")&&document.getElementById("crossy").classList.contains("on")){e.preventDefault();hop();}});
paintStacks();
