const CHIPS=[1,5,10,25,100], CHIPHEX=["#f3efe4","#c23b3b","#2f5fbf","#2d7a3a","#161616"];
function paintChipBar(el, state){
  if(!el)return;
  el.innerHTML="";
  CHIPS.forEach((v,i)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="chipbtn"+(state.val===v?" on":"");
    b.textContent=v;
    b.style.background=CHIPHEX[i];
    if(v===100)b.style.color="#f6f1e4";
    b.onclick=()=>{state.val=v;paintChipBar(el,state);};
    el.appendChild(b);
  });
}
function dropChip(getAmt,setAmt,unit,busy){
  if(busy&&busy())return;
  if(bank()<unit){toast("Not enough chips");return false;}
  setBank(bank()-unit);
  setAmt(getAmt()+unit);
  return true;
}
function pullChips(getAmt,setAmt,busy){
  if(busy&&busy())return;
  const n=getAmt();
  if(!n)return;
  setBank(bank()+n);
  setAmt(0);
}
