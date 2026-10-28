const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const viewNames = {overview:"Overview",studio:"Profile Studio",identity:"My Identity",orders:"My Orders",analytics:"Analytics",settings:"Settings"};
let currentTheme = "signature";
let toastTimer;

function toast(message){
  const el=$("#toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2500);
}
function showView(name){
  $$(".view").forEach(v=>v.classList.toggle("active-view",v.id===`view-${name}`));
  $$(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  $("#breadcrumbCurrent").textContent=viewNames[name]||"Overview";
  $("#sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-view]").forEach(btn=>btn.addEventListener("click",()=>showView(btn.dataset.view)));
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));

function getProfile(){
 return {
  name:$("#profileName").value.trim()||"Your Name",
  role:$("#profileRole").value.trim(),
  bio:$("#profileBio").value.trim(),
  location:$("#profileLocation").value.trim(),
  tag:$("#profileRoleTag").value,
  portfolio:$("#profilePortfolio").value.trim(),
  email:$("#profileEmail").value.trim(),
  instagram:$("#socialInstagram")?.value.trim()||"",
  linkedin:$("#socialLinkedin")?.value.trim()||"",
  github:$("#socialGithub")?.value.trim()||"",
  theme:currentTheme
 };
}
function renderProfile(){
 const p=getProfile();
 $("#previewName").textContent=p.name;
 $("#previewRole").textContent=p.role;
 $("#previewBio").textContent=p.bio;
 $("#previewLocation").textContent=p.location;
 $("#previewTag").textContent=p.tag;
 $("#previewAvatar").textContent=(p.name[0]||"T").toUpperCase();
 const preview=$("#profilePreview");
 preview.className=`profile-preview theme-${p.theme}`;
 const links=[
  ["instagram","◎","Instagram"],["linkedin","in","LinkedIn"],["github","⌘","GitHub"]
 ].filter(([key])=>p[key]);
 const extra=$$("#extraLinks .extra-link-row").map(row=>({name:$("input:nth-child(1)",row).value,url:$("input:nth-child(2)",row).value})).filter(x=>x.name&&x.url);
 const all=[...links.map(([key,icon,label])=>({name:label,icon,url:p[key]})),...extra.map(x=>({name:x.name,icon:"↗",url:x.url}))];
 $("#previewSocials").innerHTML=all.length?all.map(x=>`<a href="#" data-demo-link="true">${escapeHtml(x.icon)} <span>${escapeHtml(x.name)}</span> ↗</a>`).join(""):"<p class='small-muted'>Add a link to show it here.</p>";
 $("#modalName").textContent=p.name; $("#modalHeadline").textContent=p.role; $("#modalBio").textContent=p.bio;
}
function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
["profileName","profileRole","profileBio","profileLocation","profileRoleTag","profilePortfolio","profileEmail","socialInstagram","socialLinkedin","socialGithub"].forEach(id=>{
 const el=$("#"+id); if(el) el.addEventListener("input",renderProfile);
});
$$(".theme-option").forEach(btn=>btn.addEventListener("click",()=>{
 currentTheme=btn.dataset.theme;
 $$(".theme-option").forEach(x=>x.classList.toggle("selected",x===btn));
 renderProfile(); toast(`${btn.querySelector("strong").textContent} theme previewed`);
}));
$("#saveProfile").addEventListener("click",()=>{
 const data={...getProfile(),extraLinks:$$("#extraLinks .extra-link-row").map(row=>({name:$("input:nth-child(1)",row).value,url:$("input:nth-child(2)",row).value}))};
 try{localStorage.setItem("tagnetDemoProfile",JSON.stringify(data));toast("Demo profile saved in this browser.");}
 catch(e){toast("Preview updated. Browser storage unavailable.");}
});
function loadProfile(){
 try{
  const p=JSON.parse(localStorage.getItem("tagnetDemoProfile")||"null");
  if(!p)return;
  const fields={profileName:"name",profileRole:"role",profileBio:"bio",profileLocation:"location",profileRoleTag:"tag",profilePortfolio:"portfolio",profileEmail:"email",socialInstagram:"instagram",socialLinkedin:"linkedin",socialGithub:"github"};
  Object.entries(fields).forEach(([id,key])=>{if(p[key]&&$("#"+id))$("#"+id).value=p[key]});
  if(p.theme&&$(`.theme-option[data-theme="${p.theme}"]`)){currentTheme=p.theme;$$(".theme-option").forEach(b=>b.classList.toggle("selected",b.dataset.theme===currentTheme));}
  (p.extraLinks||[]).forEach(link=>addExtraLink(link.name,link.url));
 }catch(e){}
 renderProfile();
}
function addExtraLink(name="",url=""){
 const row=document.createElement("div"); row.className="extra-link-row";
 row.style.cssText="display:flex;gap:7px;margin-top:8px";
 row.innerHTML=`<input class="field" placeholder="Link name" value="${escapeHtml(name)}" style="min-width:0;flex:1"><input class="field" placeholder="URL" value="${escapeHtml(url)}" style="min-width:0;flex:1"><button class="outline-button remove-link" type="button" aria-label="Remove link">×</button>`;
 row.querySelectorAll("input").forEach(input=>input.addEventListener("input",renderProfile));
 row.querySelector(".remove-link").addEventListener("click",()=>{row.remove();renderProfile()});
 $("#extraLinks").appendChild(row); renderProfile();
}
$("#addLink").addEventListener("click",()=>addExtraLink());
function copyText(text){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(()=>toast("Profile link copied!")).catch(()=>fallbackCopy(text));}else fallbackCopy(text);}
function fallbackCopy(text){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast("Profile link copied!");}catch(e){toast(text)}ta.remove();}
$("#copyUrl").addEventListener("click",()=>copyText("https://tagnet.in/ziyan"));
$("#copyIdentityUrl").addEventListener("click",()=>copyText("https://tagnet.in/ziyan"));
function openModal(){$("#modalBackdrop").classList.add("open");}
function closeModal(){$("#modalBackdrop").classList.remove("open");}
$("#openPublic").addEventListener("click",openModal);
$("#previewExpand").addEventListener("click",openModal);
$("#identityPreview").addEventListener("click",openModal);
$("#modalClose").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target===$("#modalBackdrop"))closeModal()});
$("#saveContact").addEventListener("click",downloadVCard);
$("#modalSaveContact").addEventListener("click",downloadVCard);
function downloadVCard(){
 const p=getProfile();
 const vcard=["BEGIN:VCARD","VERSION:3.0",`FN:${p.name}`,`TITLE:${p.role}`,`NOTE:${p.bio}`,p.email?`EMAIL:${p.email}`:"",p.location?`ADR:;;${p.location};;;;`:"",p.portfolio?`URL:${p.portfolio}`:"","END:VCARD"].filter(Boolean).join("\r\n");
 const blob=new Blob([vcard],{type:"text/vcard;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${p.name.replace(/\s+/g,"-").toLowerCase()}-contact.vcf`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(a.href);toast("Contact file downloaded. Open it to save the contact.");
}
async function shareProfile(){
 const url="https://tagnet.in/ziyan";
 if(navigator.share){try{await navigator.share({title:getProfile().name+" — Tagnet",text:"Connect with me on Tagnet",url});}catch(e){}}
 else copyText(url);
}
$("#shareProfile").addEventListener("click",shareProfile);
$("#modalShare").addEventListener("click",shareProfile);
$("#orderFilter").addEventListener("change",e=>{
 $$(".order-row").forEach(row=>row.style.display=(e.target.value==="all"||row.dataset.status===e.target.value)?"flex":"none");
});
$$(".track-order").forEach(btn=>btn.addEventListener("click",()=>toast(`Demo tracking details for order ${btn.dataset.order}. Live tracking needs courier integration.`)));
$("#downloadOrders").addEventListener("click",()=>{
 const rows=[["Order ID","Product","Status","Amount"],["TG-1048","Tagnet NFC Keychain","In transit","199"],["TG-0982","Tagnet NFC Keychain","Delivered","298"],["TG-0911","Tagnet NFC Keychain","Delivered","149"]];
 const csv=rows.map(r=>r.join(",")).join("\n");const blob=new Blob([csv],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="tagnet-demo-orders.csv";a.click();URL.revokeObjectURL(a.href);toast("Demo order list exported.");
});
$$("[data-demo-link]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();toast("Demo link preview — add real URLs in Profile Studio.")}));
loadProfile();
