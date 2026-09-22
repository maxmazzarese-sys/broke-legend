let cBet=10;
function paintCBet(){const el=document.getElementById("cBetLbl");if(el)el.textContent=cBet;}
if(document.getElementById("cDown"))document.getElementById("cDown").onclick=()=>{if(cRun&&cRun.live)return;cBet=Math.max(5,cBet-5);paintCBet();};
if(document.getElementById("cPlus"))document.getElementById("cPlus").onclick=()=>{if(cRun&&cRun.live)return;cBet=Math.min(bank(),cBet+5);if(cBet<5)cBet=5;paintCBet();};
const rawStart=startCrossy, rawHop=hop;
startCrossy=function(){if(cRun&&cRun.live)return;if(bank()<cBet)return toast("Need chips to bet");const stake=cBet,before=bank();rawStart();if(cRun&&cRun.live)setBank(before-stake);};
hop=function(){if(!cRun||!cRun.live)return;const finishing=cRun.y===1,before=bank();rawHop();if(finishing){const added=bank()-before;if(added>0)setBank(before+cBet*2);}};
document.getElementById("cStart").onclick=startCrossy;
document.getElementById("cUp").onclick=hop;
paintCBet();
