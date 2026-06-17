/* =====================================================================
   FINANZAS FAMILIA — lógica de la PWA conectada a Supabase
   ===================================================================== */

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ICONS = {
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>',
  receipt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
};

const CATS = {
  ingreso: ["Ventas","Sueldo","Servicios","Préstamo","Otros ingresos"],
  gasto: ["Insumos","Sueldos","Servicios básicos","Alquiler","Transporte","Alimentación","Mantenimiento","Impuestos","Otros gastos"],
};
const PALETTE = ["#378ADD","#1D9E75","#D85A30","#7F77DD","#D4537E","#BA7517"];

const FMT = new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN",minimumFractionDigits:2});
const fmt = n => FMT.format(Math.round(((+n)+Number.EPSILON)*100)/100);
const num = n => fmt(n).replace("PEN","").trim();
const todayISO = () => new Date().toISOString().slice(0,10);
const esc = s => String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"];
const monthLabel = m => { const [y,mo]=m.split("-"); return MONTHS[parseInt(mo)-1]+" "+y; };

let state = {
  user: null,
  profiles: [],
  active: null,
  tx: [],
  rends: [],
  tab: "mov",
  openRend: null,
  monthFilter: todayISO().slice(0,7),
  rtChannel: null,
};

const app = document.getElementById("app");

/* ============================ ARRANQUE ============================= */
(async function init(){
  const { data:{ session } } = await sb.auth.getSession();
  if(session){ state.user = session.user; await loadAll(); }
  else renderAuth();

  sb.auth.onAuthStateChange((_e, sess) => {
    if(sess && !state.user){ state.user = sess.user; loadAll(); }
    if(!sess){ state.user = null; teardownRealtime(); renderAuth(); }
  });
})();

/* ============================ AUTENTICACIÓN ======================== */
function renderAuth(mode="login", msg=null, msgType="err"){
  app.innerHTML = `
    <div class="auth-wrap">
      <div class="auth-logo">${ICONS.wallet}</div>
      <h1>${mode==="login"?"Mis Finanzas":"Crear cuenta"}</h1>
      <p class="sub">${mode==="login"?"Ingresa para ver y registrar tus finanzas, en todos tus equipos.":"Regístrate para empezar. Cada miembro de la familia usa su propia cuenta."}</p>
      ${msg?`<div class="auth-${msgType==="ok"?"ok":"err"}">${esc(msg)}</div>`:""}
      ${mode==="signup"?`<div class="field"><label>Nombre y apellido</label><input id="a_name" placeholder="Ej. Moisés Trujillo" autocomplete="name"></div>`:""}
      <div class="field"><label>Correo</label><input id="a_email" type="email" placeholder="tucorreo@ejemplo.com" autocomplete="email"></div>
      <div class="field"><label>Contraseña</label><input id="a_pass" type="password" placeholder="${mode==="signup"?"Mínimo 6 caracteres":"Tu contraseña"}" autocomplete="${mode==="signup"?"new-password":"current-password"}"></div>
      <button class="primary" style="background:#378ADD" id="a_btn" onclick="${mode==="login"?"doLogin()":"doSignup()"}">${mode==="login"?"Ingresar":"Crear cuenta"}</button>
      <div class="auth-switch">
        ${mode==="login"?"¿No tienes cuenta? ":"¿Ya tienes cuenta? "}
        <button onclick="renderAuth('${mode==="login"?"signup":"login"}')">${mode==="login"?"Regístrate":"Inicia sesión"}</button>
      </div>
    </div>`;
}

async function doLogin(){
  const email=document.getElementById("a_email").value.trim();
  const pass=document.getElementById("a_pass").value;
  if(!email||!pass) return renderAuth("login","Escribe tu correo y contraseña.");
  const btn=document.getElementById("a_btn"); btn.disabled=true; btn.textContent="Ingresando…";
  const { error } = await sb.auth.signInWithPassword({ email, password: pass });
  if(error) return renderAuth("login", traducirError(error.message));
  // onAuthStateChange se encarga del resto
}

async function doSignup(){
  const name=document.getElementById("a_name").value.trim();
  const email=document.getElementById("a_email").value.trim();
  const pass=document.getElementById("a_pass").value;
  if(!name||!email||!pass) return renderAuth("signup","Completa todos los campos.");
  if(pass.length<6) return renderAuth("signup","La contraseña debe tener al menos 6 caracteres.");
  const btn=document.getElementById("a_btn"); btn.disabled=true; btn.textContent="Creando…";
  const { data, error } = await sb.auth.signUp({ email, password: pass, options:{ data:{ full_name: name } } });
  if(error) return renderAuth("signup", traducirError(error.message));
  if(data.user && !data.session){
    return renderAuth("login","Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.","ok");
  }
}

