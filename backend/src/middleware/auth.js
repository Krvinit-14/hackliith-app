// JWT authentication and role-based access control.
const jwt=require('jsonwebtoken'),SECRET=process.env.JWT_SECRET;
if(!SECRET)throw new Error('Set JWT_SECRET in your .env file');
exports.sign=u=>jwt.sign({id:u.id,role:u.role,college:u.college_id},SECRET,{expiresIn:'8h'});
exports.auth=(req,res,next)=>{try{req.user=jwt.verify((req.headers.authorization||'').replace('Bearer ',''),SECRET);next()}catch{res.status(401).json({error:'Please sign in'})}};
exports.allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({error:'Not allowed for your role'});
