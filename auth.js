const ACC="bl_accounts", SES="bl_session";
const gate=document.getElementById("gate"), form=document.getElementById("authForm");
const userEl=document.getElementById("authUser"), emailEl=document.getElementById("authEmail"), passEl=document.getElementById("authPass");
const errEl=document.getElementById("gateErr"), go=document.getElementById("authGo"), sw=document.getElementById("authSwitch");
const title=document.getElementById("gateTitle"), profileBtn=document.getElementById("profileBtn"), menu=document.getElementById("profileMenu");
let mode="signup";
function accounts(){try{return JSON.parse(localStorage.getItem(ACC)||"{}");}catch(e){return {};}}
function saveAcc(map){localStorage.setItem(ACC,JSON.stringify(map));}
function session(){try{return JSON.parse(localStorage.getItem(SES)||"null");}catch(e){return null;}}
function setSession(s){if(s)localStorage.setItem(SES,JSON.stringify(s));else localStorage.removeItem(SES);paintProfile();}
function normUser(s){return String(s||"").trim().replace(/^@/,"").toLowerCase();}
function validUser(s){return /^[a-z0-9_]{3,16}$/.test(s);}
async function digest(text){const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");}
function salt(){const a=new Uint8Array(8);crypto.getRandomValues(a);return [...a].map(b=>b.toString(16).padStart(2,"0")).join("");}
function paintProfile(){const s=session();profileBtn.textContent=s?s.user.slice(0,1).toUpperCase():"?";document.getElementById("menuName").textContent=s?s.user:"—";document.getElementById("menuEmail").textContent=s?s.email:"—";if(s){gate.classList.add("hidden");localStorage.setItem("bl_name",s.user);}else{gate.classList.remove("hidden");menu.classList.remove("show");}}
function setMode(next){mode=next;title.textContent=mode==="signup"?"Sign up":"Log in";go.textContent=mode==="signup"?"Create account":"Log in";sw.textContent=mode==="signup"?"Have an account? Log in":"New here? Sign up";passEl.autocomplete=mode==="signup"?"new-password":"current-password";errEl.textContent="";}
sw.onclick=()=>setMode(mode==="signup"?"login":"signup");
profileBtn.onclick=()=>{if(!session()){gate.classList.remove("hidden");return;}menu.classList.toggle("show");};
document.getElementById("logoutBtn").onclick=()=>{setSession(null);menu.classList.remove("show");};
document.addEventListener("click",e=>{if(!menu.contains(e.target)&&e.target!==profileBtn)menu.classList.remove("show");});
form.onsubmit=async e=>{
  e.preventDefault();
  const user=normUser(userEl.value), email=String(emailEl.value||"").trim().toLowerCase(), pass=passEl.value;
  errEl.textContent="";
  if(mode==="signup"&&!validUser(user))return errEl.textContent="Username: 3–16 letters, numbers, _";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return errEl.textContent="Enter a real email";
  if(pass.length<6)return errEl.textContent="Password needs 6+ characters";
  const map=accounts();
  if(mode==="signup"){
    if(map[user])return errEl.textContent="That username is taken";
    if(Object.values(map).some(a=>a.email===email))return errEl.textContent="That email already has an account";
    const sl=salt(), hash=await digest(sl+pass);
    map[user]={user,email,salt:sl,hash,at:Date.now()};
    saveAcc(map);
    setSession({user,email});
    return;
  }
  const row=map[user]||Object.values(map).find(a=>a.email===email||a.user===user);
  if(!row)return errEl.textContent="No account with that username";
  const hash=await digest(row.salt+pass);
  if(hash!==row.hash)return errEl.textContent="Wrong password";
  setSession({user:row.user,email:row.email});
};
paintProfile();
setMode("signup");