async function doLogout(){ closeModal(); await sb.auth.signOut(); }

function traducirError(m){
  if(/Invalid login/i.test(m)) return "Correo o contraseña incorrectos.";
  if(/already registered/i.test(m)) return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if(/Email not confirmed/i.test(m)) return "Aún no confirmas tu correo. Revisa tu bandeja.";
  return m;
}

/* ============================ CARGA DE DATOS ======================= */
async function loadAll(){
  app.innerHTML = `<div class="loading">Cargando tus datos…</div>`;
  await loadProfiles();
  if(state.profiles.length===0){ await seedDefaultProfile(); await loadProfiles(); }
  if(!state.active || !state.profiles.find(p=>p.id===state.active)) state.active = state.profiles[0]?.id || null;
  await loadProfileData();
  setupRealtime();
  render();
}

async function loadProfiles(){
  const { data, error } = await sb.from("perfiles").select("*").order("creado_en");
  state.profiles = error ? [] : (data||[]);
}

async function seedDefaultProfile(){
  await sb.from("perfiles").insert({ nombre:"Hogar", color:"#378ADD", compartido:false, owner_id: state.user.id });
}

async function loadProfileData(){
  if(!state.active){ state.tx=[]; state.rends=[]; return; }
  const [mv, rd] = await Promise.all([
    sb.from("movimientos").select("*").eq("perfil_id", state.active),
    sb.from("rendiciones").select("*").eq("perfil_id", state.active),
  ]);
  state.tx = (mv.data||[]).sort((a,b)=> b.fecha.localeCompare(a.fecha) || b.creado_en.localeCompare(a.creado_en));
  state.rends = (rd.data||[]).sort((a,b)=> b.fecha.localeCompare(a.fecha));
}

/* ============================ TIEMPO REAL ========================== */
function teardownRealtime(){ if(state.rtChannel){ sb.removeChannel(state.rtChannel); state.rtChannel=null; } }
function setupRealtime(){
  teardownRealtime();
  state.rtChannel = sb.channel("cambios")
    .on("postgres_changes",{ event:"*", schema:"public", table:"movimientos" }, p => onRemoteChange("mov",p))
    .on("postgres_changes",{ event:"*", schema:"public", table:"rendiciones" }, p => onRemoteChange("rend",p))
    .on("postgres_changes",{ event:"*", schema:"public", table:"perfiles" }, () => { loadProfiles().then(render); })
    .subscribe();
}
async function onRemoteChange(kind, payload){
  const row = payload.new || payload.old;
  if(row && row.perfil_id && row.perfil_id !== state.active) return; // otro perfil: ignorar
  await loadProfileData();
  render();
}

/* ============================ DERIVADOS ============================ */
function activeProfile(){ return state.profiles.find(p=>p.id===state.active)||state.profiles[0]||{nombre:"—",color:"#378ADD"}; }
function isOwner(p){ return p && p.owner_id===state.user.id; }
function peopleList(){
  const s=new Set();
  state.tx.forEach(t=>t.persona&&s.add(t.persona));
  state.rends.forEach(r=>r.persona&&s.add(r.persona));
  return [...s].sort();
}

/* ============================ RENDER PRINCIPAL ===================== */
function render(){
  if(!state.user) return;
  const r = state.openRend ? state.rends.find(x=>x.id===state.openRend) : null;
  if(r){ renderRendition(r); return; }
  renderHome();
}

