const seedTickets = [
  {id:1,title:"Parental leave documentation",requester:"Maya L.",category:"Leave",priority:"High",status:"Open",description:"Needs guidance on required documents and timing."},
  {id:2,title:"Access card replacement",requester:"Leo A.",category:"Workplace",priority:"Medium",status:"In progress",description:"Card was lost during commute to Stockholm HQ."},
  {id:3,title:"Benefit portal login",requester:"Sara N.",category:"Benefits",priority:"Low",status:"Open",description:"Unable to access the employee benefit portal."},
  {id:4,title:"Update bank details",requester:"Oliver K.",category:"Payroll",priority:"High",status:"In progress",description:"Needs payroll profile updated before next cut off."},
  {id:5,title:"Hybrid work guidance",requester:"Noah P.",category:"Policy",priority:"Medium",status:"Resolved",description:"Asked for current team coordination expectations."},
  {id:6,title:"Course access request",requester:"Emma W.",category:"Learning",priority:"Low",status:"Open",description:"Needs enrollment in mandatory safety training."},
  {id:7,title:"Vacation balance question",requester:"Amir R.",category:"Leave",priority:"Medium",status:"Resolved",description:"Requested explanation of available days."},
  {id:8,title:"Employment certificate",requester:"Lina S.",category:"Documents",priority:"Medium",status:"Open",description:"Needs a certificate for a housing application."}
];
const seedPolicies = [
  {icon:"🌴",title:"Vacation & Time Off",region:"Nordics",updated:"2 days ago",text:"Employees should request planned vacation through the approved HR workflow and align timing with their manager. Local rules and balances apply."},
  {icon:"👶",title:"Parental Leave",region:"Nordics + UK",updated:"1 week ago",text:"Parental leave support depends on local legislation. Notify People Operations early so documentation, payroll and coverage can be coordinated."},
  {icon:"🏡",title:"Hybrid Working",region:"Global",updated:"3 days ago",text:"Office attendance is coordinated with each team based on collaboration needs, role requirements and local practicalities."},
  {icon:"💚",title:"Benefits Overview",region:"Global",updated:"5 days ago",text:"Available benefits are listed in the employee portal. Eligibility may differ by country, contract and working hours."},
  {icon:"🔐",title:"Data & Privacy",region:"EU + UK",updated:"Today",text:"People data must be accurate, access controlled and processed only for legitimate business purposes in line with applicable privacy rules."},
  {icon:"🎓",title:"Learning & Courses",region:"Global",updated:"2 weeks ago",text:"Mandatory and optional learning can be assigned through the internal course workflow. Completion status is tracked by the People team."}
];
const seedStarters = [
  {id:1,name:"Elsa Berg",role:"Operations Associate",start:"Aug 3",progress:75,tasks:[true,true,true,false]},
  {id:2,name:"Tom Evans",role:"Regional Analyst",start:"Aug 10",progress:50,tasks:[true,true,false,false]},
  {id:3,name:"Aisha Khan",role:"People Coordinator",start:"Aug 17",progress:25,tasks:[true,false,false,false]}
];
const seedCourses = [
  {id:1,title:"Inclusive Collaboration",owner:"People & Culture",participants:48,completion:84,emoji:"🤝"},
  {id:2,title:"Data Privacy Essentials",owner:"Legal + P&C",participants:72,completion:69,emoji:"🔐"},
  {id:3,title:"Service Desk Basics",owner:"People Ops",participants:18,completion:94,emoji:"🎫"}
];

let tickets = JSON.parse(localStorage.getItem("voiTickets")) || seedTickets;
let policies = JSON.parse(localStorage.getItem("voiPolicies")) || seedPolicies;
let starters = JSON.parse(localStorage.getItem("voiStarters")) || seedStarters;
let courses = JSON.parse(localStorage.getItem("voiCourses")) || seedCourses;
let currentFilter = "all";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const save = () => {
  localStorage.setItem("voiTickets",JSON.stringify(tickets));
  localStorage.setItem("voiPolicies",JSON.stringify(policies));
  localStorage.setItem("voiStarters",JSON.stringify(starters));
  localStorage.setItem("voiCourses",JSON.stringify(courses));
};
const toast = msg => { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2400); };

function navigate(view){
  $$(".view").forEach(v=>v.classList.remove("active"));
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
  $("#"+view).classList.add("active");
  const titles={dashboard:"Good morning, Dania 👋",assistant:"People AI Assistant",tickets:"P&C Service Desk",policies:"Policy Library",onboarding:"Onboarding Journeys",courses:"Learning Operations",analytics:"People Analytics"};
  $("#pageTitle").textContent=titles[view];
  $("#sidebar").classList.remove("open");
  if(view==="analytics") setTimeout(drawChart,50);
}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));
$("#mobileMenu").onclick=()=>$("#sidebar").classList.toggle("open");
$("#themeToggle").onclick=()=>document.body.classList.toggle("dark");

