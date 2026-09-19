const r=require('express').Router(),db=require('../db'),{auth,allow}=require('../middleware/auth');
r.use(auth,allow('admin'));
r.get('/registrations',(req,res)=>res.json(db.prepare("SELECT id,role,reg_id,name,email,branch,batch_year,company,job_role FROM users WHERE status='pending' AND college_id=?").all(req.user.college)));
r.patch('/registrations/:id',(req,res)=>{const d=req.body.decision;if(!['approved','rejected'].includes(d))return res.status(400).json({error:'Decision must be approved or rejected'});
  db.prepare('UPDATE users SET status=? WHERE id=? AND college_id=?').run(d,req.params.id,req.user.college);res.json({ok:true})});
r.get('/stats',(req,res)=>{const c=req.user.college,n=(sql,...p)=>db.prepare(sql).get(...p).n;
  res.json({students:n("SELECT COUNT(*) n FROM users WHERE role='student' AND status='approved' AND college_id=?",c),alumni:n("SELECT COUNT(*) n FROM users WHERE role='alumni' AND status='approved' AND college_id=?",c),
    mentors:n("SELECT COUNT(DISTINCT alumni_id) n FROM mentorship WHERE status!='pending'"),requests:n('SELECT COUNT(*) n FROM mentorship'),
    internships:n("SELECT COUNT(*) n FROM opportunities WHERE type='Internship' AND status='approved' AND college_id=?",c),jobs:n("SELECT COUNT(*) n FROM opportunities WHERE type IN('Job','Referral') AND status='approved' AND college_id=?",c)})});
module.exports=r;
