import { z } from 'zod';
export const profileSchema = z.object({business:z.string().trim().max(100),segment:z.string().trim().max(100),audience:z.string().trim().max(300),tone:z.enum(['Profissional','Descontraído','Inspirador'])});
const dateValue = z.string().refine(v => !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0,10)===v), 'Data inválida');
export const recordSchema = z.object({id:z.string().uuid().optional(),kind:z.enum(['post','campaign','message']),title:z.string().trim().min(1,'Preencha o título').max(160),content:z.string().trim().max(12000),channel:z.enum(['Instagram','Facebook','TikTok','LinkedIn','WhatsApp','E-mail']),status:z.enum(['Rascunho','Planejado','Publicado','Em andamento','Concluído']),date:dateValue,endDate:dateValue,budget:z.number().finite().min(0).max(100000000),goal:z.string().trim().max(500)}).refine(r=>r.status!=='Planejado'||!!r.date,{message:'Escolha uma data para planejar o conteúdo'}).refine(r=>!r.endDate||!!r.date&&r.endDate>=r.date,{message:'O fim da campanha deve ser igual ou posterior ao início'});
export type Profile=z.infer<typeof profileSchema>;
export type Entry=z.infer<typeof recordSchema>&{id:string;updatedAt?:string};
export const blankProfile:Profile={business:'',segment:'',audience:'',tone:'Profissional'};
export const blankEntry:Entry={id:'',kind:'post',title:'',content:'',channel:'Instagram',status:'Rascunho',date:'',endDate:'',budget:0,goal:''};
export const channels=['Instagram','Facebook','TikTok','LinkedIn','WhatsApp','E-mail'];
export function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function dateLabel(d:string){return d?new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}):'Sem data';}
export function makeCaption(input:{topic:string;details:string;goal:string;tone:string;channel:string;cta:string;format:string},profile:Profile){
 const {topic,details,goal,tone,channel,cta,format}=input;
 const brand=profile.business||'Nossa equipe';
 const friendly=tone==='Descontraído';
 const opener=goal==='Vender'?(friendly?`Tem novidade boa por aqui: ${topic}!`:`Conheça ${topic}.`):goal==='Conectar'?(friendly?`Vamos conversar sobre ${topic}?`:`O que ${topic} significa para você?`):(friendly?`Bora falar sobre ${topic}?`:`Um olhar sobre ${topic}.`);
 const chosenOpener=tone==='Inspirador'?`Toda transformação começa com uma ideia. Hoje, a nossa é ${topic}.`:opener;
 const text=details.trim() || `Na ${brand}, esse assunto faz parte da nossa conversa com você.`;
 const ending=cta.trim() || (goal==='Vender'?'Fale com a nossa equipe para saber mais.':goal==='Conectar'?'Conte sua experiência nos comentários.':'Salve este conteúdo para consultar depois.');
 if(format==='Roteiro de vídeo')return `ABERTURA\n${chosenOpener}\n\nDESENVOLVIMENTO\n${text}\n\nENCERRAMENTO\n${ending}\n\nTexto na tela: ${topic}`;
 if(format==='Carrossel')return `SLIDE 1 — CAPA\n${chosenOpener}\n\nSLIDE 2 — CONTEXTO\n${text}\n\nSLIDE 3 — CONVERSA\nQual é a sua experiência com ${topic}?\n\nSLIDE 4 — PRÓXIMO PASSO\n${ending}\n\nLEGENDA\n${chosenOpener}\n${text}\n${ending}`;
 const sign=channel==='LinkedIn'?`\n\n${brand}`:'';
 return `${chosenOpener}\n\n${text}\n\n${ending}${sign}`;
}
export const messageTemplates=[{id:'welcome',name:'Boas-vindas',description:'Comece uma conversa com um novo cliente.',body:'Olá, {cliente}! Que bom ter você por aqui. Sou da {empresa}. Como podemos ajudar você hoje?'},{id:'followup',name:'Retomar contato',description:'Continue uma conversa que ficou em aberto.',body:'Olá, {cliente}! Tudo bem? Passando para saber se conseguiu ver as informações que enviamos. Ficou alguma dúvida? A equipe da {empresa} está à disposição.'},{id:'offer',name:'Apresentar uma novidade',description:'Compartilhe uma oferta com quem já conhece você.',body:'Olá, {cliente}! Temos uma novidade na {empresa}: {novidade}. Quer que eu envie mais detalhes?'},{id:'thanks',name:'Agradecimento',description:'Fortaleça o relacionamento depois da compra.',body:'Olá, {cliente}! Obrigado por escolher a {empresa}. Esperamos que tenha uma ótima experiência. Se precisar de algo, é só chamar por aqui.'}];
