require('dotenv').config();
const express=require('express'),cors=require('cors'),path=require('path'),rate=require('express-rate-limit');
const app=express();
app.use(express.json({limit:'100kb'}));
app.use(cors({origin:process.env.CORS_ORIGIN||true}));
app.use('/api',rate({windowMs:60_000,max:300}));           // basic abuse protection
app.use('/api',require('./routes/auth'));
app.use('/api/alumni',require('./routes/alumni'));
app.use('/api/mentorship',require('./routes/mentorship'));
app.use('/api/opportunities',require('./routes/opportunities'));
app.use('/api/admin',require('./routes/admin'));
app.use(express.static(path.join(__dirname,'../../frontend'))); // serves the frontend too
app.use((e,req,res,next)=>{console.error(e);res.status(500).json({error:'Something went wrong'})});
app.listen(process.env.PORT||4000,()=>console.log('AlumNexus running on port '+(process.env.PORT||4000)));
