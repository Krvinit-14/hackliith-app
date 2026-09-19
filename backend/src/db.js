// SQLite connection. Creates the tables on first run.
const Database=require('better-sqlite3'),fs=require('fs'),path=require('path');
const db=new Database(process.env.DB_FILE||'alumnexus.db');
db.pragma('journal_mode = WAL');db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf8'));
module.exports=db;
