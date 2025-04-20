# Indian Tax Consultation System 2025

A comprehensive tax planning and optimization application for the Indian Tax Regime 2025, designed to help users minimize their tax liability legally through informed investment decisions, deduction optimization, and regime comparison.

## Features

- **Tax Calculator**:
  - Analyze tax liability under both old and new tax regimes
  - Calculate optimal deductions and exemptions (Section 80C, 80D, HRA, etc.)
  - Visualize savings between tax regimes
  - Special handling for Section 87A rebate for eligible taxpayers

- **AI Tax Consultant**:
  - Interactive chat interface for personalized tax advice
  - Detailed explanations of tax laws and regulations
  - Investment recommendations based on user's financial profile
  - Step-by-step guidance for tax optimization

- **Tax Analytics Dashboard**:
  - Visual comparison of tax regimes
  - Monthly tax liability visualization
  - Breakdown of deductions and exemptions
  - Income source analysis

- **User Experience**:
  - Modern, responsive UI for all device sizes
  - Dark mode support
  - Accessibility-focused design
  - Real-time calculations

## Technology Stack

- **Frontend**: React.js 18
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Form Handling**: React Hook Form
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/indian-tax-consultation-system.git
   cd indian-tax-consultation-system
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

1. Build the application
   ```bash
   npm run build
   ```

2. Start the production server
   ```bash
   npm start
   ```

## Usage

### Tax Calculator

1. Navigate to `/calculator` in the application
2. Enter your income details, including:
   - Basic salary
   - HRA received
   - LTA and other allowances
   - Rent paid (if applicable)
3. Enter your deduction details:
   - Section 80C investments
   - Health insurance premiums
   - NPS contributions
   - Home loan interest
4. Click "Calculate My Tax Savings" to view:
   - Comparison between old and new tax regimes
   - Personalized tax-saving recommendations
   - Maximum potential tax savings

### AI Tax Consultant

1. Navigate to `/chat` in the application
2. Ask questions about:
   - Tax regime differences
   - Specific deductions and exemptions
   - Investment strategies for tax saving
   - HRA and home loan benefits
3. Receive personalized recommendations based on your financial situation

## Project Structure

```
├── app/                  # Next.js application routes
│   ├── calculator/       # Tax calculator page
│   ├── chat/             # AI tax consultant interface
│   ├── dashboard/        # Tax analytics dashboard
│   └── about/            # About page
├── components/           # Reusable React components
├── utils/                # Utility functions
│   └── taxCalculations.ts # Tax calculation logic
├── public/               # Static assets
└── styles/               # Global styles
```

## Contributing

We welcome contributions to improve the Indian Tax Consultation System!

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Update documentation for any new features
- Add tests for new functionality
- Ensure all tests pass before submitting a PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is designed for educational and informational purposes only. While we strive to provide accurate and up-to-date information, tax laws and regulations are subject to change. Users should consult with a qualified tax professional for personalized tax advice tailored to their specific circumstances.

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Charting library 