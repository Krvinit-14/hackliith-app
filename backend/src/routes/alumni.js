const r=require('express').Router(),db=require('../db'),{auth,allow}=require('../middleware/auth'),{score}=require('../services/matching');
// Only public fields leave the server: never phone, email or date of birth.
const pub=u=>({id:u.id,name:u.name,branch:u.branch,batchYear:u.batch_year,company:u.company,jobRole:u.job_role,city:u.city,skills:(u.skills||'').split(',').filter(Boolean),mentoring:!!u.mentoring,verified:true});
const approved=col=>db.prepare("SELECT * FROM users WHERE role='alumni' AND status='approved' AND college_id=?").all(col);
r.use(auth);
r.get('/',(req,res)=>{const{branch,year,q,mentoring}=req.query,k=(q||'').toLowerCase();
  res.json(approved(req.user.college).filter(a=>(!branch||a.branch===branch)&&(!year||a.batch_year==year)&&(!mentoring||a.mentoring)&&(!k||[a.name,a.company,a.job_role,a.city,a.skills].join(' ').toLowerCase().includes(k))).map(pub))});
// Smart matching: GET /api/alumni/match?goal=I want to become a software developer
r.get('/match',allow('student'),(req,res)=>{const me=db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id),goal=req.query.goal||'';
  res.json(approved(req.user.college).map(a=>({...pub(a),...score(me,goal,a)})).sort((x,y)=>y.score-x.score).slice(0,5))});
r.get('/:id',(req,res)=>{const a=approved(req.user.college).find(x=>x.id==req.params.id);a?res.json(pub(a)):res.status(404).json({error:'Not found'})});
module.exports=r;
