import { getChatGPTUser, chatGPTSignInPath } from "../chatgpt-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, LockKeyhole, PenLine, Megaphone } from "lucide-react";
export const metadata: Metadata = { title: "Entrar | Arceuz", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Page() {
 const user = await getChatGPTUser();
 if (user) redirect('/painel');
 return <main className="login"><section className="login-story"><div className="brand"><img src="/arceuz-logo.png" alt=""/><div>ARCEUZ<small>BUSINESS TOOLS</small></div></div><img src="/arceuz-logo.png" alt="Emblema Arceuz"/><div><h1>Seu negócio.<br/>Sua próxima<br/><span>grande ideia.</span></h1><p>Um espaço para transformar ideias em conteúdo e dar mais direção ao seu marketing.</p></div><footer>ARCEUZ · MARKETING & CONTEÚDO</footer></section><section className="login-form"><div className="login-box"><a className="login-back" href="/">← Voltar para o site</a><div className="eyebrow">BEM-VINDO À ARCEUZ</div><h2>Suas ideias começam aqui.</h2><p>Acesse seu espaço de trabalho e organize o marketing do seu negócio.</p><a className="btn btn-primary" href={chatGPTSignInPath('/painel')} target="_top"><LockKeyhole size={17}/>Entrar com ChatGPT</a><div className="login-benefit"><PenLine/>Crie e salve conteúdos para sua marca</div><div className="login-benefit"><CalendarDays/>Organize seu calendário de posts</div><div className="login-benefit"><Megaphone/>Planeje campanhas com clareza</div><small>Use sua conta individual do ChatGPT. Seus conteúdos e informações do negócio ficam separados dos de outros usuários.</small></div></section></main>;
}
