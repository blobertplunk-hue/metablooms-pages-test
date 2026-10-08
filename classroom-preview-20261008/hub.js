(()=>{
  "use strict";
  const hubScriptUrl=document.currentScript && document.currentScript.src;
  const hubBaseUrl=hubScriptUrl ? new URL(".",hubScriptUrl) : new URL("./",window.location.href);
  const raw=window.METABLOOMS_ACTIVITY_CATALOG;
  const catalog=raw&&Array.isArray(raw.activities)?raw.activities:[];
  const body=document.body;
  const initialKind=body.dataset.viewKind||"all";
  const initialValue=body.dataset.viewValue||"";
  const state={query:"",subject:initialKind==="subject"?initialValue:"all",type:initialKind==="type"?initialValue:"all"};
  const grid=document.getElementById("activity-grid"), empty=document.getElementById("empty-state"), count=document.getElementById("result-count"), search=document.getElementById("activity-search");
  const subjectRow=document.getElementById("subject-filters"), typeRow=document.getElementById("type-filters");
  const titleCase=s=>String(s||"").split("-").map(x=>x?x[0].toUpperCase()+x.slice(1):x).join(" ");
  const uniq=xs=>[...new Set(xs)].sort((a,b)=>a.localeCompare(b));
  const subjectValues=uniq(catalog.map(x=>x.subject));
  const typeValues=uniq(catalog.map(x=>x.type));
  function button(label,value,kind){const b=document.createElement("button");b.type="button";b.className="filter-button";b.textContent=label;b.dataset.value=value;b.setAttribute("aria-pressed",String(state[kind]===value));b.addEventListener("click",()=>{state[kind]=value;renderControls();renderCards();});return b;}
  function renderControls(){subjectRow.replaceChildren(button("All subjects","all","subject"),...subjectValues.map(v=>button(titleCase(v),v,"subject")));typeRow.replaceChildren(button("All types","all","type"),...typeValues.map(v=>button(titleCase(v),v,"type")));}
  function searchable(a){return [a.title,a.subject,a.unit,a.type,...(a.skills||[]),...(a.tags||[])].filter(Boolean).join(" ").toLowerCase();}
  function visible(a){if(state.subject!=="all"&&a.subject!==state.subject)return false;if(state.type!=="all"&&a.type!==state.type)return false;const q=state.query.trim().toLowerCase();return !q||searchable(a).includes(q);}
  function makeCard(a){const el=document.createElement("a");el.className="card";el.href=new URL(String(a.route).replace(/^\/+/, ""),hubBaseUrl).href;el.dataset.activityId=a.id;const meta=document.createElement("div");meta.className="card-meta";[titleCase(a.subject),titleCase(a.type),`Grade ${a.grade}`].forEach(t=>{const s=document.createElement("span");s.className="pill";s.textContent=t;meta.appendChild(s)});const h=document.createElement("h2");h.textContent=a.title;const u=document.createElement("div");u.className="unit";u.textContent=a.unit||"Classroom activity";const sk=document.createElement("p");sk.className="skills";sk.textContent=(a.skills||[]).slice(0,4).join(" · ");const launch=document.createElement("div");launch.className="launch";launch.textContent="Open activity →";el.append(meta,h,u,sk,launch);return el;}
  function renderCards(){const items=catalog.filter(visible);grid.replaceChildren(...items.map(makeCard));count.textContent=String(items.length);empty.hidden=items.length!==0;}
  search.addEventListener("input",()=>{state.query=search.value;renderCards();});
  renderControls();renderCards();
})();
