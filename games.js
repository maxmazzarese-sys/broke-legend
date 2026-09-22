function paintStacks(){const n=bank();document.querySelectorAll("[data-stack]").forEach(el=>el.textContent=n+" chips");}
const _setBank=setBank;setBank=function(n){_setBank(n);paintStacks();};
document.querySelectorAll("[data-game]").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll("[data-game]").forEach(b=>b.classList.toggle("on",b===btn));
  document.querySelectorAll(".gamebox").forEach(g=>g.classList.toggle("on",g.id===btn.dataset.game));
  if(btn.dataset.game!=="crossy")stopCrossy();
});
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
let rBet=10,rPick="red",rBusy=false;
document.querySelectorAll("[data-color]").forEach(b=>b.onclick=()=>{rPick=b.dataset.color;document.querySelectorAll("[data-color]").forEach(x=>x.classList.toggle("on",x===b));});
document.querySelector('[data-color="red"]').classList.add("on");
document.getElementById("rDown").onclick=()=>{if(rBusy)return;rBet=Math.max(5,rBet-5);document.getElementById("rBetLbl").textContent=rBet;};
document.getElementById("rUp").onclick=()=>{if(rBusy)return;rBet=Math.min(50,bank(),rBet+5);document.getElementById("rBetLbl").textContent=rBet;};
document.getElementById("rSpin").onclick=()=>{
  if(rBusy)return;if(bank()<rBet)return toast("Not enough chips");
  rBusy=true;setBank(bank()-rBet);
  const n=Math.floor(Math.random()*37), color=n===0?"green":(RED.has(n)?"red":"black");
  document.getElementById("wheel").style.transform="rotate("+(720+n*9.73+Math.random()*6)+"deg)";
  document.getElementById("rMsg").textContent="Spinning...";
  setTimeout(()=>{let pay=0;if(color===rPick)pay=rPick==="green"?rBet*36:rBet*2;if(pay)setBank(bank()+pay);document.getElementById("rMsg").textContent=n+" "+color+(pay?"  +"+pay:"  -"+rBet);rBusy=false;},2200);
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
document.getElementById("pDeal").onclick=()=>{
  if(pState&&pState.live)return;if(bank()<10)return toast("Need 10 chips");
  setBank(bank()-10);const d=pDeck();
  pState={deck:d,you:[d.pop(),d.pop()],house:[d.pop(),d.pop()],board:[d.pop(),d.pop(),d.pop()],pot:20,live:true,reveal:false,street:0};
  paintPokerCards();document.getElementById("pMsg").textContent="Flop is out. Call 10 or raise.";
};
document.getElementById("pFold").onclick=()=>{if(!pState||!pState.live)return;pokerOver("Fold. House takes the pot.");};
document.getElementById("pCall").onclick=()=>{if(!pState||!pState.live)return;if(bank()<10)return toast("Need 10 chips");setBank(bank()-10);pState.pot+=20;nextStreet();};
document.getElementById("pRaise").onclick=()=>{if(!pState||!pState.live)return;if(bank()<20)return toast("Need 20 chips");setBank(bank()-20);pState.pot+=30;nextStreet();};
let cAnim=0,cRun=null;
function stopCrossy(){if(cAnim)cancelAnimationFrame(cAnim);cAnim=0;}
function startCrossy(){
  if(cRun&&cRun.live)return;if(bank()<5)return toast("Need 5 chips");
  setBank(bank()-5);
  const canvas=document.getElementById("crossyCanvas"), ctx=canvas.getContext("2d");
  const lanes=12,w=canvas.width,h=canvas.height,lh=h/lanes;
  const cars=[];
  for(let i=2;i<lanes-1;i++)if(i%2){
    const dir=i%4===1?1:-1;
    cars.push({y:i,x:dir>0?-40:w+40,dir,spd:1.2+Math.random()*1.6,len:28+Math.random()*18});
  }
  cRun={live:true,x:4,y:lanes-1,score:0,cars};
  document.getElementById("cMsg").textContent="Hop up. Don't eat bumper.";
  const tick=()=>{
    if(!cRun||!cRun.live)return;
    ctx.fillStyle="#0b1a12";ctx.fillRect(0,0,w,h);
    for(let i=0;i<lanes;i++){
      ctx.fillStyle=(i>1&&i<lanes-1&&i%2)?"#2a2a2a":(i%2?"#163222":"#102418");
      ctx.fillRect(0,i*lh,w,lh);
    }
    cRun.cars.forEach(car=>{
      car.x+=car.dir*car.spd;
      if(car.dir>0&&car.x>w+50)car.x=-50;
      if(car.dir<0&&car.x<-50)car.x=w+50;
      ctx.fillStyle="#c23b3b";ctx.fillRect(car.x,car.y*lh+6,car.len,lh-12);
      const px=cRun.x*(w/9);
      if(cRun.y===car.y&&px+14>car.x&&px<car.x+car.len){cRun.live=false;document.getElementById("cMsg").textContent="Splat. Run over for "+cRun.score+".";}
    });
    ctx.fillStyle="#e8c36a";ctx.fillRect(cRun.x*(w/9)+4,cRun.y*lh+8,18,lh-16);
    document.getElementById("cScore").textContent=cRun.score;
    if(cRun.live)cAnim=requestAnimationFrame(tick);
  };
  stopCrossy();cAnim=requestAnimationFrame(tick);
}
function hop(){if(!cRun||!cRun.live)return;cRun.y=Math.max(0,cRun.y-1);cRun.score++;if(cRun.y===0){cRun.live=false;const win=5+cRun.score;setBank(bank()+win);document.getElementById("cMsg").textContent="Made it. +"+win+" chips.";document.getElementById("cScore").textContent=cRun.score;}}
document.getElementById("cStart").onclick=startCrossy;
document.getElementById("cUp").onclick=hop;
window.addEventListener("keydown",e=>{if((e.key==="ArrowUp"||e.key===" ")&&document.getElementById("crossy").classList.contains("on")){e.preventDefault();hop();}});
paintStacks();
