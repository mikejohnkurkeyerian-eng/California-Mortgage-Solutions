'use client';

import type { Metadata } from 'next'
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { DocumentProvider } from "@/context/DocumentContext";
import { BrokerProvider } from "@/context/BrokerContext";
import { ToastProvider } from "@/context/ToastContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

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
                <Footer />
              </DocumentProvider>
            </ToastProvider>
          </BrokerProvider>
        </Providers>
      </body>
    </html>
  );
}
