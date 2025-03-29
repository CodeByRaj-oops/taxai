"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Demo data
const taxComparisonData = [
  { name: 'Old Regime', tax: 125000, fill: '#3b82f6' },
  { name: 'New Regime', tax: 110000, fill: '#10b981' },
];

const monthlyTaxData = [
  { name: 'Apr', oldRegime: 10500, newRegime: 9200 },
  { name: 'May', oldRegime: 10500, newRegime: 9200 },
  { name: 'Jun', oldRegime: 10500, newRegime: 9200 },
  { name: 'Jul', oldRegime: 10500, newRegime: 9200 },
  { name: 'Aug', oldRegime: 10500, newRegime: 9200 },
  { name: 'Sep', oldRegime: 10500, newRegime: 9200 },
  { name: 'Oct', oldRegime: 10500, newRegime: 9200 },
  { name: 'Nov', oldRegime: 10500, newRegime: 9200 },
  { name: 'Dec', oldRegime: 10800, newRegime: 9300 },
  { name: 'Jan', oldRegime: 10800, newRegime: 9300 },
  { name: 'Feb', oldRegime: 10800, newRegime: 9300 },
  { name: 'Mar', oldRegime: 10800, newRegime: 9300 },
];

const taxDeductionsData = [
  { name: 'Section 80C', value: 150000, fill: '#3b82f6' },
  { name: 'Section 80D', value: 25000, fill: '#10b981' },
  { name: 'HRA Exemption', value: 120000, fill: '#f59e0b' },
  { name: 'Home Loan Interest', value: 200000, fill: '#8b5cf6' },
  { name: 'NPS', value: 50000, fill: '#ec4899' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const taxBreakupData = [
  { name: 'Basic Tax', value: 92000 },
  { name: 'Surcharge', value: 9200 },
  { name: 'Health & Education Cess', value: 4300 },
];

const incomeSources = [
  { name: 'Salary', value: 1800000 },
  { name: 'Rental Income', value: 240000 },
  { name: 'Interest Income', value: 60000 },
  { name: 'Capital Gains', value: 100000 },
];

// Staggered animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

// Card component
const Card = ({ 
  children, 
  className = '', 
  index = 0 
}: { 
  children: React.ReactNode, 
  className?: string,
  index?: number
}) => (
  <motion.div
    className={`bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-5 ${className}`}
    variants={fadeInUp}
    custom={index}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.div>
);

// Stat card component
const StatCard = ({ 
  title, 
  value, 
  description, 
  trend, 
  index = 0 
}: { 
  title: string, 
  value: string, 
  description: string, 
  trend?: { value: number, label: string },
  index?: number
}) => (
  <Card index={index} className="flex flex-col">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      {trend && (
        <span className={`flex items-center text-xs px-2 py-0.5 rounded-full ${
          trend.value > 0 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{value}</div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </Card>
);

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card p-3 border border-gray-200 dark:border-dark-border rounded-md shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.fill || entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [activeYear, setActiveYear] = useState('2025-26');
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">Tax Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Personalized tax insights and analytics for FY {activeYear}</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={activeYear}
            onChange={(e) => setActiveYear(e.target.value)}
            className="bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="2025-26">FY 2025-26</option>
            <option value="2024-25">FY 2024-25</option>
          </select>
          <Link
            href="/calculator"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Update Tax Data
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard 
          title="Total Income" 
          value="₹22,00,000" 
          description="Gross annual income before deductions" 
          trend={{ value: 12, label: 'vs. last year' }}
          index={0}
        />
        <StatCard 
          title="Tax Payable" 
          value="₹1,10,000" 
          description="Based on New Tax Regime" 
          trend={{ value: -12, label: 'tax saving' }}
          index={1}
        />
        <StatCard 
          title="Post-tax Income" 
          value="₹20,90,000" 
          description="Net income after tax deductions" 
          index={2}
        />
        <StatCard 
          title="Total Deductions" 
          value="₹5,45,000" 
          description="Sum of all eligible deductions" 
          index={3}
        />
      </div>

      {/* Main dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Tax regime comparison */}
        <Card className="lg:col-span-2" index={4}>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Tax Regime Comparison</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taxComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="tax" name="Tax Amount (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full mr-3 text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-400">Recommendation</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  The New Tax Regime is more beneficial for you, saving ₹15,000 in taxes. This is primarily due to your lower investments in tax-saving instruments.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Deductions breakdown */}
        <Card index={5}>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Deductions Breakdown</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxDeductionsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taxDeductionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Total deductions:</span>
              <span className="font-semibold">₹5,45,000</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Monthly tax trend */}
        <Card index={6}>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Monthly Tax Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTaxData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="oldRegime" name="Old Regime" stroke="#3b82f6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="newRegime" name="New Regime" stroke="#10b981" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Income Sources */}
        <Card index={7}>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Income Sources</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={incomeSources}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name="Amount (₹)" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Optimization suggestions */}
      <Card className="mb-8" index={8}>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Tax Optimization Suggestions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Increase NPS Contribution</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              You can save an additional ₹5,000 in taxes by maximizing your NPS contribution to reach the full ₹50,000 limit under Section 80CCD(1B).
            </p>
            <Link href="/calculator" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline">
              Calculate savings →
            </Link>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">Health Insurance Premium</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
              Consider getting a health insurance policy for your parents to claim an additional deduction of up to ₹50,000 under Section 80D.
            </p>
            <Link href="/calculator" className="text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline">
              Calculate savings →
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
} 