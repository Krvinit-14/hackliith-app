const $=s=>document.querySelector(s),ini=n=>n.split(' ').map(x=>x[0]).join('').slice(0,2);
/* ---------- DATA LAYER (in-memory mock DB; swap for API/DB calls) ---------- */
const A=`Priya Sharma|CSE|2021|Software Engineer|Google|Tech|Bengaluru|Java,DSA,Cloud|1|1
Rohan Mehta|CSE|2022|Software Engineer|Microsoft|Tech|Hyderabad|Python,React,DSA|1|1
Ananya Iyer|CSE|2019|Data Scientist|Flipkart|E-commerce|Bengaluru|Python,ML,SQL|1|1
Karan Verma|ECE|2020|Embedded Engineer|Qualcomm|Semiconductors|Bengaluru|C,VLSI,IoT|1|1
Sneha Kulkarni|IT|2021|Product Manager|Atlassian|Tech|Pune|Product,SQL,Design|1|1
Vikram Singh|ME|2018|Design Engineer|Tata Motors|Automotive|Pune|CAD,Ansys,Design|0|1
Neha Gupta|CSE|2020|Backend Engineer|Amazon|Tech|Delhi NCR|Java,AWS,SQL|1|1
Arjun Nair|IT|2022|Frontend Developer|Razorpay|Fintech|Bengaluru|React,JS,CSS|1|1
Divya Reddy|CE|2019|Structural Engineer|L&T|Construction|Mumbai|AutoCAD,STAAD|1|1
Aditya Rao|CSE|2017|Engineering Manager|Adobe|Tech|Delhi NCR|Leadership,Java,Cloud|1|1
Meera Joshi|ECE|2021|Data Analyst|Deloitte|Consulting|Delhi NCR|SQL,Excel,Python|1|1
Rahul Bansal|ME|2020|Manufacturing Lead|Bosch|Automotive|Bengaluru|Lean,CAD|0|1
Isha Kapoor|CSE|2023|Software Engineer|Zomato|Tech|Delhi NCR|Python,Go,DSA|1|1
Siddharth Jain|IT|2019|DevOps Engineer|Infosys|IT Services|Pune|Docker,AWS,Linux|1|1
Pooja Menon|CSE|2018|ML Engineer|NVIDIA|Tech|Bengaluru|ML,Python,CUDA|1|1
Manish Yadav|ECE|2022|Software Engineer|Samsung|Electronics|Delhi NCR|C++,DSP|1|0
Kavya Pillai|CE|2021|Project Engineer|Tata Projects|Construction|Hyderabad|Revit,Planning|1|1
Harsh Agarwal|CSE|2020|Security Analyst|PwC|Consulting|Mumbai|Security,Linux,Python|1|1
Tanvi Desai|IT|2023|Software Engineer|Paytm|Fintech|Delhi NCR|Java,React|1|0
Yash Chauhan|ME|2021|Graduate Engineer|Mahindra|Automotive|Delhi NCR|CAD,Python|1|1`.split('\n').map((r,i)=>{const p=r.split('|');return{id:i,name:p[0],br:p[1],yr:+p[2],role:p[3],co:p[4],ind:p[5],city:p[6],sk:p[7].split(','),mn:p[8]=='1',vf:p[9]=='1'}});
const STU='Aarav Kapoor,Diya Malhotra,Kabir Sethi,Riya Bhatt,Dev Patel,Nisha Roy,Om Trivedi,Sara Khan,Yuvraj Das,Tara Nair,Ishaan Ghosh,Mihir Shah,Anvi Rao,Lakshya Jha,Pranav Iyer,Simran Kaur,Zoya Ali,Veer Saxena,Naina Pillai,Rudra Menon'.split(','),FAC=['Dr. Meenakshi Rao','Prof. S. Banerjee','Dr. A. Kulkarni','Prof. R. Nair','Dr. P. Chawla'];
const IN=['TCS Digital','Zoho','Bosch','Wipro','Startup (YC)'],FJ=['Infosys','Accenture','Cognizant','Startup','TCS','Capgemini'],CT={Bengaluru:[77.6,13],'Delhi NCR':[77.2,28.6],Pune:[73.9,18.5],Mumbai:[72.9,19.1],Hyderabad:[78.5,17.4]},CN={Bengaluru:82,'Delhi NCR':46,Pune:31,Mumbai:28,Hyderabad:24};
const MT=['Career Guidance','Resume Review','Mock Interview','Project Guidance','Higher Studies','Industry Guidance'],TY=['Internship','Job','Referral','Hackathon','Research','Scholarship','Competition','Workshop'];
let O=[[1,'SDE Intern, Summer 2027','Internship','CSE','Remote','Beginner',0],[2,'Frontend Developer referral','Referral','IT','Onsite','Mid',7],[3,'Data Analyst Intern','Internship','CSE','Remote','Beginner',10],[4,'Smart India Hackathon prep camp','Hackathon','All','Remote','Beginner',9],[5,'Embedded systems research project','Research','ECE','Hybrid','Mid',3],[6,'Alumni Merit Scholarship 2027','Scholarship','All','Remote','Beginner',9],[7,'Backend Engineer, graduate role','Job','CSE','Onsite','Mid',6],[8,'System design workshop','Workshop','CSE','Remote','Beginner',14],[9,'Inter-college coding contest','Competition','All','Remote','Beginner',12]].map(o=>({id:o[0],t:o[1],ty:o[2],br:o[3],m:o[4],lv:o[5],by:o[6],ok:1}));
let PO=[{by:'Priya Sharma',x:'Cleared five rounds at Google. I am sharing my DSA plan in Friday\'s webinar.'},{by:'Isha Kapoor',x:'Alumni success story: from campus hackathon winner to SDE at Zomato in two years.'},{by:'Dev Patel',x:'Our team won the college hackathon with an accessibility-first campus map. Code is on GitHub.'},{by:'Dr. Meenakshi Rao',x:'Research openings in applied ML for final-year students. Message me with your resume.'}];
const EV=[['Alumni career talk: breaking into big tech','Sat 26 Sep, 6 PM'],['Resume clinic with alumni','Wed 30 Sep, 5 PM'],['Virtual alumni meet 2026','Sun 4 Oct, 11 AM']];
const jr=r=>/Manager|Lead/.test(r)?r.replace(/Manager|Lead/,'Associate'):'Junior '+r;
const genEx=a=>{const n=a.yr<=2019?2:1,L=[a.co+' | '+a.role+' | '+(a.yr+2*n)+' – Present'];for(let k=n-1;k>=0;k--){let c=FJ[(a.id+k*3)%6];if(c==a.co)c=FJ[(a.id+k*3+1)%6];L.push(c+' | '+jr(a.role)+' | '+(a.yr+2*k)+' – '+(a.yr+2*k+2))}return L.join('\n')},parseEx=t=>(t||'').split('\n').filter(Boolean).map(l=>l.split('|').map(x=>x.trim()));
const PF={student:{name:'Aarav Kapoor',reg:'CSE2022047',ach:'Winner, college hackathon 2025\nSolved 300+ DSA problems',gh:'https://github.com/aarav-demo',pw:'https://aarav-demo.example.com',li:'https://www.linkedin.com/in/aarav-demo',clubs:['Coding Club','Photography Club'],img:''},alumni:{name:'Priya Sharma',br:'CSE',yr:2021,exp:genEx(A[0]),reg:'CSE2017031',ach:'Google Peer Bonus 2024\nGuest speaker, alumni meet 2025',gh:'https://github.com/priya-demo',pw:'',li:'https://www.linkedin.com/in/priya-demo',clubs:[],img:''},faculty:{name:FAC[0],reg:'',des:'Associate Professor',dep:'Computer Science and Engineering',xp:'Machine Learning, Data Mining, Applied AI',ach:'Best Teacher Award 2023',gh:'https://github.com/meenakshi-demo',pw:'',li:'https://www.linkedin.com/in/meenakshi-demo',clubs:[],img:''},admin:{name:'College Admin',reg:'',ach:'',gh:'',pw:'',li:'',clubs:[],img:''}};
const PF0=JSON.stringify(PF),DEMOU={name:'Aarav Kapoor',br:'CSE',yr:2026,sk:['Python','React','DSA']},SU0=()=>({r:'student',n:'',dob:'',g:'',m:'',c:'',e:'',id:'',b:'',y:'',d:'',x:'',co:'',jr:'',s:'',p:'',p2:'',ok:false});
const ACC={student:{id:'CSE2022047',pw:'Student@123',lb:'Registration number'},alumni:{id:'CSE2017031',pw:'Alumni@123',lb:'Alumni registration number'},faculty:{id:'FAC-1021',pw:'Faculty@123',lb:'Employee ID'},admin:{id:'ADMIN-001',pw:'Admin@123',lb:'Admin ID'}};
const S={college:null,want:null,cu:'',cerr:'',users:[],cur:{student:'demo',alumni:'demo',faculty:'demo',admin:'demo'},aid:0,su:SU0(),suE:[],screen:'',lg:{r:'student',next:'home',err:'',id:'',pw:'',show:false},vw:0,edit:false,pf:PF,role:null,page:'home',q:'',tab:'tree',sel:0,city:'',mt:MT[0],f:{q:'',br:'',yr:'',mn:false},of:new Set(),user:{name:'Aarav Kapoor',br:'CSE',yr:2026,sk:['Python','React','DSA']},rid:10,act:0,grad:false,
req:[{id:1,aid:0,who:'Diya Malhotra',type:'Resume Review',st:'Pending',m:[]},{id:2,aid:1,who:'Kabir Sethi',type:'Career Guidance',st:'Pending',m:[]}],
nt:[{t:'An alumnus matching your career interest has joined.',r:0}],saved:new Set(),conn:new Set(),ap:new Set(),reg:new Set(),rep:[{id:3,t:'Post flagged as off-topic by a student'}],Q:[]};
const nt=m=>{S.nt.unshift({t:m,r:0});S.act++},tt=m=>{const e=$('#toast');e.textContent=m;e.className='on';clearTimeout(tt.h);tt.h=setTimeout(()=>e.className='',2600)};