function statusClass(status){return status.toLowerCase().replaceAll(" ","-");}
function renderDashboardTickets(){
  const target=$("#dashboardTickets");
  target.innerHTML=tickets.filter(t=>t.status!=="Resolved").slice(0,4).map(t=>`<div class="ticket-row"><div class="ticket-icon">${t.category==="Leave"?"🌴":t.category==="Benefits"?"💚":"◫"}</div><div><strong>${t.title}</strong><small>${t.requester} · ${t.category}</small></div><span class="status ${statusClass(t.status)}">${t.status}</span><span class="priority">${t.priority}</span></div>`).join("");
  $("#openCount").textContent=tickets.filter(t=>t.status!=="Resolved").length;
}
function renderTickets(){
  const search=($("#ticketSearch")?.value||"").toLowerCase();
  const filtered=tickets.filter(t=>(currentFilter==="all"||t.status===currentFilter)&&(`${t.title} ${t.requester} ${t.category}`.toLowerCase().includes(search)));
  const statuses=["Open","In progress","Resolved"];
  $("#ticketBoard").innerHTML=statuses.map(s=>`<div class="ticket-column"><div class="column-head">${s}<span>${filtered.filter(t=>t.status===s).length}</span></div>${filtered.filter(t=>t.status===s).map(t=>`<article class="ticket-card" data-ticket="${t.id}"><span class="tag">${t.category}</span><h4>${t.title}</h4><p>${t.description}</p><div class="ticket-meta"><span>${t.requester}</span><span>${t.priority}</span></div></article>`).join("")||`<p style="color:var(--muted);font-size:12px;padding:10px">No requests here.</p>`}</div>`).join("");
  $$('[data-ticket]').forEach(c=>c.onclick=()=>openTicket(Number(c.dataset.ticket)));
  renderDashboardTickets(); save();
}
$$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentFilter=b.dataset.filter;renderTickets();});
$("#ticketSearch").oninput=renderTickets;

function modal(html){$("#modalContent").innerHTML=html;$("#modalBackdrop").hidden=false;}
function closeModal(){$("#modalBackdrop").hidden=true;}
$("#modalClose").onclick=closeModal;$("#modalBackdrop").addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});

