import { ArrowRight, ArrowUpRight, CalendarDays, Check, FolderOpen, LockKeyhole, Megaphone, MessageSquareText, PenLine, Sparkles } from 'lucide-react';
import { assistantEnabled } from '@/lib/assistant-model';
import { PublicFAQ, ProductPreview } from './public-experience';

export const dynamic = 'force-dynamic';

const features = [
  { icon: PenLine, title: 'Uma ideia vira conteúdo.', description: 'Crie modelos de legendas, carrosséis e roteiros com as informações da sua marca. Edite até ficar com a sua cara.', tag: 'CRIADOR DE CONTEÚDO' },
  { icon: CalendarDays, title: 'Cada post no seu momento.', description: 'Organize as próximas publicações em um calendário e acompanhe o que está planejado para a sua marca.', tag: 'CALENDÁRIO EDITORIAL' },
  { icon: Megaphone, title: 'Campanhas com direção.', description: 'Reúna objetivo, orçamento, datas e ações. Tenha um plano claro antes de colocar sua campanha no mundo.', tag: 'PLANEJADOR DE CAMPANHAS' },
  { icon: MessageSquareText, title: 'Comece uma boa conversa.', description: 'Personalize modelos para atender, apresentar novidades e retomar o contato com seus clientes.', tag: 'MODELOS DE MENSAGENS' },
  { icon: FolderOpen, title: 'Suas ideias têm um lugar.', description: 'Guarde textos, rascunhos e mensagens em uma biblioteca só sua. Volte quando quiser e continue de onde parou.', tag: 'BIBLIOTECA DE CONTEÚDOS' },
];

function Logo() {
  return <a href="/" className="public-brand" aria-label="Arceuz, página inicial"><img src="/arceuz-logo.png" width="40" height="48" alt="" /><span>ARCEUZ<small>BUSINESS TOOLS</small></span></a>;
}

