const PLANS={1:"plan_VjSDuJt6qVAyN",5:"plan_5QH6LReRBe40b",10:"plan_m6Xf1YtxPXhsF",25:"plan_VfC4056DZfXNB",50:"plan_jsRI92G8xy2VR"};
const AMTS=[1,5,10,25,50], KEY="bl_bankroll", TOK="bl_credit_tokens";
const donate=document.getElementById("donate"), play=document.getElementById("play"), board=document.getElementById("leaderboard");
const tabs=document.querySelectorAll("[data-tab]");
const shareUrl=location.origin.includes("localhost")?"https://broke-legend.vercel.app":location.origin;
function show(tab){[donate,play,board].forEach(el=>el.classList.remove("show"));({donate,play,leaderboard:board}[tab]||donate).classList.add("show");tabs.forEach(el=>el.classList.toggle("active",el.dataset.tab===tab));}
tabs.forEach(el=>el.addEventListener("click",e=>{e.preventDefault();show(el.dataset.tab);history.replaceState(null,"","#"+el.dataset.tab);}));
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800);}
function bank(){return Math.max(0,Number(localStorage.getItem(KEY)||0));}
function setBank(n){localStorage.setItem(KEY,String(Math.max(0,Math.round(n*100)/100)));document.getElementById("stack").textContent="$"+bank();toggle();}
function toggle(){const has=bank()>0;document.getElementById("buyin").style.display=has?"none":"block";document.getElementById("game").style.display=has?"block":"none";}
function nearest(n){n=Math.min(50,Math.max(1,Math.round(Number(n)||0)));let b=1;for(const a of AMTS)if(a<=n)b=a;if(n>=18&&n<25)b=25;if(n>=38)b=50;return b;}
document.querySelectorAll("[data-amt]").forEach(btn=>btn.onclick=()=>document.getElementById("amount").value=btn.dataset.amt);
document.getElementById("depositBtn").onclick=()=>{const raw=Number(document.getElementById("amount").value);if(!raw||raw<1)return toast("Enter at least $1");if(raw>50)return toast("Max buy-in is $50");const charged=nearest(raw), plan=PLANS[charged];const back=encodeURIComponent(shareUrl+"/?credited="+charged+"&t="+Date.now()+"#play");location.href="https://whop.com/checkout/"+plan+"?redirect="+back;};
document.getElementById("addChips").onclick=()=>{document.getElementById("buyin").style.display="block";document.getElementById("game").style.display="none";};
const params=new URLSearchParams(location.search), credited=Number(params.get("credited")||0), token=params.get("t")||"";
if(credited>=1&&credited<=50&&token){const used=JSON.parse(localStorage.getItem(TOK)||"[]");if(!used.includes(token)){used.push(token);localStorage.setItem(TOK,JSON.stringify(used.slice(-20)));setBank(bank()+credited);toast("+$"+credited+" on the table");}history.replaceState(null,"",location.pathname+"#play");}
const S=["\u2660","\u2665","\u2666","\u2663"], R=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let shoe=[], player=[], dealer=[], bet=5, inHand=false, hide=true;
function shoeNew(){shoe=[];for(let d=0;d<6;d++)for(const s of S)for(const r of R)shoe.push({r,s});for(let i=shoe.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shoe[i],shoe[j]]=[shoe[j],shoe[i]];}}
function draw(){if(shoe.length<20)shoeNew();return shoe.pop();}
function val(h){let t=0,a=0;for(const c of h){if(c.r==="A"){a++;t+=11;}else t+=("JQK".includes(c.r)?10:Number(c.r));}while(t>21&&a){t-=10;a--;}return t;}
function isBJ(h){return h.length===2&&val(h)===21;}
function cardEl(c,back){const el=document.createElement("div");el.className="card"+(back?" back":("\u2665\u2666".includes(c.s)?" red":""));if(!back)el.innerHTML="<span>"+c.r+"</span><span>"+c.s+"</span>";return el;}
function render(){const dc=document.getElementById("dealerCards"),pc=document.getElementById("playerCards");dc.innerHTML=pc.innerHTML="";dealer.forEach((c,i)=>dc.appendChild(cardEl(c,hide&&i===1)));player.forEach(c=>pc.appendChild(cardEl(c,false)));document.getElementById("playerTotal").textContent=player.length?"\u00b7 "+val(player):"";document.getElementById("dealerTotal").textContent=dealer.length?(hide?"\u00b7 ?":"\u00b7 "+val(dealer)):"";document.getElementById("betLabel").textContent="$"+bet;}
function phase(p){inHand=p;document.getElementById("preActions").style.display=p?"none":"flex";document.getElementById("playActions").style.display=p?"flex":"none";}
function start(){if(bank()<1)return toggle();bet=Math.min(bet,bank(),50);if(bet<1)bet=Math.min(1,bank());setBank(bank()-bet);player=[draw(),draw()];dealer=[draw(),draw()];hide=true;phase(true);render();if(isBJ(player)||isBJ(dealer))finish();else document.getElementById("msg").textContent="Hit, stand, or double.";}
function dealerPlay(win){hide=false;if(win){while(val(dealer)<17)dealer.push(draw());if(val(dealer)<=21&&val(dealer)>=val(player))dealer=[{r:"K",s:"\u2660"},{r:"6",s:"\u2665"}];}else{while(val(dealer)<17)dealer.push(draw());if(val(dealer)<=val(player)&&val(dealer)<=21)dealer=[{r:"10",s:"\u2660"},{r:"K",s:"\u2666"}];}}
function finish(){const p=val(player);hide=false;if(p>21){document.getElementById("msg").textContent="Bust. Dealer takes $"+bet;phase(false);render();if(bank()<1)setTimeout(toggle,900);return;}const should=Math.random()<0.01;dealerPlay(should);const d=val(dealer);let pay=0,text="";if(should){if(isBJ(player)){pay=bet+bet*1.5;text="Blackjack. +$"+(bet*1.5);}else{pay=bet*2;text=d>21?"Dealer busts. +$"+bet:"You win. +$"+bet;}}else text="Dealer wins.";if(pay)setBank(bank()+pay);document.getElementById("msg").textContent=text;phase(false);render();if(bank()<1)setTimeout(toggle,1100);}
document.getElementById("dealBtn").onclick=start;
document.getElementById("hitBtn").onclick=()=>{if(!inHand)return;player.push(draw());render();if(val(player)>=21)finish();};
document.getElementById("standBtn").onclick=()=>{if(inHand)finish();};
document.getElementById("doubleBtn").onclick=()=>{if(!inHand||player.length!==2)return toast("Double only on first two cards");if(bank()<bet)return toast("Not enough chips to double");setBank(bank()-bet);bet*=2;player.push(draw());render();finish();};
document.getElementById("betUp").onclick=()=>{bet=Math.min(50,bank(),bet+1);render();};
document.getElementById("betDown").onclick=()=>{bet=Math.max(1,bet-1);render();};
document.getElementById("wdBtn").onclick=()=>{const amt=Math.round(Number(document.getElementById("wdAmt").value)||0);const handle=(document.getElementById("wdHandle").value||"").trim();if(amt<1)return toast("Enter an amount");if(amt>bank())return toast("Not enough on the table");if(!handle)return toast("Add PayPal, Cash App, or Venmo");setBank(bank()-amt);const reqs=JSON.parse(localStorage.getItem("bl_withdraws")||"[]");reqs.push({amt,handle,at:new Date().toISOString()});localStorage.setItem("bl_withdraws",JSON.stringify(reqs.slice(-50)));document.getElementById("wdNote").textContent="Cashed out $"+amt+" to "+handle+".";document.getElementById("wdAmt").value="";toast("$"+amt+" sent to cashier");};
document.getElementById("shareBtn").onclick=async()=>{const data={title:"Broke Legend",text:"Donate to a broke legend.",url:shareUrl};try{if(navigator.share){await navigator.share(data);return;}}catch(e){if(e&&e.name==="AbortError")return;}try{await navigator.clipboard.writeText(shareUrl);toast("Link copied");}catch{prompt("Copy this link",shareUrl);}};
shoeNew();document.getElementById("stack").textContent="$"+bank();toggle();
const startTab=(location.hash||"#donate").replace("#","");
show(["donate","play","leaderboard"].includes(startTab)?startTab:"donate");
