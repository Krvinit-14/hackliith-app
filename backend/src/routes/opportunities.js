const r=require('express').Router(),db=require('../db'),{auth,allow}=require('../middleware/auth');
r.use(auth);
r.get('/',(req,res)=>{const{type,mode,level,branch}=req.query;
  res.json(db.prepare("SELECT o.*,u.name posted_by_name FROM opportunities o JOIN users u ON u.id=o.posted_by WHERE o.college_id=? AND o.status='approved' ORDER BY o.id DESC").all(req.user.college)
    .filter(o=>(!type||o.type===type)&&(!mode||o.mode===mode)&&(!level||o.level===level)&&(!branch||['All',branch].includes(o.branch))))});
// Alumni and faculty submit; admin posts go live at once, others wait for approval
r.post('/',allow('alumni','faculty','admin'),(req,res)=>{const{title,type,branch,mode,level}=req.body;
  if(!title||!type)return res.status(400).json({error:'Title and type are required'});
  db.prepare('INSERT INTO opportunities(college_id,posted_by,title,type,branch,mode,level,status) VALUES(?,?,?,?,?,?,?,?)').run(req.user.college,req.user.id,title,type,branch||'All',mode||'Remote',level||'Beginner',req.user.role==='admin'?'approved':'pending');
  res.status(201).json({message:req.user.role==='admin'?'Published':'Sent to admin for approval'})});
r.patch('/:id/approve',allow('admin'),(req,res)=>{db.prepare("UPDATE opportunities SET status='approved' WHERE id=? AND college_id=?").run(req.params.id,req.user.college);res.json({ok:true})});
module.exports=r;
