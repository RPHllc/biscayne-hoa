import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Sun,
  CreditCard,
  Waves,
  Calendar,
  Clock,
  ChevronRight,
  Lock,
} from 'lucide-react';

const Card = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
      <Icon className="w-5 h-5 text-teal-600" />
      <h3 className="font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function HomePage() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-slate-900/40 z-10"></div>
        <div
          className="absolute inset-0 opacity-40 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('[https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=2000&q=80](https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=2000&q=80)')",
          }}
        ></div>
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
            <Link
              href="/portal"
              className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Resident Login
            </Link>
            <Link
              href="/arb"
              className="bg-white text-teal-800 border-2 border-teal-700 px-6 py-2 rounded-lg font-medium hover:bg-teal-50 transition-all"
            >
              ARB Applications
            </Link>
          </div>
        </div>
      </div>

      {/* Community Updates Row */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Community Updates
            </h2>
            <p className="text-slate-500">
              The latest news and announcements for residents.
            </p>
          </div>
          <button className="text-teal-700 font-medium hover:bg-slate-100 px-4 py-2 rounded-lg hidden md:flex items-center gap-2">
            View Archive <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Annual Board Meeting',
              date: 'Dec 30, 2025',
              category: 'Meeting',
              icon: Calendar,
            },
            {
              title: 'Entrance Gate Maintenance',
              date: 'Ongoing',
              category: 'Security',
              icon: Shield,
            },
            {
              title: 'Holiday Decoration Contest',
              date: 'Dec 2025',
              category: 'Social',
              icon: Sun,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-teal-200 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-700">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 mb-1 block">
                  {item.category}
                </span>
                <h4 className="font-bold text-slate-900 leading-tight mb-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Clock className="w-3 h-3" /> {item.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="24/7 Security" icon={Shield}>
          <p className="text-slate-600">
            Direct line to the guardhouse and community patrol updates.
          </p>
        </Card>
        <Card title="Events & News" icon={Sun}>
          <p className="text-slate-600">
            Upcoming block parties and board meetings.
          </p>
        </Card>
        <Card title="Pay Dues Online" icon={CreditCard}>
          <p className="text-slate-600">
            Secure portal for assessments and voluntary contributions.
          </p>
        </Card>
      </div>
    </div>
  );
}