function newTicketModal(){modal(`<h2>Create a new request</h2><form id="ticketForm" class="form-grid"><label>Request title<input name="title" required placeholder="e.g. Benefits portal access"></label><label>Requester<input name="requester" required placeholder="Employee name"></label><label>Category<select name="category"><option>Leave</option><option>Benefits</option><option>Payroll</option><option>Policy</option><option>Learning</option><option>Documents</option><option>Workplace</option></select></label><label>Priority<select name="priority"><option>Low</option><option selected>Medium</option><option>High</option></select></label><label>Description<textarea name="description" required placeholder="Add the key details..."></textarea></label><button class="primary-btn">Create request</button></form>`);$("#ticketForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);tickets.unshift({id:Date.now(),title:f.get('title'),requester:f.get('requester'),category:f.get('category'),priority:f.get('priority'),status:'Open',description:f.get('description')});renderTickets();closeModal();toast('Request created ✨');};}
$("#newTicketBtn").onclick=newTicketModal;$("#newTicketBtn2").onclick=newTicketModal;

function openTicket(id){const t=tickets.find(x=>x.id===id);modal(`<p class="eyebrow">${t.category} · ${t.priority} PRIORITY</p><h2>${t.title}</h2><p style="color:var(--muted);line-height:1.6">${t.description}</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0"><div class="insight-box"><small>Requester</small><strong style="display:block;margin-top:5px">${t.requester}</strong></div><div class="insight-box"><small>Status</small><strong style="display:block;margin-top:5px">${t.status}</strong></div></div><div style="display:flex;gap:10px"><button class="secondary-btn" id="suggestReply">✦ Suggest reply</button>${t.status!=="Resolved"?'<button class="primary-btn" id="resolveTicket">Mark resolved</button>':''}</div><div id="replyBox"></div>`);$("#suggestReply").onclick=()=>{$("#replyBox").innerHTML=`<div class="insight-box" style="margin-top:16px"><strong>Suggested response</strong><p>Hi ${t.requester.split(' ')[0]}, thanks for reaching out. I have reviewed your request regarding ${t.title.toLowerCase()}. I am checking the relevant process and will make sure you receive a clear update shortly.</p></div>`};if($("#resolveTicket"))$("#resolveTicket").onclick=()=>{t.status='Resolved';renderTickets();closeModal();toast('Request resolved 💚');};}

function renderPolicies(filter=""){$("#policyGrid").innerHTML=policies.filter(p=>(p.title+p.text+p.region).toLowerCase().includes(filter.toLowerCase())).map((p,i)=>`<article class="policy-card" data-policy="${i}"><div class="policy-icon">${p.icon}</div><h3>${p.title}</h3><p>${p.text}</p><div class="policy-meta"><span>${p.region}</span><span>Updated ${p.updated}</span></div></article>`).join("")||'<p>No matching policies found.</p>';$$('[data-policy]').forEach(c=>c.onclick=()=>{const p=policies[c.dataset.policy];modal(`<p class="eyebrow">${p.region}</p><h2>${p.icon} ${p.title}</h2><p style="line-height:1.7;color:var(--muted)">${p.text}</p><div class="insight-box"><strong>Important</strong><p>This is a concept demo, not official Voi policy or legal advice.</p></div>`)});}
$("#policySearchInput").oninput=e=>renderPolicies(e.target.value);
$("#addPolicyBtn").onclick=()=>{modal(`<h2>Add a demo policy</h2><form id="policyForm" class="form-grid"><label>Title<input name="title" required></label><label>Region<input name="region" value="Global" required></label><label>Summary<textarea name="text" required></textarea></label><button class="primary-btn">Add policy</button></form>`);$("#policyForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);policies.unshift({icon:'📄',title:f.get('title'),region:f.get('region'),updated:'just now',text:f.get('text')});save();renderPolicies();closeModal();toast('Policy added');};};

function renderStarters(){
  $("#starterGrid").innerHTML=starters.map(s=>`<article class="starter-card"><div class="starter-top"><div class="starter-avatar">${s.name.split(' ').map(x=>x[0]).join('')}</div><span class="tag">Starts ${s.start}</span></div><h3>${s.name}</h3><p>${s.role}</p><div class="starter-progress"><div class="policy-meta"><span>Journey progress</span><strong>${s.progress}%</strong></div><div class="progress"><span style="width:${s.progress}%"></span></div></div><div class="task-list">${['Contract complete','Equipment ready','Intro meetings','Mandatory learning'].map((t,i)=>`<label class="task-item"><input type="checkbox" data-starter="${s.id}" data-task="${i}" ${s.tasks[i]?'checked':''}> ${t}</label>`).join('')}</div></article>`).join('');
  $$('[data-starter]').forEach(c=>c.onchange=()=>{const s=starters.find(x=>x.id===Number(c.dataset.starter));s.tasks[Number(c.dataset.task)]=c.checked;s.progress=Math.round(s.tasks.filter(Boolean).length/s.tasks.length*100);save();renderStarters();updateOnboard();});
}
function updateOnboard(){const avg=Math.round(starters.reduce((a,s)=>a+s.progress,0)/starters.length);$("#onboardPercent").textContent=avg+'%';}
$("#addStarterBtn").onclick=()=>{modal(`<h2>Add a new starter</h2><form id="starterForm" class="form-grid"><label>Name<input name="name" required></label><label>Role<input name="role" required></label><label>Start date<input name="start" type="date" required></label><button class="primary-btn">Create journey</button></form>`);$("#starterForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);starters.push({id:Date.now(),name:f.get('name'),role:f.get('role'),start:new Date(f.get('start')).toLocaleDateString('en-GB',{month:'short',day:'numeric'}),progress:0,tasks:[false,false,false,false]});save();renderStarters();updateOnboard();closeModal();toast('Onboarding journey created');};};

function renderCourses(){
  $("#courseGrid").innerHTML=courses.map(c=>`<article class="course-card"><div class="course-banner"><span>${c.emoji} ${c.title}</span></div><h3>${c.title}</h3><p>Owner: ${c.owner}</p><div class="course-meta"><span>${c.participants} learners</span><strong>${c.completion}% complete</strong></div><div class="progress"><span style="width:${c.completion}%"></span></div></article>`).join('');
}
$("#newCourseBtn").onclick=()=>{modal(`<h2>Set up a course</h2><form id="courseForm" class="form-grid"><label>Course name<input name="title" required></label><label>Owner<input name="owner" value="People Operations" required></label><label>Participants<input name="participants" type="number" value="20" min="1" required></label><button class="primary-btn">Create course</button></form>`);$("#courseForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);courses.push({id:Date.now(),title:f.get('title'),owner:f.get('owner'),participants:Number(f.get('participants')),completion:0,emoji:'🎓'});save();renderCourses();closeModal();toast('Course created');};};

const answers=[
  {keys:['vacation','holiday','time off'],answer:'To request vacation, open the leave workflow, select your dates and submit it for manager approval. People Operations can help if your balance or local rules are unclear.'},
  {keys:['parental'],answer:'Parental leave depends on local legislation. The best first step is to contact People Operations early so documentation, payroll and team planning can be coordinated.'},
  {keys:['onboarding','new starter'],answer:'The onboarding flow covers contract completion, equipment setup, key introductions and mandatory learning. Progress is visible in the Onboarding area.'},
  {keys:['access card','lost card','card'],answer:'Please create a Workplace request with the date and location where the card was lost. Access can then be blocked and a replacement coordinated.'},
  {keys:['benefit'],answer:'Benefit access and eligibility can vary by location and contract. Check the Benefits policy first, then raise a ticket if the portal or entitlement looks incorrect.'}
];
function askAI(q){const a=answers.find(x=>x.keys.some(k=>q.toLowerCase().includes(k)));return a?a.answer:'I can help with that. Based on the demo knowledge base, the best next step is to create a service request so People Operations can review the details and give an accurate answer.';}
$("#chatForm").onsubmit=e=>{e.preventDefault();const input=$("#chatInput");const q=input.value.trim();if(!q)return;$("#chatMessages").insertAdjacentHTML('beforeend',`<div class="message user"><div><p>${q.replace(/[<>]/g,'')}</p></div></div>`);input.value='';setTimeout(()=>{$("#chatMessages").insertAdjacentHTML('beforeend',`<div class="message bot"><div class="bot-icon">✦</div><div><strong>People AI</strong><p>${askAI(q)}</p><small style="color:var(--muted)">Demo policy match · 96% confidence</small></div></div>`);$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight;},450);};
$$('.suggestion-chips button').forEach(b=>b.onclick=()=>{$("#chatInput").value=b.textContent;$("#chatForm").requestSubmit();});

function renderAnalytics(){
  const cats={};tickets.forEach(t=>cats[t.category]=(cats[t.category]||0)+1);const sorted=Object.entries(cats).sort((a,b)=>b[1]-a[1]);const max=Math.max(...sorted.map(x=>x[1]));$("#categoryList").innerHTML=sorted.slice(0,5).map(([k,v])=>`<div class="category-item"><span>${k}</span><i style="width:${v/max*100}%"></i><strong>${v}</strong></div>`).join('');
  const recs=[['Create leave FAQ flow','Could reduce repeat leave questions by 32%.'],['Add ticket reply templates','Could improve response consistency across the team.'],['Automate onboarding reminders','Could lower overdue starter tasks by 40%.']];$("#recommendationList").innerHTML=recs.map((r,i)=>`<div class="recommendation"><div><strong>${r[0]}</strong><p>${r[1]}</p></div><button class="secondary-btn rec-btn" data-i="${i}">Apply</button></div>`).join('');$$('.rec-btn').forEach(b=>b.onclick=()=>{b.textContent='Applied ✓';b.disabled=true;toast('Improvement added to roadmap');});
}
function drawChart(){const c=$("#lineChart");if(!c)return;const ctx=c.getContext('2d');const dpr=window.devicePixelRatio||1;const w=c.clientWidth,h=240;c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);const vals=[12,18,16,25,22,31,28,38,34,44,41,50];const pad=24;ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--line');ctx.lineWidth=1;for(let i=0;i<5;i++){const y=pad+i*(h-2*pad)/4;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();}const max=55;const pts=vals.map((v,i)=>[pad+i*(w-2*pad)/(vals.length-1),h-pad-v/max*(h-2*pad)]);const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'rgba(0,168,107,.32)');grad.addColorStop(1,'rgba(0,168,107,0)');ctx.beginPath();ctx.moveTo(pts[0][0],h-pad);pts.forEach(p=>ctx.lineTo(...p));ctx.lineTo(pts.at(-1)[0],h-pad);ctx.closePath();ctx.fillStyle=grad;ctx.fill();ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle='#00a86b';ctx.lineWidth=3;ctx.lineJoin='round';ctx.stroke();pts.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],4,0,Math.PI*2);ctx.fillStyle='#00a86b';ctx.fill();});}
window.addEventListener('resize',()=>{if($("#analytics").classList.contains('active'))drawChart();});
$("#periodSelect").onchange=()=>{drawChart();toast('Analytics period updated');};
$("#applySuggestion").onclick=e=>{e.target.textContent='Added to roadmap ✓';e.target.disabled=true;toast('Improvement created');};

$("#globalSearch").addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.trim();if(!q)return;navigate('policies');$("#policySearchInput").value=q;renderPolicies(q);}});

renderTickets();renderPolicies();renderStarters();renderCourses();renderAnalytics();updateOnboard();
