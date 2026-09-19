// Demo data: one college and one user per role, plus a few alumni. Run: npm run seed
require('dotenv').config();const bcrypt=require('bcryptjs'),db=require('./db');
db.prepare('INSERT OR IGNORE INTO colleges(name,domain) VALUES(?,?)').run('Demo Institute of Technology','college.edu');
const cid=db.prepare("SELECT id FROM colleges WHERE domain='college.edu'").get().id;
const ins=db.prepare(`INSERT OR IGNORE INTO users(college_id,role,reg_id,name,email,phone,city,branch,batch_year,company,job_role,designation,skills,password_hash,status)
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'approved')`);
[['admin','ADMIN-001','College Admin','Admin@123'],['student','CSE2022047','Aarav Kapoor','Student@123',null,'CSE',2026,null,null,null,'Python,React,DSA'],
 ['alumni','CSE2017031','Priya Sharma','Alumni@123','Bengaluru','CSE',2021,'Google','Software Engineer',null,'Java,DSA,Cloud'],
 ['alumni','CSE2018010','Pooja Menon','Alumni@123','Bengaluru','CSE',2018,'NVIDIA','ML Engineer',null,'ML,Python'],
 ['alumni','IT2019044','Sneha Kulkarni','Alumni@123','Pune','IT',2021,'Atlassian','Product Manager',null,'Product,SQL'],
 ['faculty','FAC-1021','Dr. Meenakshi Rao','Faculty@123',null,'CSE',null,null,null,'Associate Professor','ML']]
.forEach(([role,id,name,pw,city,br,yr,co,jr,des,sk])=>ins.run(cid,role,id,name,id.toLowerCase()+'@college.edu','9000000000',city??null,br??null,yr??null,co??null,jr??null,des??null,sk??'',bcrypt.hashSync(pw,10)));
console.log('Seeded. Sign in with CSE2022047 / Student@123 (college.edu)');
