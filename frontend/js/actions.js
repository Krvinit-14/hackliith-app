/* ---------- ACTIONS ---------- */
const R=i=>S.req.find(r=>r.id==i);
const need=(scr,p)=>{if(S.college)return false;S.want={s:scr,p};S.cerr='';S.screen='college';return true};
const F={cchg:()=>{S.college=null;need(S.screen=='signup'?'signup':'login',S.lg.next)},cfill:d=>{S.cu='https://www.'+d.d;S.cerr=''},
cfind:()=>{const v=$('#cu').value.trim(),h=dom(v);S.cu=v;if(!v){S.cerr='Enter your college website address.';return}if(!h){S.cerr='That does not look like a website address. Try something like www.college.edu.';return}
const c=COLS.find(x=>h==x.d||h.endsWith('.'+x.d));if(!c){S.cerr='We could not find a college at '+h+'. Ask your college admin to register it on AlumNexus.';return}
S.college=c;S.cerr='';const w=S.want||{s:'login'};if(w.s=='signup'){S.suE=[];S.screen='signup'}else{S.lg={r:'student',next:w.p||'home',err:'',id:'',pw:'',show:false};S.screen='login'}},
gsu:()=>{if(need('signup'))return;S.suE=[];S.screen='signup'},surole:d=>{suGet();S.su.r=d.r;S.suE=[]},
sub:()=>{suGet();const v=S.su;S.suE=suErr(v);if(S.suE.length){scrollTo(0,0);return}
S.users.push({role:v.r,id:v.id,pw:v.p,name:v.n,st:'Pending',email:v.e,phone:v.m,dob:v.dob,gender:v.g,city:v.c,br:v.b,yr:+v.y||0,co:v.co,jr:v.jr,des:v.d,xp:v.x,sk:v.s.split(',').map(x=>x.trim()).filter(Boolean)});
nt('New registration from '+v.n+' is waiting for approval.');S.lg={r:v.r,next:'home',err:'',id:v.id,pw:'',show:false,ok:'Account created for '+v.n+'. You can sign in after your college admin approves it.'};S.su=SU0();S.screen='login'},
uap:d=>{const u=S.users[+d.i];u.st='Approved';S.act++;if(u.role=='alumni'){A.push({id:A.length,name:u.name,br:u.br,yr:u.yr,role:u.jr,co:u.co,ind:'',city:u.city,sk:u.sk,mn:true,vf:true,ex:u.co+' | '+u.jr+' | Current'});u.aid=A.length-1;nt(u.name+' joined as a Verified Alumnus.')}else nt(u.name+' account was approved.')},urj:d=>{S.users[+d.i].st='Rejected'},
lgo:d=>{if(need('login',d.p))return;S.lg={r:'student',next:d.p||'home',err:'',id:'',pw:'',show:false};S.screen='login'},lback:()=>{S.screen=''},lrole:d=>{S.lg.r=d.r;S.lg.err='';S.lg.id='';S.lg.pw=''},fill:()=>{S.lg.id=ACC[S.lg.r].id;S.lg.pw=ACC[S.lg.r].pw;S.lg.err=''},lsh:()=>{S.lg.id=$('#lid').value;S.lg.pw=$('#lpw').value;S.lg.show=!S.lg.show},
dologin:()=>{const g=S.lg,c=ACC[g.r],id=$('#lid').value.trim(),pw=$('#lpw').value;g.id=id;g.pw=pw;
if(Date.now()<(S.lock||0)){g.err='Too many attempts. Try again in 30 seconds.';return}
if(!id||!pw){g.err='Enter both your ID and password.';return}
const u=S.users.find(x=>x.role==g.r&&x.id.toUpperCase()==id.toUpperCase()&&x.pw==pw);
if(u&&u.st!='Approved'){g.err=u.st=='Pending'?'Your account is waiting for admin approval.':'Your registration was not approved. Please contact your college admin.';return}
if(u||(id.toUpperCase()==c.id.toUpperCase()&&pw==c.pw)){loadUser(g.r,u);S.role=g.r;S.page=g.next;S.screen='';S.tries=0;g.pw='';tt('Signed in');return}
S.tries=(S.tries||0)+1;if(S.tries>=5){S.lock=Date.now()+30000;S.tries=0;g.err='Too many attempts. Try again in 30 seconds.'}else g.err=c.lb+' or password is incorrect. Attempts left: '+(5-S.tries)+'.';g.pw=''},
view:d=>{S.vw=+d.i;S.page='aprof';S.edit=false},pedit:()=>{S.edit=true},pcancel:()=>{S.edit=false},psave:()=>collect(true),login:d=>{S.role=d.r;S.page=d.p||'home'},go:d=>{S.page=d.p;S.edit=false},out:()=>{S.role=null;S.edit=false;S.screen=''},theme:()=>{const e=document.documentElement;e.dataset.theme=(e.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))=='dark'?'light':'dark'},
find:()=>{S.q=$('#q').value.trim();if(S.q)nt('An alumnus matching your career interest has joined.')},ex:d=>{S.q=d.q},tab:d=>S.tab=d.t,sel:d=>S.sel=+d.i,city:d=>S.city=d.c,mt:d=>S.mt=d.m,
of:d=>S.of.has(d.c)?S.of.delete(d.c):S.of.add(d.c),
conn:d=>{if(S.conn.has(+d.i))return;if(S.conn.size>=8)return tt('Limit reached: 8 connection requests a day, to prevent spam.');S.conn.add(+d.i);S.act++;tt('Connection request sent')},
save:d=>{S.saved.has(+d.i)?S.saved.delete(+d.i):S.saved.add(+d.i)},rep:d=>{S.rep.push({id:++S.rid,t:A[+d.i].name+' was reported by a member'});tt('Reported. Admin will review it.')},
mreq:d=>{if(S.role!='student')return tt('Only students can request mentorship.');if(S.req.filter(r=>r.who==S.user.name&&r.st=='Pending').length>=3)return tt('You have 3 pending requests. Wait for a reply before sending more.');S.req.push({id:++S.rid,aid:+d.i,who:S.user.name,type:S.mt,st:'Pending',m:[]});S.act++;S.page='mentor';tt('Mentorship request sent: '+S.mt)},
acc:d=>{const r=R(d.i);r.st='Accepted';r.m.push({f:'a',t:'Happy to help. Tell me your goals, then pick a slot.'});nt('Your mentorship request was accepted.');tt('Request accepted')},rej:d=>{R(d.i).st='Declined'},
sch:d=>{const r=R(d.i);r.st='Scheduled';r.when='Sat 11:00 AM, Google Meet';tt('Session scheduled')},done:d=>{const r=R(d.i);r.st='Completed';r.rt=5;S.act+=2;tt('Thanks for the feedback. Session marked complete.')},
send:d=>{const r=R(d.i),v=$('#m'+d.i).value.trim();if(!v)return;const me=S.role=='alumni'?'a':'s';r.m.push({f:me,t:v});S.act++;setTimeout(()=>{r.m.push({f:me=='a'?'s':'a',t:me=='a'?'Thank you, that really helps.':'Good question. Let us cover it in our session.'});render()},900)},
apply:d=>{S.ap.add(+d.i);S.act++;tt('Application sent')},post:()=>{const t=$('#ot').value.trim();if(!t)return tt('Add a title first.');S.Q.push({k:'opp',d:{id:++S.rid,t,ty:$('#oty').value,br:'All',m:'Remote',lv:'Beginner',by:0,ok:1}});tt('Sent to admin for approval')},
share:()=>{const x=$('#pt').value.trim();if(!x)return tt('Write something first.');S.Q.push({k:'post',d:{by:S.user.name,x}});tt('Sent to admin for approval')},
reg:d=>{S.reg.has(+d.i)?S.reg.delete(+d.i):S.reg.add(+d.i);S.act++},endorse:d=>tt(d.n+' endorsed'),ver:d=>{A[+d.i].vf=true;nt(A[+d.i].name+' is now a Verified Alumnus.')},
appr:d=>{const q=S.Q.splice(+d.i,1)[0];if(q.k=='opp'){O.unshift(q.d);nt('A new '+q.d.ty.toLowerCase()+' has been posted by a verified alumnus.')}else PO.unshift(q.d)},drop:d=>S.Q.splice(+d.i,1),clr:d=>{S.rep=S.rep.filter(r=>r.id!=+d.i)},
ann:()=>{const v=$('#an').value.trim();if(v){nt('Announcement: '+v);tt('Announcement sent')}},grad:()=>{S.pf.alumni={...S.pf.student,clubs:[],br:S.user.br,yr:2026,exp:''};S.grad=true;S.role='alumni';S.page='home'}};
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.id=='cu'){F.cfind();render()}if(e.key=='Enter'&&(e.target.id=='lid'||e.target.id=='lpw')){F.dologin();render()}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const f=F[b.dataset.a];if(f){f(b.dataset);render()}});
document.addEventListener('input',e=>{const i=e.target.id;if(i=='fq')S.f.q=e.target.value;else if(i=='fb')S.f.br=e.target.value;else if(i=='fy')S.f.yr=e.target.value;else if(i=='fm')S.f.mn=e.target.checked;else return;$('#res').innerHTML=alRes()});
document.addEventListener('change',e=>{if(e.target.id=='rs'){S.role=e.target.value;S.page='home';S.edit=false;render()}else if(['fb','fy','fm'].includes(e.target.id))document.dispatchEvent(new Event('input'))});
document.addEventListener('change',e=>{if(e.target.id!='pic')return;const f=e.target.files[0];if(!f||!f.type.startsWith('image/'))return tt('Choose an image file.');if(f.size>2e6)return tt('Choose an image under 2 MB.');collect();const rd=new FileReader();rd.onload=()=>{S.pf[S.role].img=rd.result;render()};rd.readAsDataURL(f)});render();