function renderHome(){
  const p = activeProfile();
  const tx = state.tx.filter(t=>t.fecha.slice(0,7)===state.monthFilter);
  let ing=0,gas=0; tx.forEach(t=>t.tipo==="ingreso"?ing+=+t.monto:gas+=+t.monto);
  const monthsSet=new Set([todayISO().slice(0,7)]);
  state.tx.forEach(t=>monthsSet.add(t.fecha.slice(0,7)));
  const months=[...monthsSet].sort().reverse();
  const rends=state.rends;

  let listHTML="";
  if(state.tab==="mov"){
    listHTML = tx.length===0
      ? `<div class="empty">${ICONS.wallet}<p>Sin movimientos este mes.<br>Toca + para registrar uno.</p></div>`
      : tx.map(t=>`
        <div class="row">
          <div class="ibox" style="background:${t.tipo==="ingreso"?"#E1F5EE":"#FAECE7"};color:${t.tipo==="ingreso"?"#0F6E56":"#993C1D"}">${t.tipo==="ingreso"?ICONS.up:ICONS.down}</div>
          <div class="row-mid">
            <div class="row-title">${esc(t.categoria)}</div>
            <div class="row-sub">${t.persona?esc(t.persona)+" · ":""}${t.nota?esc(t.nota)+" · ":""}${t.fecha}</div>
          </div>
          <div class="row-amt ${t.tipo==="ingreso"?"green":"red"}">${t.tipo==="ingreso"?"+":"−"}${num(t.monto)}</div>
          <button class="del-btn" onclick="delTx('${t.id}')">${ICONS.trash}</button>
        </div>`).join("");
  } else {
    listHTML = rends.length===0
      ? `<div class="empty">${ICONS.receipt}<p>Sin rendiciones.<br>Toca + para crear una.</p></div>`
      : rends.map(r=>{
        const spent=(r.items||[]).reduce((s,i)=>s+(+i.amount),0);
        if((r.tipo||"adelanto")==="reembolso"){
          const pagado=(r.pagos||[]).reduce((s,p)=>s+(+p.amount),0);
          const falta=spent-pagado;
          return `<div class="row clickable" onclick="openRend('${r.id}')">
            <div class="ibox" style="background:#FCEEDB;color:#9A6A12">${ICONS.receipt}</div>
            <div class="row-mid">
              <div class="row-title">${esc(r.persona||"Sin persona")} <span class="mini-tag">Reembolso</span></div>
              <div class="row-sub">${esc(r.concepto||"Gastos a devolver")} · ${r.fecha}</div>
              <div class="rend-meta"><span>Gastos ${num(spent)}</span><span>Pagado ${num(pagado)}</span></div>
            </div>
            <div class="rend-right">
              <span class="lab">${falta>0?"Le debes":"Saldado"}</span>
              <span class="v ${falta>0?"red":"green"}">${num(Math.abs(falta))}</span>
            </div>
          </div>`;
        }
        const diff=(+r.adelanto)-spent;
        return `<div class="row clickable" onclick="openRend('${r.id}')">
          <div class="ibox" style="background:#EEEDFE;color:#3C3489">${ICONS.receipt}</div>
          <div class="row-mid">
            <div class="row-title">${esc(r.persona||"Sin persona")} <span class="mini-tag">Adelanto</span></div>
            <div class="row-sub">${esc(r.concepto||"Adelanto")} · ${r.fecha}</div>
            <div class="rend-meta"><span>Entregado ${num(r.adelanto)}</span><span>Gastado ${num(spent)}</span></div>
          </div>
          <div class="rend-right">
            <span class="lab">${diff>=0?"Devuelve":"Reembolso"}</span>
            <span class="v ${diff>=0?"green":"red"}">${num(Math.abs(diff))}</span>
          </div>
        </div>`;}).join("");
  }

  app.innerHTML = `
    <header style="background:${p.color}">
      <div class="hdr-top">
        <span class="eyebrow">MIS FINANZAS</span>
        <div class="hdr-actions">
          <button class="icon-btn" onclick="openProfiles()">${ICONS.settings}</button>
          <button class="icon-btn" onclick="openAccount()">${ICONS.logout}</button>
        </div>
      </div>
      <button class="profile-pill" onclick="openProfiles()">
        <span class="pname">${esc(p.nombre)}</span>
        ${p.compartido?`<span class="shared-tag">Compartido</span>`:""}
        ${ICONS.chevron}
      </button>
      <div class="bal-label">Saldo del mes</div>
      <div class="bal-amount">${fmt(ing-gas)}</div>
      <div class="badge-rt"><span class="pulse"></span> Sincronizado en tiempo real</div>
    </header>
    <div class="body">
      <div class="stats">
        <div class="stat"><div class="stat-label green">${ICONS.up}Ingresos</div><div class="stat-val">${fmt(ing)}</div></div>
        <div class="stat"><div class="stat-label red">${ICONS.down}Gastos</div><div class="stat-val">${fmt(gas)}</div></div>
      </div>
      <div class="tabs">
        <button class="tab ${state.tab==="mov"?"active":""}" onclick="setTab('mov')">Movimientos</button>
        <button class="tab ${state.tab==="rend"?"active":""}" onclick="setTab('rend')">Rendiciones</button>
      </div>
      ${state.tab==="mov"?`
        <div class="toolbar">
          <select onchange="setMonth(this.value)">${months.map(m=>`<option value="${m}" ${m===state.monthFilter?"selected":""}>${monthLabel(m)}</option>`).join("")}</select>
          <span class="count">${tx.length} movimiento${tx.length!==1?"s":""}</span>
        </div>`:`<div style="height:4px"></div>`}
      <div class="list">${listHTML}</div>
    </div>
    <button class="fab" style="background:${p.color}" onclick="openForm()">${ICONS.plus}</button>`;
}

