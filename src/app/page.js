'use client';

import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Users,
  FileText,
  Calendar,
  CreditCard,
  Lock,
  Mail,
  ChevronRight,
  Shield,
  Download,
  ExternalLink,
  MapPin,
  Phone,
  Sun,
  Waves,
  ArrowRight,
  CheckCircle,
  Search,
} from 'lucide-react';

// --- UI Components ---
const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyle =
    'px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2';
  const variants = {
    primary:
      'bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-700/20',
    secondary:
      'bg-white text-teal-800 border-2 border-teal-700 hover:bg-teal-50',
    outline:
      'border border-slate-300 text-slate-600 hover:border-teal-600 hover:text-teal-700',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };
  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ title, children, className = '', icon: Icon }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow ${className}`}
  >
    {(title || Icon) && (
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        {Icon && <Icon className="w-5 h-5 text-teal-600" />}
        {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

// --- Page Content Components ---
const HomePage = ({ navigateTo }) => (
  <div className="space-y-12 animate-in fade-in duration-700">
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-slate-900/40 z-10"></div>
      <div className="absolute inset-0 opacity-40 z-0 bg-[url('[https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=2000&q=80](https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=2000&q=80)')] bg-cover bg-center"></div>
      <div className="relative z-20 py-24 px-8 md:px-16 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-sm font-medium mb-6">
          <Waves className="w-4 h-4" /> <span>Welcome Home</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Community, Security, &{' '}
          <span className="text-teal-300">Island Living</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl leading-relaxed">
          The official digital hub for the Biscayne Point Homeowners
          Association.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigateTo('portal')}>
            <Lock className="w-4 h-4" /> Resident Login
          </Button>
          <Button variant="secondary" onClick={() => navigateTo('arb')}>
            ARB Applications
          </Button>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <Shield className="w-10 h-10 text-teal-600 mb-4" />
        <h3 className="text-xl font-bold mb-2">24/7 Security</h3>
        <p className="text-slate-600">
          Direct line to the guardhouse and community patrol updates.
        </p>
      </Card>
      <Card>
        <Sun className="w-10 h-10 text-blue-600 mb-4" />
        <h3 className="text-xl font-bold mb-2">Events & News</h3>
        <p className="text-slate-600">
          Upcoming block parties and board meetings.
        </p>
      </Card>
      <Card>
        <CreditCard className="w-10 h-10 text-indigo-600 mb-4" />
        <h3 className="text-xl font-bold mb-2">Pay Dues Online</h3>
        <p className="text-slate-600">
          Secure portal for assessments and voluntary contributions.
        </p>
      </Card>
    </div>
  </div>
);

// --- Main App ---
export default function App() {
  const [page, setPage] = useState('home');
  const navigateTo = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigateTo('home')}
          >
            <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              BP
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">
                Biscayne Point
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                HOA
              </p>
            </div>
          </div>
          <nav className="hidden md:flex gap-4">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-teal-700 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('arb')}
              className="hover:text-teal-700 font-medium"
            >
              ARB
            </button>
            <button
              onClick={() => navigateTo('portal')}
              className="hover:text-teal-700 font-medium"
            >
              Portal
            </button>
            <Button onClick={() => navigateTo('contact')}>Contact</Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {page === 'home' && <HomePage navigateTo={navigateTo} />}
        {page === 'arb' && (
          <div className="p-8 bg-white rounded-xl">
            ARB Submission Content Placeholder
          </div>
        )}
        {page === 'portal' && (
          <div className="p-8 bg-white rounded-xl">
            Resident Portal Content Placeholder
          </div>
        )}
        {page === 'contact' && (
          <div className="p-8 bg-white rounded-xl">
            Contact Form Placeholder
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
        <p>
          &copy; {new Date().getFullYear()} Biscayne Point Homeowners
          Association.
        </p>
      </footer>
    </div>
  );
}
