import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Arceuz | Marketing e conteúdo", description: "Seu espaço para criar conteúdos, organizar campanhas e planejar a presença digital do seu negócio.", icons: { icon: "/arceuz-logo.png", shortcut: "/arceuz-logo.png" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
