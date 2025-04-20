# Tax AI Advisor

An AI-powered tax consultation platform that helps Indian taxpayers make informed decisions about tax regimes, deductions, and savings opportunities.

## ✨ Features

- 🤖 Ask tax-related questions in natural language
- 📊 Compare old and new tax regimes with personalized analysis
- 💸 Get actionable advice to maximize tax savings
- 🚀 Real-time responses powered by OpenAI
- 🔒 Secure handling of financial data
- 📱 Responsive design for all devices

## 📸 Demo

![Application Demo](./demo-placeholder.gif)
*Demo screenshot coming soon*

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/tax-ai-advisor.git
   cd tax-ai-advisor
   ```

2. Install the dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your OpenAI API key
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

## 🌐 Deployed Application

Try the application live at: [https://tax-ai-advisor.vercel.app](https://tax-ai-advisor.vercel.app) *(coming soon)*

## 🔑 Setting Up OpenAI API Key

This application requires an OpenAI API key to function properly:

1. Create an account at [OpenAI](https://platform.openai.com/signup)
2. Generate an API key in your dashboard
3. Add your API key to the `.env.local` file:
   ```
   OPENAI_API_KEY=your_api_key_goes_here
   ```

## 🔒 Security Note

Your OpenAI API key should be kept confidential. Never commit your `.env.local` file to version control or share your API key publicly.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 