import type { Metadata } from 'next';
import { requireChatGPTUser } from '../chatgpt-auth';
import Workspace from '../workspace';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Meu painel | Arceuz', robots: { index: false, follow: false } };
export default async function DashboardPage() {
  const user = await requireChatGPTUser('/painel');
  return <Workspace user={{ name: user.fullName || user.email.split('@')[0], email: user.email }} />;
}
