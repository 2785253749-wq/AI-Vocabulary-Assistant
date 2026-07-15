import type { Metadata } from 'next';
import ClientWrapper from '@/components/ClientWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI单词助手 - AI Vocabulary Learning Assistant',
  description: '基于AI的智能英语单词学习助手，提供个性化单词学习体验',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 antialiased">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
