import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Users, FileText, Calendar, CreditCard, 
  Lock, Mail, ChevronRight, Shield, Download, ExternalLink,
  MapPin, Phone, Sun, Waves, ArrowRight, CheckCircle, Search
} from 'lucide-react';

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-700/20",
    secondary: "bg-white text-teal-800 border-2 border-teal-700 hover:bg-teal-50",
    outline: "border border-slate-300 text-slate-600 hover:border-teal-600 hover:text-teal-700",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-600 hover:bg-rose-700 text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ title, children, className = '', icon: Icon }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
    {(title || Icon) && (
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        {Icon && <Icon className="w-5 h-5 text-teal-600" />}
        {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

// --- Pages ---

const HomePage = ({ navigateTo }) => (
  <div className="space-y-12 animate-in fade-in duration-500">
    {/* Hero Section */}
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-slate-900/40 z-10"></div>
      {/* Abstract background representing water/miami */}
      <div className="absolute inset-0 opacity-40 z-0 bg-[url('https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
      
      <div className="relative z-20 py-24 px-8 md:px-16 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-sm font-medium mb-6">
          <Waves className="w-4 h-4" />
          <span>Welcome Home</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Community, Security, & <span className="text-teal-300">Island Living</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl leading-relaxed">
          The official digital hub for the Biscayne Point Homeowners Association. 
          Connecting neighbors, preserving our paradise.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigateTo('portal')}>
            <Lock className="w-4 h-4" />
            Resident Login
          </Button>
          <Button variant="secondary" onClick={() => navigateTo('arb')}>
            ARB Applications
          </Button>
        </div>
      </div>
    </div>

    {/* Quick Stats / Info */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-teal-50 to-white border-teal-100">
        <Shield className="w-10 h-10 text-teal-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">24/7 Security</h3>
        <p className="text-slate-600">
          Direct line to the guardhouse and community patrol updates. Keep our island safe.
        </p>
      </Card>
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <Sun className="w-10 h-10 text-blue-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Events & News</h3>
        <p className="text-slate-600">
          Upcoming block parties, board meetings, and beautification projects.
        </p>
      </Card>
      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
        <CreditCard className="w-10 h-10 text-indigo-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Pay Dues Online</h3>
        <p className="text-slate-600">
          Secure payment portal for annual assessments and voluntary contributions.
        </p>
      </Card>
    </div>

    {/* Latest News Preview */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Community Updates</h2>
        <button onClick={() => navigateTo('news')} className="text-teal-700 font-medium hover:underline flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: "Annual Meeting Scheduled", date: "Oct 15, 2025", cat: "Governance", desc: "Join us at the North Beach Youth Center for the election of new officers." },
          { title: "Landscaping Project: South Entrance", date: "Sep 28, 2025", cat: "Beautification", desc: "New palm installations begin next week. Please drive carefully." }
        ].map((news, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-200 transition-colors">
            <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-500">
              <span className="text-xs font-bold uppercase">{news.date.split(' ')[0]}</span>
              <span className="text-xl font-bold text-slate-800">{news.date.split(' ')[1].replace(',', '')}</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">{news.cat}</div>
              <h4 className="font-bold text-slate-800 mb-1">{news.title}</h4>
              <p className="text-sm text-slate-500">{news.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PortalPage = ({ isLoggedIn, onLogin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('docs');

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 animate-in slide-in-from-bottom-4 duration-500">
        <Card className="text-center p-8 border-t-4 border-t-teal-600">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-teal-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Resident Portal</h2>
          <p className="text-slate-500 mb-8">
            Access financial reports, meeting minutes, and governing documents securely.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" placeholder="neighbor@biscaynepointer.org" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" required />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" required />
            </div>
            <Button className="w-full">Sign In</Button>
            <p className="text-xs text-slate-400 mt-4">
              Demo Mode: Click "Sign In" with any credentials.
            </p>
          </form>
        </Card>
      </div>
    );
  }

  // Mock Data for Portal
  const docs = [
    { name: "2025 Annual Budget.pdf", date: "Jan 10, 2025", type: "Financial" },
    { name: "September Board Meeting Minutes.pdf", date: "Sep 20, 2025", type: "Minutes" },
    { name: "Amended Bylaws 2024.pdf", date: "Dec 01, 2024", type: "Governing" },
    { name: "Architectural Guidelines v2.pdf", date: "Jun 15, 2024", type: "Rules" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">Welcome, Resident</h2>
          <p className="text-teal-200">7700 Biscayne Point Circle</p>
        </div>
        <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={onLogout}>Sign Out</Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {['docs', 'payments', 'profile'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'docs' && 'Documents & Files'}
              {tab === 'payments' && 'Payment History'}
              {tab === 'profile' && 'My Profile'}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          {activeTab === 'docs' && (
            <Card title="Official Documents" icon={FileText}>
              <div className="space-y-1">
                {docs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.date} • {doc.type}</div>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-teal-600 p-2">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'payments' && (
             <Card title="Billing & Dues" icon={CreditCard}>
               <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg mb-6 flex items-start gap-3">
                 <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                 <div>
                   <div className="font-bold text-emerald-800">Account in Good Standing</div>
                   <div className="text-sm text-emerald-700">Thank you for your 2025 contribution. Next assessment due Jan 1, 2026.</div>
                 </div>
               </div>
               
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                   <tr>
                     <th className="py-3 px-4">Date</th>
                     <th className="py-3 px-4">Description</th>
                     <th className="py-3 px-4">Amount</th>
                     <th className="py-3 px-4">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   <tr>
                     <td className="py-3 px-4">Jan 05, 2025</td>
                     <td className="py-3 px-4 font-medium">Annual HOA Dues</td>
                     <td className="py-3 px-4">$350.00</td>
                     <td className="py-3 px-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Paid</span></td>
                   </tr>
                 </tbody>
               </table>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const BoardPage = () => {
  const members = [
    { name: "John Doe", role: "President", email: "president@biscaynepointer.org" },
    { name: "Jane Smith", role: "Vice President", email: "vp@biscaynepointer.org" },
    { name: "Robert Johnson", role: "Treasurer", email: "treasurer@biscaynepointer.org" },
    { name: "Emily Davis", role: "Secretary", email: "secretary@biscaynepointer.org" },
    { name: "Michael Chen", role: "Director at Large", email: "board@biscaynepointer.org" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Board of Directors</h2>
        <p className="text-slate-600">
          Volunteers dedicated to maintaining the quality of life in Biscayne Point. 
          Board meetings are held the second Tuesday of every month.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, i) => (
          <Card key={i} className="text-center hover:shadow-lg transition-all border-t-4 border-t-teal-500">
            <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
            <div className="text-teal-600 font-medium mb-4">{member.role}</div>
            <a href={`mailto:${member.email}`} className="text-sm text-slate-500 hover:text-teal-700 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /> {member.email}
            </a>
          </Card>
        ))}
      </div>

      <Card title="Committees" className="mt-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sun className="w-4 h-4 text-orange-500" /> Beautification
            </h4>
            <p className="text-slate-600 text-sm mb-4">Focuses on landscaping, entrance maintenance, and holiday decorations.</p>
            <Button variant="outline" size="sm" className="text-xs h-8">Join Committee</Button>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" /> Security & Safety
            </h4>
            <p className="text-slate-600 text-sm mb-4">Liaises with guard services and Miami Beach Police Department.</p>
            <Button variant="outline" size="sm" className="text-xs h-8">Join Committee</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ARBPage = () => (
  <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Architectural Review Board (ARB)</h2>
      <p className="text-slate-600 mb-4">
        To maintain the aesthetic harmony of Biscayne Point, all exterior modifications must be reviewed by the ARB prior to work commencing. 
        This includes painting, roofing, fencing, and major landscaping.
      </p>
      <div className="flex gap-4">
        <Button>Start Online Application</Button>
        <Button variant="outline">
          <Download className="w-4 h-4" /> Download Guidelines
        </Button>
      </div>
    </div>

    <Card title="Quick Check: Do I need approval?" icon={FileText}>
      <div className="space-y-4">
        {[
          { q: "Repainting my house the same color?", a: "No, maintenance does not require approval." },
          { q: "Installing a new fence?", a: "Yes, submit material samples and survey." },
          { q: "Replacing windows?", a: "Yes, must meet current hurricane codes and aesthetic standards." },
          { q: "Planting a tree?", a: "Only if it affects view corridors or is on the swale." }
        ].map((item, i) => (
          <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
            <h4 className="font-semibold text-slate-800">{item.q}</h4>
            <p className="text-slate-600 text-sm mt-1">{item.a}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ContactPage = () => (
  <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Get in Touch</h2>
      <p className="text-slate-600 text-lg">
        Have a question about dues, security, or community events? We're here to help.
      </p>
      
      <div className="space-y-4">
        <Card className="flex items-start gap-4 p-4">
          <MapPin className="w-6 h-6 text-teal-600 mt-1" />
          <div>
            <div className="font-bold text-slate-900">Mailing Address</div>
            <div className="text-slate-600">
              Biscayne Point HOA<br/>
              P.O. Box 12345<br/>
              Miami Beach, FL 33141
            </div>
          </div>
        </Card>
        
        <Card className="flex items-start gap-4 p-4">
          <Shield className="w-6 h-6 text-teal-600 mt-1" />
          <div>
            <div className="font-bold text-slate-900">Guardhouse (24/7)</div>
            <div className="text-slate-600 font-mono text-lg">305-555-0199</div>
            <div className="text-xs text-slate-500 mt-1">For immediate security concerns, call 911.</div>
          </div>
        </Card>

        <Card className="flex items-start gap-4 p-4">
          <Mail className="w-6 h-6 text-teal-600 mt-1" />
          <div>
            <div className="font-bold text-slate-900">General Inquiries</div>
            <a href="mailto:info@biscaynepointer.org" className="text-teal-700 hover:underline">info@biscaynepointer.org</a>
          </div>
        </Card>
      </div>
    </div>

    <Card title="Send a Message">
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <select className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none">
            <option>General Inquiry</option>
            <option>Security Report</option>
            <option>ARB Question</option>
            <option>Website Issue</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea rows="4" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"></textarea>
        </div>
        <Button className="w-full">Send Message</Button>
      </form>
    </Card>
  </div>
);

// --- Layout & Main App ---

export default function App() {
  const [page, setPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'board', label: 'Board & Committees', icon: Users },
    { id: 'arb', label: 'ARB', icon: FileText },
    { id: 'portal', label: 'Resident Portal', icon: Lock },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const navigateTo = (pageId) => {
    setPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo(0,0);
  };

  const renderPage = () => {
    switch(page) {
      case 'home': return <HomePage navigateTo={navigateTo} />;
      case 'board': return <BoardPage />;
      case 'arb': return <ARBPage />;
      case 'portal': return <PortalPage isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} onLogout={() => setIsLoggedIn(false)} />;
      case 'contact': return <ContactPage />;
      default: return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-700/30">
                <span className="font-bold text-xl">BP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">Biscayne Point</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Homeowners Association</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    page === item.id 
                      ? 'bg-teal-50 text-teal-700' 
                      : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button size="sm" className="ml-4 h-9 text-sm" onClick={() => navigateTo('portal')}>
                Pay Dues
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white absolute w-full shadow-xl">
            <div className="p-4 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    page === item.id 
                      ? 'bg-teal-50 text-teal-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="w-8 h-8 bg-teal-700 rounded flex items-center justify-center font-bold text-sm">BP</div>
              <span className="text-lg font-bold">Biscayne Point</span>
            </div>
            <p className="mb-6 max-w-sm">
              A private, waterfront community in Miami Beach. Dedicated to safety, community, and the preservation of our island lifestyle.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 bg-slate-800 rounded-full hover:bg-teal-600 transition-colors cursor-pointer flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-full hover:bg-teal-600 transition-colors cursor-pointer flex items-center justify-center">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('board')} className="hover:text-teal-400">Board Members</button></li>
              <li><button onClick={() => navigateTo('arb')} className="hover:text-teal-400">Architectural Review</button></li>
              <li><button onClick={() => navigateTo('portal')} className="hover:text-teal-400">Resident Portal</button></li>
              <li><a href="#" className="hover:text-teal-400">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-teal-600" />
                <span>P.O. Box 12345<br/>Miami Beach, FL 33141</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600" />
                <span>info@biscaynepointer.org</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          &copy; {new Date().getFullYear()} Biscayne Point Homeowners Association. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
