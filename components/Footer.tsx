"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { heading: 'Resources', links: [
      { label: 'Tax Guide', href: '/tax-guide' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Blog', href: '/blog' },
    ]},
    { heading: 'Legal', links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ]},
    { heading: 'Contact', links: [
      { label: 'Support', href: '/support' },
      { label: 'Feedback', href: '/feedback' },
    ]},
  ];
  
  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-200 dark:border-dark-border transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-white mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                  <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Indian Tax 2025</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your personal tax assistant for optimizing savings under the Indian Tax Regime 2025.
            </p>
          </div>
          
          {/* Links sections */}
          {footerLinks.map((section) => (
            <div key={section.heading} className="col-span-1">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">{section.heading}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-6 border-t border-gray-200 dark:border-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {currentYear} Indian Tax Consultation System. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Disclaimer: This tool provides general information and should not be considered as legal or financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 