function renderRendition(r){
  const p=activeProfile();
  const tipo=r.tipo||"adelanto";
  const items=r.items||[]; const spent=items.reduce((s,i)=>s+(+i.amount),0);
  const itemsHTML = items.length===0
    ? `<div class="empty">${ICONS.receipt}<p>Aún no hay gastos.</p></div>`
    : items.map(i=>`
      <div class="row">
        <div class="ibox" style="background:#FAECE7;color:#993C1D">${ICONS.down}</div>
        <div class="row-mid"><div class="row-title">${esc(i.category)}</div><div class="row-sub">${i.note?esc(i.note)+" · ":""}${i.date}</div></div>
        <div class="row-amt red">${num(i.amount)}</div>
        <button class="del-btn" onclick="delItem('${r.id}','${i.id}')">${ICONS.trash}</button>
      </div>`).join("");

  let resumenHTML, extraSección="";

  if(tipo==="reembolso"){
    const pagos=r.pagos||[]; const pagado=pagos.reduce((s,x)=>s+(+x.amount),0);
    const falta=spent-pagado;
    resumenHTML = `
      <div class="card">
        <div class="line"><span>Total de gastos</span><span>${fmt(spent)}</span></div>
        <div class="line"><span>Ya pagado a la persona</span><span>${fmt(pagado)}</span></div>
        <div class="divider"></div>
        <div class="result">
          <span class="t ${falta>0?"red":"green"}">${falta>0?"Te falta devolver":"Reembolso saldado"}</span>
          <span class="a ${falta>0?"red":"green"}">${fmt(Math.abs(falta))}</span>
        </div>
      </div>`;
    const pagosHTML = pagos.length===0
      ? `<div class="empty">${ICONS.wallet}<p>Aún no registras pagos.</p></div>`
      : pagos.map(x=>`
        <div class="row">
          <div class="ibox" style="background:#E1F5EE;color:#0F6E56">${ICONS.up}</div>
          <div class="row-mid"><div class="row-title">Pago</div><div class="row-sub">${x.note?esc(x.note)+" · ":""}${x.date}</div></div>
          <div class="row-amt green">${num(x.amount)}</div>
          <button class="del-btn" onclick="delPago('${r.id}','${x.id}')">${ICONS.trash}</button>
        </div>`).join("");
    extraSección = `
      <div class="sec-head" style="margin-top:18px"><span class="t">Pagos hechos a la persona</span><button class="add-sm" onclick="openPagoForm('${r.id}')">${ICONS.plus} Pago</button></div>
      <div class="list">${pagosHTML}</div>`;
  } else {
    const diff=(+r.adelanto)-spent;
    resumenHTML = `
      <div class="card">
        <div class="line"><span>Monto entregado</span><span>${fmt(r.adelanto)}</span></div>
        <div class="line"><span>Total gastado (rendido)</span><span>${fmt(spent)}</span></div>
        <div class="divider"></div>
        <div class="result">
          <span class="t ${diff>=0?"green":"red"}">${diff>=0?"Saldo a devolver a caja":"Saldo a reembolsar a la persona"}</span>
          <span class="a ${diff>=0?"green":"red"}">${fmt(Math.abs(diff))}</span>
        </div>
      </div>`;
  }

  const tagTipo = tipo==="reembolso" ? "Reembolso" : "Adelanto";
  const subt = tipo==="reembolso" ? (r.concepto||"Gastos a devolver") : (r.concepto||"Adelanto");

  app.innerHTML = `
    <header style="background:${p.color};padding-bottom:24px">
      <div class="hdr-top"><button class="icon-btn" onclick="closeRend()">${ICONS.back}</button><button class="icon-btn" onclick="delRend('${r.id}')">${ICONS.trash}</button></div>
      <div style="margin-top:14px">
        <div style="font-size:12px;opacity:.85">${tagTipo} de</div>
        <div style="font-size:22px;font-weight:600">${esc(r.persona||"Sin persona")}</div>
        <div style="font-size:13px;opacity:.85;margin-top:2px">${esc(subt)} · ${r.fecha}</div>
      </div>
    </header>
    <div class="body" style="margin-top:-10px">
      ${resumenHTML}
      <div class="sec-head"><span class="t">${tipo==="reembolso"?"Gastos de la persona":"Gastos rendidos"}</span><button class="add-sm" onclick="openItemForm('${r.id}')">${ICONS.plus} Agregar</button></div>
      <div class="list">${itemsHTML}</div>
      ${extraSección}
    </div>`;
}

