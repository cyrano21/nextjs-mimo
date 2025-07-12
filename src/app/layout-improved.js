'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { GamificationProvider } from '@/components/gamification/GamificationSystemImproved';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayoutImproved({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <GamificationProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              {children}
            </div>
          </GamificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

