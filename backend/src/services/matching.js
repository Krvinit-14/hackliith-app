// Rule-based alumni matching. Replace score() with an ML model later; keep the same return shape.
const TOPICS=[
 {re:/software|develop|sde|coding|web|\bapp/i,branches:['CSE','IT'],skills:['DSA','Java','React','Python','JS','Cloud','Go','C++'],role:/engineer|developer/i,label:'software development'},
 {re:/data|\bml\b|machine|\bai\b/i,branches:['CSE','IT','ECE'],skills:['ML','Python','SQL','Excel'],role:/data|ml/i,label:'data science and AI'},
 {re:/product|manager|\bpm\b/i,branches:['IT','CSE'],skills:['Product','SQL','Design'],role:/product|manager/i,label:'product management'},
 {re:/embedded|vlsi|electronic|iot|chip/i,branches:['ECE'],skills:['C','VLSI','IoT','C++','DSP'],role:/embedded|electronics/i,label:'core electronics'},
 {re:/civil|structur|construct/i,branches:['CE'],skills:['AutoCAD','STAAD','Revit','Planning'],role:/structural|project/i,label:'civil engineering'},
 {re:/mechanic|automobile|manufactur|\bcad\b/i,branches:['ME'],skills:['CAD','Ansys','Lean','Design'],role:/design|manufact|graduate/i,label:'mechanical engineering'},
 {re:/secur|cyber|hack/i,branches:['CSE'],skills:['Security','Linux'],role:/security/i,label:'cybersecurity'}];
const list=s=>(s||'').split(',').map(x=>x.trim()).filter(Boolean);
exports.score=(student,goal,alum)=>{
  const t=TOPICS.find(x=>x.re.test(goal))||TOPICS.find(x=>x.branches[0]===student.branch)||TOPICS[0];
  const shared=list(alum.skills).filter(s=>t.skills.includes(s)||list(student.skills).includes(s));
  const s=(t.branches.includes(alum.branch)?25:0)+(alum.branch===student.branch?10:0)+shared.length*12+(t.role.test(alum.job_role||'')?30:0)
    +(alum.mentoring?10:0)+Math.min(10,(2026-alum.batch_year)*2)+5;
  return{score:Math.min(99,s),why:`Recommended because you are a ${student.branch} student interested in ${t.label} and this alumnus works as a ${alum.job_role} at ${alum.company}${shared.length?', with shared skills in '+shared.slice(0,3).join(', '):''}.`};
};