/* ============================ MODALES BASE ========================= */
function modal(html){
  const d=document.createElement("div"); d.className="overlay"; d.id="overlay";
  d.innerHTML=`<div class="sheet" onclick="event.stopPropagation()">${html}</div>`;
  d.onclick=closeModal; document.body.appendChild(d);
}
function closeModal(){ const o=document.getElementById("overlay"); if(o) o.remove(); }
function dataList(){ return `<datalist id="people">${peopleList().map(p=>`<option value="${esc(p)}">`).join("")}</datalist>`; }

/* ============================ MOVIMIENTOS ========================== */
function openForm(){ state.tab==="mov"?openTxForm():openRendForm(); }

function openTxForm(){
  const p=activeProfile();
  modal(`
    <div class="sheet-head"><h2>Nuevo movimiento</h2><button class="close-btn" onclick="closeModal()">${ICONS.x}</button></div>
    <div class="seg">
      <button id="bg" class="gasto on" onclick="segType('gasto')">gasto</button>
      <button id="bi" class="ingreso" onclick="segType('ingreso')">ingreso</button>
    </div>
    <div class="field"><label>Monto (S/)</label><input id="amt" type="number" inputmode="decimal" placeholder="0.00"></div>
    <div class="field"><label>Categoría</label><select id="cat">${CATS.gasto.map(c=>`<option>${c}</option>`).join("")}</select></div>
    <div class="field"><label>Persona (nombre y apellido)</label><input id="person" list="people" placeholder="Ej. Juan Pérez">${dataList()}</div>
    <div class="field"><label>Fecha</label><input id="date" type="date" value="${todayISO()}"></div>
    <div class="field"><label>Nota (opcional)</label><input id="note" placeholder="Detalle…"></div>
    <button class="primary" style="background:${p.color}" id="savebtn" onclick="saveTx()">Guardar</button>`);
  window._txType="gasto";
}
function segType(t){
  window._txType=t;
  document.getElementById("bg").className="gasto"+(t==="gasto"?" on":"");
  document.getElementById("bi").className="ingreso"+(t==="ingreso"?" on":"");
  document.getElementById("cat").innerHTML=CATS[t].map(c=>`<option>${c}</option>`).join("");
}
async function saveTx(){
  const amt=parseFloat(document.getElementById("amt").value);
  if(!amt||amt<=0){ document.getElementById("amt").focus(); return; }
  const btn=document.getElementById("savebtn"); btn.disabled=true; btn.textContent="Guardando…";
  const { error } = await sb.from("movimientos").insert({
    perfil_id: state.active, tipo: window._txType, monto: amt,
    categoria: document.getElementById("cat").value, fecha: document.getElementById("date").value,
    persona: document.getElementById("person").value.trim(), nota: document.getElementById("note").value.trim(),
    creado_por: state.user.id,
  });
  if(error){ btn.disabled=false; btn.textContent="Guardar"; alert("No se pudo guardar: "+error.message); return; }
  closeModal(); await loadProfileData(); render();
}
async function delTx(id){
  if(!confirm("¿Eliminar este movimiento?")) return;
  await sb.from("movimientos").delete().eq("id", id);
  await loadProfileData(); render();
}

