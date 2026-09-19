const r=require('express').Router(),bcrypt=require('bcryptjs'),rate=require('express-rate-limit'),db=require('../db'),{sign}=require('../middleware/auth');
const host=u=>{try{return new URL(/^https?:\/\//i.test(u)?u:'https://'+u).hostname.toLowerCase().replace(/^www\./,'')}catch{return''}};
const bad=(res,m)=>res.status(400).json({error:m});
// Step 1: identify the college from its website address
r.get('/colleges/lookup',(req,res)=>{const h=host(req.query.url||''),c=h&&db.prepare('SELECT * FROM colleges').all().find(x=>h===x.domain||h.endsWith('.'+x.domain));
  c?res.json(c):res.status(404).json({error:'College not found. Ask your college admin to register it.'})});
// Step 2a: create an account (stays pending until an admin approves it)
r.post('/auth/register',(req,res)=>{const b=req.body,c=db.prepare('SELECT * FROM colleges WHERE id=?').get(b.collegeId);
  if(!c)return bad(res,'Unknown college');if(!['student','alumni','faculty'].includes(b.role))return bad(res,'Invalid role');
  if(!b.name||!b.regId)return bad(res,'Name and ID are required');
  if(!(b.email||'').toLowerCase().endsWith('@'+c.domain))return bad(res,`Use your @${c.domain} email`);
  if(!/^\d{10}$/.test(b.phone||''))return bad(res,'Mobile number must be 10 digits');
  if(!b.password||b.password.length<8||!/[A-Za-z]/.test(b.password)||!/\d/.test(b.password))return bad(res,'Password needs 8+ characters with letters and numbers');
  try{db.prepare(`INSERT INTO users(college_id,role,reg_id,name,email,phone,dob,gender,city,branch,batch_year,company,job_role,designation,expertise,skills,password_hash)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(c.id,b.role,b.regId,b.name,b.email,b.phone,b.dob??null,b.gender??null,b.city??null,b.branch??null,b.batchYear??null,b.company??null,b.jobRole??null,b.designation??null,b.expertise??null,b.skills??'',bcrypt.hashSync(b.password,10));
    res.status(201).json({message:'Account created. An admin must approve it before you can sign in.'})}catch{res.status(409).json({error:'This ID is already registered'})}});
// Step 2b: sign in with ID + password (limited to 10 tries a minute)
r.post('/auth/login',rate({windowMs:60_000,max:10}),(req,res)=>{const{collegeId,role,regId,password}=req.body;
  const u=db.prepare('SELECT * FROM users WHERE college_id=? AND role=? AND reg_id=?').get(collegeId,role,regId);
  if(!u||!bcrypt.compareSync(password||'',u.password_hash))return res.status(401).json({error:'ID or password is incorrect'});
  if(u.status!=='approved')return res.status(403).json({error:u.status==='pending'?'Your account is waiting for admin approval':'Your registration was not approved'});
  res.json({token:sign(u),user:{id:u.id,name:u.name,role:u.role,branch:u.branch,batchYear:u.batch_year}})});
module.exports=r;
