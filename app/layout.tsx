import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import ThemeProvider from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Indian Tax Consultation System 2025',
  description: 'Personalized tax-saving strategies for the Indian Tax Regime 2025',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen transition-colors duration-300`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto py-8 px-4 flex-grow">
              {children}
            </main>
            <Footer />
            <AIAssistant />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 