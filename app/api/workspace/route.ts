import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from '@/lib/database';
import { profileSchema,recordSchema,blankProfile } from '@/lib/arceuz';
import { z } from 'zod';
export const dynamic='force-dynamic';
function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});}
function checkOrigin(req:Request){const origin=req.headers.get('origin');return (!origin||origin===new URL(req.url).origin)&&req.headers.get('sec-fetch-site')!=='cross-site';}
export async function GET(){
 const user=await getChatGPTUser();if(!user)return json({error:'Entre na sua conta para continuar.'},401);
 try{const db=database();const [records,profile]=await Promise.all([db.prepare('SELECT id,kind,title,content,channel,status,date,end_date AS endDate,budget,goal,updated_at AS updatedAt FROM entries WHERE user_id=? ORDER BY updated_at DESC').bind(user.userId).all(),db.prepare('SELECT business,segment,audience,tone FROM profiles WHERE user_id=?').bind(user.userId).first()]);return json({entries:records.results,profile:profile||blankProfile});}catch(e){console.error('Workspace read failed',e);return json({error:'Não foi possível carregar seus conteúdos. Tente novamente.'},503);}
}
export async function POST(req:Request){
 const user=await getChatGPTUser();if(!user)return json({error:'Sua sessão terminou. Entre novamente.'},401);if(!checkOrigin(req))return json({error:'Origem não autorizada.'},403);
 try{const raw=await req.text();if(raw.length>22000)return json({error:'Conteúdo muito longo.'},413);let body;try{body=JSON.parse(raw)}catch{return json({error:'Dados inválidos.'},400)}
 if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'Dados inválidos.'},400);
 const db=database();
 if(body.action==='profile'){const parsed=profileSchema.safeParse(body.profile);if(!parsed.success)return json({error:'Confira os dados do negócio.'},400);const p=parsed.data;await db.prepare('INSERT INTO profiles (user_id,business,segment,audience,tone) VALUES (?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET business=excluded.business,segment=excluded.segment,audience=excluded.audience,tone=excluded.tone').bind(user.userId,p.business,p.segment,p.audience,p.tone).run();return json({profile:p});}
 if(body.action==='delete'){const id=z.string().uuid().safeParse(body.id);if(!id.success)return json({error:'Conteúdo inválido.'},400);const result=await db.prepare('DELETE FROM entries WHERE id=? AND user_id=?').bind(id.data,user.userId).run();if(!result.meta.changes)return json({error:'Conteúdo não encontrado.'},404);return json({ok:true});}
 if(body.action!=='save')return json({error:'Ação inválida.'},400);
 const parsed=recordSchema.safeParse(body.entry);if(!parsed.success)return json({error:parsed.error.issues[0]?.message||'Confira os campos.'},400);
 const e=parsed.data;const id=e.id||crypto.randomUUID();const updatedAt=new Date().toISOString();
 if(e.id){const result=await db.prepare('UPDATE entries SET kind=?,title=?,content=?,channel=?,status=?,date=?,end_date=?,budget=?,goal=?,updated_at=? WHERE id=? AND user_id=?').bind(e.kind,e.title,e.content,e.channel,e.status,e.date,e.endDate,e.budget,e.goal,updatedAt,id,user.userId).run();if(!result.meta.changes)return json({error:'Conteúdo não encontrado.'},404);}
 else{await db.prepare('INSERT INTO entries (id,user_id,kind,title,content,channel,status,date,end_date,budget,goal,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,user.userId,e.kind,e.title,e.content,e.channel,e.status,e.date,e.endDate,e.budget,e.goal,updatedAt).run();}
 return json({entry:{...e,id,updatedAt}},e.id?200:201);
 }catch(e){console.error('Workspace save failed',e);return json({error:'Não foi possível salvar. Seu texto foi mantido; tente novamente.'},503);}
}