/* ============================ RENDICIONES ========================== */
function openRendForm(){
  const p=activeProfile();
  modal(`
    <div class="sheet-head"><h2>Nueva rendición</h2><button class="close-btn" onclick="closeModal()">${ICONS.x}</button></div>
    <p class="note">Elige el tipo según cómo se mueve el dinero.</p>
    <div class="seg" style="flex-direction:column;gap:8px">
      <button id="ta" class="ingreso on" style="text-transform:none;text-align:left;padding:12px 14px" onclick="segRend('adelanto')">
        <strong>Entrego dinero (adelanto)</strong><br><span style="font-weight:400;font-size:12px">Doy un monto, la persona gasta y rinde. Devuelve o le reembolso.</span>
      </button>
      <button id="tr" class="gasto" style="text-transform:none;text-align:left;padding:12px 14px" onclick="segRend('reembolso')">
        <strong>Me pasan gastos (reembolso)</strong><br><span style="font-weight:400;font-size:12px">La persona ya gastó de su bolsillo. Yo le devuelvo el total.</span>
      </button>
    </div>
    <div class="field"><label>Persona (nombre y apellido)</label><input id="rperson" list="people" placeholder="Ej. Juan Pérez">${dataList()}</div>
    <div class="field" id="advfield"><label>Monto entregado (S/)</label><input id="radv" type="number" inputmode="decimal" placeholder="0.00"></div>
    <div class="field"><label>Concepto</label><input id="rconcept" placeholder="Ej. Compra de insumos"></div>
    <div class="field"><label>Fecha</label><input id="rdate" type="date" value="${todayISO()}"></div>
    <button class="primary" style="background:${p.color}" id="rbtn" onclick="saveRend()">Crear rendición</button>`);
  window._rendType="adelanto";
}
function segRend(t){
  window._rendType=t;
  document.getElementById("ta").className="ingreso"+(t==="adelanto"?" on":"");
  document.getElementById("tr").className="gasto"+(t==="reembolso"?" on":"");
  document.getElementById("advfield").style.display = t==="reembolso" ? "none" : "block";
}
async function saveRend(){
  const tipo=window._rendType||"adelanto";
  const person=document.getElementById("rperson").value.trim();
  if(!person){ document.getElementById("rperson").focus(); return; }
  let adv=0;
  if(tipo==="adelanto"){
    adv=parseFloat(document.getElementById("radv").value);
    if(!adv||adv<=0){ document.getElementById("radv").focus(); return; }
  }
  const btn=document.getElementById("rbtn"); btn.disabled=true; btn.textContent="Creando…";
  const { data, error } = await sb.from("rendiciones").insert({
    perfil_id: state.active, tipo, persona: person, adelanto: adv,
    concepto: document.getElementById("rconcept").value.trim(), fecha: document.getElementById("rdate").value,
    items: [], pagos: [], creado_por: state.user.id,
  }).select().single();
  if(error){ btn.disabled=false; btn.textContent="Crear rendición"; alert("No se pudo crear: "+error.message); return; }
  closeModal(); await loadProfileData(); state.openRend=data.id; render();
}
async function delRend(id){
  if(!confirm("¿Eliminar esta rendición y todos sus gastos?")) return;
  await sb.from("rendiciones").delete().eq("id", id);
  state.openRend=null; await loadProfileData(); render();
}

function openItemForm(rid){
  const p=activeProfile();
  modal(`
    <div class="sheet-head"><h2>Gasto rendido</h2><button class="close-btn" onclick="closeModal()">${ICONS.x}</button></div>
    <div class="field"><label>Monto (S/)</label><input id="iamt" type="number" inputmode="decimal" placeholder="0.00"></div>
    <div class="field"><label>Categoría</label><select id="icat">${CATS.gasto.map(c=>`<option>${c}</option>`).join("")}</select></div>
    <div class="field"><label>Fecha</label><input id="idate" type="date" value="${todayISO()}"></div>
    <div class="field"><label>Nota / N° comprobante (opcional)</label><input id="inote" placeholder="Ej. Factura F001-123"></div>
    <button class="primary" style="background:${p.color}" id="ibtn" onclick="saveItem('${rid}')">Agregar gasto</button>`);
}
async function saveItem(rid){
  const amt=parseFloat(document.getElementById("iamt").value);
  if(!amt||amt<=0) return;
  const r=state.rends.find(x=>x.id===rid); if(!r) return;
  const btn=document.getElementById("ibtn"); btn.disabled=true; btn.textContent="Agregando…";
  const items=[...(r.items||[]), {
    id: Date.now().toString(36)+Math.random().toString(36).slice(2,7),
    amount: amt, category: document.getElementById("icat").value,
    date: document.getElementById("idate").value, note: document.getElementById("inote").value.trim(),
  }];
  const { error } = await sb.from("rendiciones").update({ items }).eq("id", rid);
  if(error){ btn.disabled=false; btn.textContent="Agregar gasto"; alert("No se pudo agregar: "+error.message); return; }
  closeModal(); await loadProfileData(); render();
}
async function delItem(rid,iid){
  const r=state.rends.find(x=>x.id===rid); if(!r) return;
  const items=(r.items||[]).filter(i=>i.id!==iid);
  await sb.from("rendiciones").update({ items }).eq("id", rid);
  await loadProfileData(); render();
}

