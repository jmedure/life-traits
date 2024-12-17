'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/use-toast';
import { SeasonalFavicon } from '@/components/SeasonalFavicon';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme-mode"
          forcedTheme={undefined}
        >
          <SeasonalFavicon />
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
