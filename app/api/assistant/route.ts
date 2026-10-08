import { z } from 'zod';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from '@/lib/database';
import { assistantEnabled,generateAssistantReply,type ChatMessage } from '@/lib/assistant-model';
import type { Profile } from '@/lib/arceuz';
export const dynamic='force-dynamic';
const MAX_DAILY=30;
const inputSchema=z.object({requestId:z.string().uuid(),message:z.string().trim().min(1).max(4000),entryId:z.string().uuid().optional()}).strict();
function reply(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}})}
function allowedOrigin(req:Request){const origin=req.headers.get('origin');return (!origin||origin===new URL(req.url).origin)&&req.headers.get('sec-fetch-site')!=='cross-site'}
function usageKey(userId:string){return `${userId}:${new Date().toISOString().slice(0,10)}`}
async function history(userId:string){const result=await database().prepare('SELECT id,role,content,created_at AS createdAt FROM ai_messages WHERE user_id=? ORDER BY created_at DESC,id DESC LIMIT 40').bind(userId).all<ChatMessage>();return result.results.reverse()}
async function remaining(userId:string){const row=await database().prepare('SELECT count FROM ai_usage WHERE key=?').bind(usageKey(userId)).first<{count:number}>();return Math.max(0,MAX_DAILY-(row?.count||0))}
async function acquire(userId:string,token:string){const now=Date.now();return database().prepare('INSERT INTO ai_locks (user_id,token,expires_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET token=excluded.token,expires_at=excluded.expires_at WHERE ai_locks.expires_at<? RETURNING token').bind(userId,token,now+90000,now).first()}
async function release(userId:string,token:string){await database().prepare('DELETE FROM ai_locks WHERE user_id=? AND token=?').bind(userId,token).run()}
function logFailure(label:string,error:unknown){console.error(label,{name:error instanceof Error?error.name:'UnknownError'})}
export async function GET(){const user=await getChatGPTUser();if(!user)return reply({error:'Entre na sua conta para acessar o assistente.'},401);try{const [messages,left]=await Promise.all([history(user.userId),remaining(user.userId)]);return reply({messages,enabled:assistantEnabled(),remaining:left})}catch(e){logFailure('Assistant read failed',e);return reply({error:'Não foi possível carregar sua conversa. Tente novamente.'},503)}}
export async function POST(req:Request){
 const user=await getChatGPTUser();if(!user)return reply({error:'Sua sessão terminou. Entre novamente.'},401);if(!allowedOrigin(req))return reply({error:'Origem não autorizada.'},403);
 let token:string|null=null;let charged=false;let completed=false;const dayKey=usageKey(user.userId);
 try{
  const raw=await req.text();if(raw.length>18000)return reply({error:'Sua pergunta está muito longa.'},413);
  let body:unknown;try{body=JSON.parse(raw)}catch{return reply({error:'Pergunta inválida.'},400)}
  const parsed=inputSchema.safeParse(body);if(!parsed.success)return reply({error:'Envie uma pergunta de até 4.000 caracteres.'},400);const input=parsed.data;
  if(!assistantEnabled())return reply({error:'A IA ainda não foi ativada pelo responsável pela Arceuz.',code:'AI_NOT_CONFIGURED'},503);
  const db=database();
  const previous=await db.prepare("SELECT id FROM ai_messages WHERE user_id=? AND request_id=? AND role='assistant'").bind(user.userId,input.requestId).first();
  if(previous)return reply({messages:await history(user.userId),remaining:await remaining(user.userId)});
  const lockToken=crypto.randomUUID();if(!await acquire(user.userId,lockToken))return reply({error:'Já existe uma resposta sendo preparada. Aguarde um momento.'},409);token=lockToken;
  const recheck=await db.prepare("SELECT id FROM ai_messages WHERE user_id=? AND request_id=? AND role='assistant'").bind(user.userId,input.requestId).first();if(recheck)return reply({messages:await history(user.userId),remaining:await remaining(user.userId)});
  let entry:Record<string,unknown>|null=null;
  if(input.entryId){entry=await db.prepare('SELECT title,content,kind,channel,goal FROM entries WHERE id=? AND user_id=?').bind(input.entryId,user.userId).first();if(!entry)return reply({error:'Este conteúdo não está disponível na sua conta.'},404)}
  const [profile,messages]=await Promise.all([db.prepare('SELECT business,segment,audience,tone FROM profiles WHERE user_id=?').bind(user.userId).first<Profile>(),history(user.userId)]);
  const usage=await db.prepare('INSERT INTO ai_usage (key,count) VALUES (?,1) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(dayKey,MAX_DAILY).first<{count:number}>();
  if(!usage)return reply({error:'Você usou os 30 pedidos de hoje. Seus conteúdos continuam disponíveis; tente novamente amanhã.'},429);charged=true;
  const answer=await generateAssistantReply({profile,history:messages,message:input.message,entry});
  const now=Date.now();const userMessage:ChatMessage={id:crypto.randomUUID(),role:'user',content:input.message,createdAt:new Date(now).toISOString()};const assistantMessage:ChatMessage={id:crypto.randomUUID(),role:'assistant',content:answer,createdAt:new Date(now+1).toISOString()};
  await db.batch([db.prepare('INSERT INTO ai_messages (id,user_id,request_id,role,content,created_at) VALUES (?,?,?,?,?,?)').bind(userMessage.id,user.userId,input.requestId,userMessage.role,userMessage.content,userMessage.createdAt),db.prepare('INSERT INTO ai_messages (id,user_id,request_id,role,content,created_at) VALUES (?,?,?,?,?,?)').bind(assistantMessage.id,user.userId,input.requestId,assistantMessage.role,assistantMessage.content,assistantMessage.createdAt)]);completed=true;
  return reply({messages:[...messages,userMessage,assistantMessage].slice(-40),remaining:Math.max(0,MAX_DAILY-usage.count)});
 }catch(e){
  logFailure('Assistant request failed',e);const status=(e as {statusCode?:number})?.statusCode;
  if(status===429)return reply({error:'O serviço de IA atingiu seu limite temporário. Aguarde um pouco e tente novamente.'},429);
  if(status===401||status===403)return reply({error:'A conexão da IA precisa ser verificada pelo responsável pela Arceuz.'},503);
  return reply({error:'Não foi possível obter a resposta agora. Sua pergunta foi mantida; tente novamente.'},503);
 }finally{
  if(charged&&!completed){try{await database().prepare('UPDATE ai_usage SET count=MAX(count-1,0) WHERE key=?').bind(dayKey).run()}catch(e){logFailure('Assistant usage adjustment failed',e)}}
  if(token){try{await release(user.userId,token)}catch(e){logFailure('Assistant lock release failed',e)}}
 }
}
export async function DELETE(req:Request){const user=await getChatGPTUser();if(!user)return reply({error:'Entre na sua conta para continuar.'},401);if(!allowedOrigin(req))return reply({error:'Origem não autorizada.'},403);let locked=false;const token=crypto.randomUUID();try{if(!await acquire(user.userId,token))return reply({error:'Aguarde a resposta terminar antes de limpar a conversa.'},409);locked=true;await database().prepare('DELETE FROM ai_messages WHERE user_id=?').bind(user.userId).run();return reply({ok:true})}catch(e){logFailure('Assistant delete failed',e);return reply({error:'Não foi possível limpar sua conversa.'},503)}finally{if(locked){try{await release(user.userId,token)}catch(e){logFailure('Assistant lock release failed',e)}}}}