/* ---- Pagos a la persona (solo reembolso) ---- */
function openPagoForm(rid){
  const p=activeProfile();
  modal(`
    <div class="sheet-head"><h2>Registrar pago</h2><button class="close-btn" onclick="closeModal()">${ICONS.x}</button></div>
    <p class="note">Monto que le entregaste a la persona como parte de la devolución.</p>
    <div class="field"><label>Monto (S/)</label><input id="pamt" type="number" inputmode="decimal" placeholder="0.00"></div>
    <div class="field"><label>Fecha</label><input id="pdate" type="date" value="${todayISO()}"></div>
    <div class="field"><label>Nota (opcional)</label><input id="pnote" placeholder="Ej. Transferencia, efectivo…"></div>
    <button class="primary" style="background:${p.color}" id="pbtn" onclick="savePago('${rid}')">Registrar pago</button>`);
}
async function savePago(rid){
  const amt=parseFloat(document.getElementById("pamt").value);
  if(!amt||amt<=0) return;
  const r=state.rends.find(x=>x.id===rid); if(!r) return;
  const btn=document.getElementById("pbtn"); btn.disabled=true; btn.textContent="Registrando…";
  const pagos=[...(r.pagos||[]), {
    id: Date.now().toString(36)+Math.random().toString(36).slice(2,7),
    amount: amt, date: document.getElementById("pdate").value, note: document.getElementById("pnote").value.trim(),
  }];
  const { error } = await sb.from("rendiciones").update({ pagos }).eq("id", rid);
  if(error){ btn.disabled=false; btn.textContent="Registrar pago"; alert("No se pudo registrar: "+error.message); return; }
  closeModal(); await loadProfileData(); render();
}
async function delPago(rid,pid){
  const r=state.rends.find(x=>x.id===rid); if(!r) return;
  const pagos=(r.pagos||[]).filter(x=>x.id!==pid);
  await sb.from("rendiciones").update({ pagos }).eq("id", rid);
  await loadProfileData(); render();
}

/* ============================ PERFILES ============================= */
function openProfiles(){
  const rows=state.profiles.map(p=>`
    <div class="prof-row ${p.id===state.active?"on":""}" onclick="pickProfile('${p.id}')">
      <div class="dot" style="background:${p.color}"></div>
      <span class="prof-name" style="font-weight:${p.id===state.active?600:400}">
        ${esc(p.nombre)}
        ${p.compartido?`<span class="mini-tag">Compartido</span>`:`<span class="mini-tag">Privado</span>`}
      </span>
      ${isOwner(p)?`<button class="manage-link" onclick="event.stopPropagation();openManage('${p.id}')">${p.compartido?"Miembros":""}</button>`:``}
      ${isOwner(p)&&state.profiles.length>1?`<button class="del-btn" onclick="event.stopPropagation();removeProfile('${p.id}')">${ICONS.trash}</button>`:""}
    </div>`).join("");
  modal(`
    <div class="sheet-head"><h2>Mis perfiles</h2><button class="close-btn" onclick="closeModal()">${ICONS.x}</button></div>
    <div style="margin-bottom:16px">${rows}</div>
    <div class="field"><label>Nuevo perfil</label><input id="newprof" placeholder="Ej. Emprendimiento 1"></div>
    <label class="check-row" onclick="event.stopPropagation()">
      <input type="checkbox" id="newshared">
      <span><span class="ct">Compartido con la familia</span><br><span class="cs">Otros miembros podrán verlo y editarlo</span></span>
    </label>
    <button class="primary" style="background:#1a1a1a" onclick="addProfile()">Crear perfil</button>
    <p class="hint">Los perfiles privados solo los ves tú. En los compartidos, agrega miembros con el botón "Miembros".</p>`);
}
async function pickProfile(id){ state.active=id; closeModal(); await loadProfileData(); render(); }

