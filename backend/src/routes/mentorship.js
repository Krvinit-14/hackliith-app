const r=require('express').Router(),db=require('../db'),{auth,allow}=require('../middleware/auth');
r.use(auth);
const TYPES=['Career Guidance','Resume Review','Mock Interview','Project Guidance','Higher Studies','Industry Guidance'];
// Student sends a request (max 3 waiting at a time, to stop spam)
r.post('/',allow('student'),(req,res)=>{const{alumniId,type}=req.body;
  if(!TYPES.includes(type))return res.status(400).json({error:'Choose a valid mentorship type'});
  const a=db.prepare("SELECT id FROM users WHERE id=? AND role='alumni' AND status='approved' AND mentoring=1 AND college_id=?").get(alumniId,req.user.college);
  if(!a)return res.status(404).json({error:'This alumnus is not available'});
  if(db.prepare("SELECT COUNT(*) n FROM mentorship WHERE student_id=? AND status='pending'").get(req.user.id).n>=3)return res.status(429).json({error:'You have 3 pending requests. Wait for a reply first.'});
  res.status(201).json({id:db.prepare('INSERT INTO mentorship(student_id,alumni_id,type) VALUES(?,?,?)').run(req.user.id,alumniId,type).lastInsertRowid})});
r.get('/',(req,res)=>{const col=req.user.role==='alumni'?'alumni_id':'student_id';
  res.json(db.prepare(`SELECT m.*,s.name student_name,a.name alumni_name FROM mentorship m JOIN users s ON s.id=m.student_id JOIN users a ON a.id=m.alumni_id WHERE m.${col}=? ORDER BY m.id DESC`).all(req.user.id))});
// Status flow: pending -> accepted -> scheduled -> completed (or declined)
r.patch('/:id',(req,res)=>{const m=db.prepare('SELECT * FROM mentorship WHERE id=?').get(req.params.id);
  if(!m||![m.student_id,m.alumni_id].includes(req.user.id))return res.status(404).json({error:'Not found'});
  const{action,when,rating}=req.body,isA=req.user.id===m.alumni_id,next={accept:['pending','accepted'],decline:['pending','declined'],schedule:['accepted','scheduled'],complete:['scheduled','completed']}[action];
  if(!next||m.status!==next[0])return res.status(400).json({error:'Not possible right now'});
  if((action!=='complete'&&!isA)||(action==='complete'&&isA))return res.status(403).json({error:'Not allowed'});
  db.prepare('UPDATE mentorship SET status=?,session_time=COALESCE(?,session_time),rating=COALESCE(?,rating) WHERE id=?').run(next[1],when??null,rating??null,m.id);res.json({status:next[1]})});
// Chat between the student and the mentor
const inChat=(req,res)=>{const m=db.prepare('SELECT * FROM mentorship WHERE id=?').get(req.params.id);
  if(!m||![m.student_id,m.alumni_id].includes(req.user.id)||!['accepted','scheduled','completed'].includes(m.status)){res.status(403).json({error:'Chat opens after the request is accepted'});return null}return m};
r.get('/:id/messages',(req,res)=>{if(inChat(req,res))res.json(db.prepare('SELECT sender_id,body,created_at FROM messages WHERE mentorship_id=? ORDER BY id').all(req.params.id))});
r.post('/:id/messages',(req,res)=>{if(!inChat(req,res))return;const b=(req.body.body||'').trim().slice(0,1000);if(!b)return res.status(400).json({error:'Write a message'});
  db.prepare('INSERT INTO messages(mentorship_id,sender_id,body) VALUES(?,?,?)').run(req.params.id,req.user.id,b);res.status(201).json({ok:true})});
module.exports=r;
