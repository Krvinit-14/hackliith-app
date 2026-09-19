/* API client for the backend (not loaded yet).
   Next step: replace the in-memory logic in actions.js with these calls,
   then add <script src="js/api.js"></script> before actions.js in index.html. */
const API={base:'/api',token:null,
async call(path,o={}){const r=await fetch(this.base+path,{method:o.method||'GET',headers:{'Content-Type':'application/json',...(this.token?{Authorization:'Bearer '+this.token}:{})},body:o.body?JSON.stringify(o.body):undefined});const d=await r.json();if(!r.ok)throw new Error(d.error||'Request failed');return d},
lookupCollege:u=>API.call('/colleges/lookup?url='+encodeURIComponent(u)),
register:b=>API.call('/auth/register',{method:'POST',body:b}),
async login(b){const d=await API.call('/auth/login',{method:'POST',body:b});API.token=d.token;return d.user},
alumni:(q='')=>API.call('/alumni'+q),
match:goal=>API.call('/alumni/match?goal='+encodeURIComponent(goal)),
requestMentorship:(alumniId,type)=>API.call('/mentorship',{method:'POST',body:{alumniId,type}}),
mentorship:()=>API.call('/mentorship'),
updateMentorship:(id,b)=>API.call('/mentorship/'+id,{method:'PATCH',body:b}),
opportunities:(q='')=>API.call('/opportunities'+q),
stats:()=>API.call('/admin/stats')};