async function addProfile(){
  const inp=document.getElementById("newprof"); const n=inp.value.trim(); if(!n) return;
  const shared=document.getElementById("newshared").checked;
  const { data, error } = await sb.from("perfiles").insert({
    nombre:n, color:PALETTE[state.profiles.length%PALETTE.length], compartido:shared, owner_id: state.user.id,
  }).select().single();
  if(error){ alert("No se pudo crear: "+error.message); return; }
  await loadProfiles(); state.active=data.id; closeModal();
  await loadProfileData(); render();
}

async function removeProfile(id){
  if(!confirm("¿Eliminar este perfil con todos sus movimientos y rendiciones? No se puede deshacer.")) return;
  await sb.from("perfiles").delete().eq("id", id);
  await loadProfiles();
  if(state.active===id) state.active=state.profiles[0]?.id||null;
  closeModal(); await loadProfileData(); render();
}

/* ============================ GESTIÓN DE MIEMBROS ================== */
async function openManage(pid){
  const p=state.profiles.find(x=>x.id===pid); if(!p) return;
  const { data: miembros } = await sb.from("miembros_perfil").select("*").eq("perfil_id", pid);
  const rows = (miembros||[]).length===0
    ? `<p class="hint" style="margin:0 0 14px">Aún no has agregado a nadie. Cada miembro debe tener su propia cuenta en la app.</p>`
    : (miembros||[]).map(m=>`
        <div class="prof-row">
          <div class="dot" style="background:#999"></div>
          <span class="prof-name" style="font-size:13px">${esc(m.user_id)}</span>
          <button class="del-btn" onclick="removeMember('${m.id}','${pid}')">${ICONS.trash}</button>
        </div>`).join("");
  modal(`
    <div class="sheet-head"><h2>Miembros de "${esc(p.nombre)}"</h2><button class="close-btn" onclick="closeModal()">${ICONS.x}</button></div>
    <div style="margin-bottom:16px">${rows}</div>
    <div class="field"><label>Agregar por correo</label><input id="m_email" type="email" placeholder="correo@delmiembro.com"></div>
    <button class="primary" style="background:#1a1a1a" id="mbtn" onclick="addMember('${pid}')">Agregar miembro</button>
    <p class="hint">El miembro debe haberse registrado antes en la app con ese correo. Al agregarlo, verá este perfil compartido en tiempo real.</p>`);
}
async function addMember(pid){
  const email=document.getElementById("m_email").value.trim().toLowerCase();
  if(!email) return;
  const btn=document.getElementById("mbtn"); btn.disabled=true; btn.textContent="Agregando…";
  // Buscar el user_id por correo mediante una función RPC segura
  const { data: uid, error: e1 } = await sb.rpc("buscar_usuario_por_correo", { correo: email });
  if(e1 || !uid){
    btn.disabled=false; btn.textContent="Agregar miembro";
    alert("No se encontró una cuenta con ese correo. Pide a la persona que se registre primero en la app.");
    return;
  }
  const { error: e2 } = await sb.from("miembros_perfil").insert({ perfil_id: pid, user_id: uid });
  if(e2){
    btn.disabled=false; btn.textContent="Agregar miembro";
    alert(/duplicate/i.test(e2.message) ? "Esa persona ya es miembro." : "No se pudo agregar: "+e2.message);
    return;
  }
  openManage(pid);
}
async function removeMember(mid, pid){
  await sb.from("miembros_perfil").delete().eq("id", mid);
  openManage(pid);
}

/* ============================ CUENTA =============================== */
function openAccount(){
  const name = state.user?.user_metadata?.full_name || "—";
  const email = state.user?.email || "—";
  modal(`
    <div class="sheet-head"><h2>Mi cuenta</h2><button class="close-btn" onclick="closeModal()">${ICONS.x}</button></div>
    <div class="card">
      <div class="line"><span>Nombre</span><span>${esc(name)}</span></div>
      <div class="line"><span>Correo</span><span>${esc(email)}</span></div>
    </div>
    <button class="primary" style="background:#993C1D" onclick="doLogout()">Cerrar sesión</button>`);
}

/* ============================ NAVEGACIÓN =========================== */
function setTab(t){ state.tab=t; render(); }
function setMonth(m){ state.monthFilter=m; render(); }
function openRend(id){ state.openRend=id; render(); }
function closeRend(){ state.openRend=null; render(); }