export default function PublicPage() {
  const aiEnabled = assistantEnabled();
  return (
    <div className="public-site">
      <a className="public-skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="public-header">
        <div className="public-container public-nav">
          <Logo />
          <nav className="public-nav-links" aria-label="Navegação principal"><a href="#ferramentas">Ferramentas</a><a href="#como-funciona">Como funciona</a><a href="#duvidas">Dúvidas</a></nav>
          <a href="/entrar" className="public-login">Entrar no painel<ArrowUpRight size={17} /></a>
        </div>
      </header>
      <main id="conteudo">
        <section className="public-hero">
          <div className="public-container public-hero-grid">
            <div className="public-hero-copy">
              <div className="public-eyebrow"><span />IDEIAS QUE MOVEM NEGÓCIOS</div>
              <h1>Seu próximo<br />grande passo<br />começa <em>aqui.</em></h1>
              <p>Crie conteúdo. Organize suas campanhas. Dê mais direção ao seu negócio, com ferramentas que cabem na sua rotina.</p>
              <div className="public-actions"><a className="public-button" href="/entrar">Começar meu planejamento<ArrowRight size={19} /></a><a className="public-text-link" href="#ferramentas">Conhecer as ferramentas</a></div>
              <div className="public-hero-note"><LockKeyhole size={14} />Seu login. Suas ideias. Seu espaço.</div>
            </div>
            <div className="public-hero-art">
              <div className="public-art-label"><span>ARCEUZ / BUSINESS TOOLS</span><span>01 — CRIAR</span></div>
              <img className="public-emblem" src="/arceuz-logo.png" width="440" height="500" alt="Emblema laranja da Arceuz" fetchPriority="high" />
              <div className="public-floating public-floating-top"><span className="public-small-icon"><PenLine size={19} /></span><div><strong>Da ideia ao rascunho.</strong><span>Dê forma ao que você imagina.</span></div><ArrowUpRight size={19} /></div>
              <div className="public-floating public-floating-bottom"><span className="public-small-icon"><CalendarDays size={19} /></span><div><strong>Mais clareza. Mais constância.</strong><span>Um próximo passo de cada vez.</span></div></div>
              <span className="public-art-caption">A PRÓXIMA BOA IDEIA É SUA.</span>
            </div>
          </div>
          <div className="public-container public-hero-bottom"><span>FEITO PARA QUEM FAZ ACONTECER.</span><p>Pequenos negócios<span />Profissionais autônomos<span />Marcas em construção</p></div>
        </section>

        <section className="public-section public-tools" id="ferramentas">
          <div className="public-container">
            <div className="public-section-heading"><div><span className="public-eyebrow">MENOS ABAS ABERTAS. MAIS FOCO.</span><h2>Seu marketing.<br />Em um só lugar.</h2></div><p>Do primeiro rascunho ao planejamento da semana, encontre ferramentas para tirar suas ideias do papel.</p></div>
            <div className="public-feature-grid">
              {features.map(({ icon: Icon, title, description, tag }, i) => <article className="public-feature" key={tag}><div className="public-feature-top"><Icon size={26} strokeWidth={1.6} /><span>0{i + 1}</span></div><span className="public-feature-tag">{tag}</span><h3>{title}</h3><p>{description}</p><a href="/entrar">Acessar ferramenta<ArrowUpRight size={17} /></a></article>)}
              <article className="public-feature public-feature-ai"><div className="public-feature-top"><Sparkles size={26} strokeWidth={1.6} /><span className="public-ai-badge">{aiEnabled ? 'DISPONÍVEL' : 'EM PREPARAÇÃO'}</span></div><span className="public-feature-tag">ASSISTENTE IA</span><h3>Uma ajuda para o próximo passo.</h3><p>{aiEnabled ? 'Converse sobre seu negócio, peça ideias e transforme sugestões em rascunhos para revisar e salvar.' : 'Um assistente para conversar sobre seu negócio, desenvolver ideias e ajudar na criação de textos. A ativação está em preparação.'}</p>{aiEnabled ? <a href="/entrar">Conhecer o assistente<ArrowUpRight size={17} /></a> : <span className="public-ai-note">Em breve no seu espaço de trabalho.</span>}</article>
            </div>
          </div>
        </section>

        <section className="public-section public-preview-section" aria-labelledby="preview-title">
          <div className="public-container public-preview-layout"><div className="public-preview-copy"><span className="public-eyebrow">DA IDEIA À AÇÃO</span><h2 id="preview-title">Organização que<br />abre espaço<br />para criar.</h2><p>Seu negócio já exige muito de você. O planejamento do conteúdo pode ser mais simples.</p><ul><li><Check size={18} />Um lugar para registrar suas ideias</li><li><Check size={18} />Textos que você pode revisar e editar</li><li><Check size={18} />Clareza sobre o que vem a seguir</li></ul><a className="public-text-link public-dark-link" href="/entrar">Abrir meu espaço<ArrowRight size={18} /></a></div><ProductPreview /></div>
        </section>

        <section className="public-section public-how" id="como-funciona">
          <div className="public-container"><div className="public-section-heading"><div><span className="public-eyebrow">SIMPLES PARA COMEÇAR</span><h2>Três passos.<br />Muitas possibilidades.</h2></div><p>Você traz o conhecimento sobre o seu negócio. A Arceuz ajuda a organizar o caminho.</p></div><ol className="public-steps"><li><span>01</span><h3>Entre no seu espaço.</h3><p>Acesse com sua conta individual do ChatGPT. Seus conteúdos ficam vinculados ao seu usuário.</p></li><li><span>02</span><h3>Apresente sua marca.</h3><p>Informe seu segmento, público e tom de voz para manter suas ideias alinhadas ao seu negócio.</p></li><li><span>03</span><h3>Crie. Planeje. Continue.</h3><p>Prepare textos, organize campanhas e salve tudo para revisar e publicar nos seus canais.</p></li></ol></div>
        </section>

        <section className="public-section public-faq-section" id="duvidas"><div className="public-container public-faq-layout"><div><span className="public-eyebrow">ANTES DO PRIMEIRO PASSO</span><h2>Ficou com<br />alguma dúvida?</h2><p>O essencial para começar com clareza.</p></div><PublicFAQ aiEnabled={aiEnabled} /></div></section>

        <section className="public-final"><div className="public-container public-final-inner"><div><span className="public-eyebrow">SEU NEGÓCIO, EM MOVIMENTO</span><h2>Uma boa ideia merece<br />sair do rascunho.</h2><p>Seu próximo passo pode começar agora.</p></div><a className="public-button public-button-black" href="/entrar">Entrar na Arceuz<ArrowUpRight size={20} /></a></div></section>
      </main>
      <footer className="public-footer"><div className="public-container"><div className="public-footer-top"><Logo /><p>Ferramentas para transformar<br />ideias em próximos passos.</p><nav aria-label="Navegação do rodapé"><a href="#ferramentas">Ferramentas</a><a href="#como-funciona">Como funciona</a><a href="/entrar">Acessar meu painel<ArrowUpRight size={14} /></a></nav></div><div className="public-footer-bottom"><span>© {new Date().getFullYear()} Arceuz</span><span>SEU ESPAÇO. SEU RITMO.</span><a href="#conteudo">Voltar ao topo ↑</a></div></div></footer>
    </div>
  );
}
