(function(){
  const pPick={val:5}; let pAnte=0;
  const pChips=document.getElementById("pChips"), pSpot=document.getElementById("pSpot"), pAnteEl=document.getElementById("pAnte");
  if(pChips)paintChipBar(pChips,pPick);
  function paintAnte(){if(pAnteEl)pAnteEl.textContent=pAnte;}
  if(pSpot)pSpot.onclick=()=>{if(typeof pState!=="undefined"&&pState&&pState.live)return;dropChip(()=>pAnte,n=>{pAnte=n;paintAnte();},pPick.val,()=>typeof pState!=="undefined"&&pState&&pState.live);};
  const pClear=document.getElementById("pClear");
  if(pClear)pClear.onclick=()=>{if(typeof pState!=="undefined"&&pState&&pState.live)return;pullChips(()=>pAnte,n=>{pAnte=n;paintAnte();},()=>typeof pState!=="undefined"&&pState&&pState.live);};
  const pDeal=document.getElementById("pDeal");
  if(pDeal)pDeal.onclick=()=>{
    if(typeof pState!=="undefined"&&pState&&pState.live)return;
    if(pAnte<1)return toast("Drop an ante first");
    const unit=pAnte;pAnte=0;paintAnte();
    const d=pDeck();
    pState={deck:d,you:[d.pop(),d.pop()],house:[d.pop(),d.pop()],board:[],pot:unit*2,live:true,reveal:false,street:0,unit:unit};
    pState.board.push(d.pop(),d.pop(),d.pop());
    paintPokerCards();document.getElementById("pMsg").textContent="Flop. Call or raise with a chip.";
  };
  const pCall=document.getElementById("pCall");
  if(pCall)pCall.onclick=()=>{
    if(typeof pState==="undefined"||!pState||!pState.live)return;
    const unit=pPick.val;
    if(bank()<unit)return toast("Need chips");
    setBank(bank()-unit);pState.pot+=unit*2;
    if(pState.street===0){pState.board.push(pState.deck.pop());pState.street=1;document.getElementById("pMsg").textContent="Turn.";}
    else if(pState.street===1){pState.board.push(pState.deck.pop());pState.street=2;document.getElementById("pMsg").textContent="River.";}
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
  };
  const pRaise=document.getElementById("pRaise");
  if(pRaise)pRaise.onclick=()=>{
    if(typeof pState==="undefined"||!pState||!pState.live)return;
    const unit=pPick.val*2;
    if(bank()<unit)return toast("Need chips to raise");
    setBank(bank()-unit);pState.pot+=unit+pPick.val;
    document.getElementById("pMsg").textContent="Raise is in.";
    if(pCall)pCall.click();
  };
  const cPick={val:5};
  paintChipBar(document.getElementById("cChips"),cPick);
  const cSpot=document.getElementById("cSpot");
  if(cSpot)cSpot.onclick=()=>{if(typeof cRun!=="undefined"&&cRun&&cRun.live)return;dropChip(()=>cBet,n=>{cBet=n;paintCBet();},cPick.val,()=>typeof cRun!=="undefined"&&cRun&&cRun.live);};
  const cClear=document.getElementById("cClear");
  if(cClear)cClear.onclick=()=>{if(typeof cRun!=="undefined"&&cRun&&cRun.live)return;pullChips(()=>cBet,n=>{cBet=n;paintCBet();},()=>typeof cRun!=="undefined"&&cRun&&cRun.live);};
  if(typeof startCrossy==="function"){
    const orig=startCrossy;
    startCrossy=function(){
      if(!cBet)return toast("Drop a chip on the run first");
      orig();
    };
    const go=document.getElementById("cStart");
    if(go)go.onclick=startCrossy;
  }
})();
