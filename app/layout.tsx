import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

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
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-primary text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Indian Tax Consultation 2025</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="hover:text-accent">Home</a></li>
                <li><a href="/calculator" className="hover:text-accent">Tax Calculator</a></li>
                <li><a href="/about" className="hover:text-accent">About</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4">{children}</main>
        <footer className="bg-gray-100 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Indian Tax Consultation System. All rights reserved.</p>
            <p className="text-sm mt-2">Disclaimer: This tool provides general information and should not be considered as legal or financial advice.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 