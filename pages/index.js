import Head from 'next/head'
import ChatComponent from '../components/ChatComponent'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>TaxAI | Your AI Tax Assistant</title>
        <meta name="description" content="Get expert tax advice with TaxAI - your AI-powered tax assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">TaxAI</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your AI-powered tax assistant. Ask questions about tax regulations, deductions, 
            filing procedures, and get instant answers tailored to your situation.
          </p>
        </header>

        <ChatComponent />
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} TaxAI. All rights reserved.</p>
          <p className="mt-1">Powered by OpenAI GPT technology</p>
        </footer>
      </main>
    </div>
  )
} 