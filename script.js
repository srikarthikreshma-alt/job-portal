const jobs = [
  {id:1,title:"Frontend Developer",company:"PixelCraft Studio",initial:"P",color:"#e9f1ff",ink:"#3863a6",location:"Bengaluru, India",salary: "₹6–10 LPA",salaryValue:10,work:"Hybrid",type:"Full-time",experience:"Entry level",posted:"2 days ago",description:"Build responsive, accessible web experiences and work closely with designers to bring product ideas to life.",tags:["React","JavaScript","CSS"]},
  {id:2,title:"UI/UX Designer",company:"Northstar Labs",initial:"N",color:"#f5eaff",ink:"#8053a8",location:"Remote · India",salary:"₹5–8 LPA",salaryValue:8,work:"Remote",type:"Full-time",experience:"Mid level",posted:"1 day ago",description:"Shape intuitive user journeys, create wireframes and prototypes, and collaborate with product teams.",tags:["Figma","Prototyping","User research"]},
  {id:3,title:"Data Analyst Intern",company:"BrightMetrics",initial:"B",color:"#fff0dc",ink:"#b87931",location:"Hyderabad, India",salary:"₹18k–25k / month",salaryValue:3,work:"On-site",type:"Internship",experience:"Entry level",posted:"3 days ago",description:"Turn data into useful insights through analysis, dashboards, and clear communication with stakeholders.",tags:["SQL","Python","Excel"]},
  {id:4,title:"Backend Developer",company:"CloudPeak Technologies",initial:"C",color:"#e2f5ee",ink:"#36846a",location:"Pune, India",salary:"₹8–14 LPA",salaryValue:14,work:"Hybrid",type:"Full-time",experience:"Mid level",posted:"Today",description:"Design reliable APIs and services, improve system performance, and help build scalable applications.",tags:["Node.js","APIs","PostgreSQL"]},
  {id:5,title:"Digital Marketing Associate",company:"GoodLoop Media",initial:"G",color:"#ffe9ed",ink:"#b65c70",location:"Chennai, India",salary:"₹4–6 LPA",salaryValue:6,work:"On-site",type:"Full-time",experience:"Entry level",posted:"5 days ago",description:"Support campaigns across digital channels, track performance, and help create engaging content.",tags:["SEO","Content","Analytics"]},
  {id:6,title:"Product Designer",company:"Orbit Works",initial:"O",color:"#e8efff",ink:"#526db0",location:"Remote · India",salary:"₹10–16 LPA",salaryValue:16,work:"Remote",type:"Contract",experience:"Senior level",posted:"4 days ago",description:"Own end-to-end product design for thoughtful digital tools, from early concepts to polished handoff.",tags:["Product design","Figma","Design systems"]}
];
const jobList=document.getElementById("jobList"), resultCount=document.getElementById("resultCount");
const keywordInput=document.getElementById("keywordInput"), locationInput=document.getElementById("locationInput");
const dialog=document.getElementById("applyDialog"), toast=document.getElementById("toast");
let activeJob=null, toastTimer;
function selected(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value)}
function renderJobs(){
  const q=keywordInput.value.trim().toLowerCase(), loc=locationInput.value.trim().toLowerCase();
  const types=selected("type"), places=selected("workplace"), levels=selected("experience");
  let filtered=jobs.filter(j=>{
    const text=[j.title,j.company,j.description,...j.tags].join(" ").toLowerCase();
    return (!q||text.includes(q)|| (q==="remote"&&j.work==="Remote")) &&
      (!loc||j.location.toLowerCase().includes(loc)||j.work.toLowerCase().includes(loc)) &&
      (!types.length||types.includes(j.type)) && (!places.length||places.includes(j.work)) && (!levels.length||levels.includes(j.experience));
  });
  if(document.getElementById("sortSelect").value==="salary") filtered.sort((a,b)=>b.salaryValue-a.salaryValue);
  resultCount.textContent=`Showing ${filtered.length} ${filtered.length===1?"job":"jobs"}`;
  jobList.innerHTML=filtered.map(j=>`
    <article class="job-card">
      <div class="job-card-top">
        <div class="company-logo" style="background:${j.color};color:${j.ink}">${j.initial}</div>
        <div class="job-title-wrap"><h3>${j.title}</h3><div class="company-line">${j.company} <span>·</span> ${j.location}</div></div>
        <button class="save-job" data-save="${j.id}" aria-label="Save ${j.title}" title="Save job">♡</button>
      </div>
      <p class="job-description">${j.description}</p>
      <div class="job-tags"><span>${j.type}</span><span>${j.work}</span><span>${j.experience}</span>${j.tags.map(t=>`<span>${t}</span>`).join("")}</div>
      <div class="job-card-bottom"><div><div class="salary">${j.salary} <small>/ estimated</small></div><div class="job-meta">Posted ${j.posted}</div></div><button class="apply-button" data-apply="${j.id}">Apply now ↗</button></div>
    </article>`).join("");
  document.getElementById("emptyState").hidden=filtered.length>0;
  jobList.hidden=filtered.length===0;
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();renderJobs();document.getElementById("jobs").scrollIntoView({behavior:"smooth"})});
[keywordInput,locationInput].forEach(el=>el.addEventListener("input",renderJobs));
document.querySelectorAll('input[type="checkbox"]').forEach(el=>el.addEventListener("change",renderJobs));
document.getElementById("sortSelect").addEventListener("change",renderJobs);
document.getElementById("clearFilters").addEventListener("click",()=>{document.querySelectorAll('input[type="checkbox"]').forEach(x=>x.checked=false);keywordInput.value="";locationInput.value="";renderJobs()});
document.getElementById("resetSearch").addEventListener("click",()=>{document.getElementById("clearFilters").click()});
document.querySelectorAll("[data-search]").forEach(btn=>btn.addEventListener("click",()=>{keywordInput.value=btn.dataset.search;locationInput.value="";renderJobs();document.getElementById("jobs").scrollIntoView({behavior:"smooth"})}));
jobList.addEventListener("click",e=>{
  const save=e.target.closest("[data-save]"), apply=e.target.closest("[data-apply]");
  if(save){save.classList.toggle("saved");save.textContent=save.classList.contains("saved")?"♥":"♡";showToast(save.classList.contains("saved")?"Job saved to your list":"Job removed from saved list")}
  if(apply){activeJob=jobs.find(j=>j.id===Number(apply.dataset.apply));document.getElementById("dialogJobTitle").textContent=`${activeJob.title} · ${activeJob.company}`;dialog.showModal()}
});
document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
document.getElementById("applicationForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!e.currentTarget.reportValidity())return;
  dialog.close();e.currentTarget.reset();showToast("Thanks! This demo application has been completed.");
});
document.querySelector(".menu-toggle").addEventListener("click",()=>document.querySelector(".nav-links").classList.toggle("open"));
renderJobs();