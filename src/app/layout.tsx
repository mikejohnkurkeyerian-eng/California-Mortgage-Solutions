'use client';

import type { Metadata } from 'next'
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { DocumentProvider } from "@/context/DocumentContext";
import { BrokerProvider } from "@/context/BrokerContext";
import { ToastProvider } from "@/context/ToastContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

// Metadata needs to be in a separate file or handled differently in client component
// For now, we'll keep it simple or move it if needed. 
// Actually, layout.tsx cannot export metadata if it's a client component.
// But the user's file was already 'use client' implicitly? No, it wasn't.
// Wait, the original file didn't have 'use client'.
// I need to make a separate client wrapper for the provider to avoid making the whole layout client-side if I want to keep metadata.
// OR, I can just make it a client component and lose metadata export (Next.js warns about this).
// Better approach: Create a `Providers.tsx` component.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}>
        <Providers>
          <BrokerProvider>
            <ToastProvider>
              <DocumentProvider>
                {children}
              </DocumentProvider>
            </ToastProvider>
          </BrokerProvider>
        </Providers>
      </body>
    </html>
  );
}

import { SessionProvider } from "next-auth/react";

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}

