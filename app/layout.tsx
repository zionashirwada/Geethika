
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Geethika.db - Music Library',
  description: 'Your personal music database',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <SidebarProvider>
        {children}
        </SidebarProvider>
      </body>
    </html>
  );
}