import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Server, 
  Globe, 
  Code2, 
  Wrench, 
  Search, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X,
  Shield,
  Zap,
  Headset,
  FileText,
  Image as ImageIcon,
  FileArchive,
  FileCode2,
  Maximize
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Arosoft Innovations</span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                <a href="#hosting" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Hosting</a>
                <a href="#domains" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Domains</a>
                <a href="#services" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</a>
                <a href="#tools" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Tools</a>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-600 hover:text-slate-900 font-medium text-sm">Sign In</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Started
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#hosting" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Hosting</a>
            <a href="#domains" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Domains</a>
            <a href="#services" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Services</a>
            <a href="#tools" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Tools</a>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 px-5 flex flex-col gap-3">
            <button className="w-full text-center text-slate-600 hover:text-slate-900 font-medium py-2">Sign In</button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 pt-16 pb-32">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/server/1920/1080?blur=10')] opacity-20 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
        >
          Build Your Digital Future <br className="hidden md:block" />
          <span className="text-blue-400">With Arosoft Innovations</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 mb-10"
        >
          Premium hosting, domain registration, and custom systems development to scale your business globally.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-grow flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Find your perfect domain name..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-lg outline-none"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            Search <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center gap-6 text-sm text-slate-400"
        >
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> .com for $9.99/yr</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free SSL included</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Support</span>
        </motion.div>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      icon: <Server className="w-8 h-8 text-blue-600" />,
      title: "Cloud Hosting",
      description: "Lightning-fast, secure, and scalable hosting solutions for websites of all sizes. 99.9% uptime guaranteed."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Domain Registration",
      description: "Secure your brand identity with our wide range of TLDs. Easy management and auto-renewal."
    },
    {
      icon: <Code2 className="w-8 h-8 text-emerald-600" />,
      title: "Systems Development",
      description: "Custom software, web applications, and enterprise systems tailored to your business needs."
    },
    {
      icon: <Wrench className="w-8 h-8 text-orange-600" />,
      title: "Online Tools",
      description: "Free utilities including PDF to TIFF converters, image processors, and formatting tools."
    }
  ];

  return (
    <div id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need to succeed online</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Arosoft Innovations provides a complete ecosystem of digital services to help you build, launch, and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "4.99",
      description: "Perfect for personal blogs and small projects.",
      features: ["1 Website", "10 GB SSD Storage", "Unmetered Bandwidth", "Free SSL Certificate", "1 Email Account"]
    },
    {
      name: "Professional",
      price: "9.99",
      popular: true,
      description: "Ideal for growing businesses and online stores.",
      features: ["Unlimited Websites", "50 GB NVMe Storage", "Unmetered Bandwidth", "Free SSL Certificate", "Unlimited Email Accounts", "Daily Backups"]
    },
    {
      name: "Enterprise",
      price: "24.99",
      description: "Maximum performance for demanding applications.",
      features: ["Unlimited Websites", "200 GB NVMe Storage", "Dedicated IP", "Free SSL Certificate", "Priority 24/7 Support", "Advanced Security"]
    }
  ];

  return (
    <div id="hosting" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the perfect hosting plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 border ${plan.popular ? 'border-blue-600 shadow-xl shadow-blue-900/5' : 'border-slate-200 shadow-sm'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
              <p className="text-slate-500 text-sm mt-2 h-10">{plan.description}</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl mb-6">Why trust Arosoft Innovations?</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We don't just provide servers; we provide peace of mind. Our infrastructure is built for reliability, speed, and security, backed by a team of experts ready to help you 24/7.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Enterprise-Grade Security</h4>
                  <p className="text-slate-400">Advanced DDoS protection, automated malware scanning, and free SSL certificates keep your data safe.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Lightning Fast Performance</h4>
                  <p className="text-slate-400">Powered by NVMe SSDs, LiteSpeed web servers, and global CDN integration for maximum speed.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Headset className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">24/7 Expert Support</h4>
                  <p className="text-slate-400">Our team of systems engineers is available around the clock to assist you with any technical issues.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl transform rotate-3 opacity-20 blur-lg"></div>
            <img 
              src="https://picsum.photos/seed/datacenter/800/600" 
              alt="Data Center" 
              className="relative rounded-3xl shadow-2xl border border-slate-800"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Tools = () => {
  const toolsList = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "PDF to TIFF",
      description: "Convert your PDF documents to high-quality TIFF images instantly."
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-emerald-600" />,
      title: "JPG to PNG",
      description: "Convert JPG images to transparent PNG format without quality loss."
    },
    {
      icon: <FileArchive className="w-6 h-6 text-indigo-600" />,
      title: "Compress PDF",
      description: "Reduce the file size of your PDF documents for easy sharing."
    },
    {
      icon: <FileCode2 className="w-6 h-6 text-orange-600" />,
      title: "JSON Formatter",
      description: "Format, validate, and beautify your JSON data online."
    },
    {
      icon: <Maximize className="w-6 h-6 text-purple-600" />,
      title: "Image Resizer",
      description: "Resize images to exact dimensions for social media or web use."
    },
    {
      icon: <Wrench className="w-6 h-6 text-slate-600" />,
      title: "More Utilities",
      description: "Explore our full suite of free online converters and developer tools."
    }
  ];

  return (
    <div id="tools" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Free Online Tools & Converters</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            A suite of handy utilities to speed up your daily tasks. Convert files, format code, and process images directly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.map((tool, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{tool.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-xl text-white tracking-tight">Arosoft</span>
            </div>
            <p className="text-sm">
              Empowering businesses with reliable hosting, domains, and custom systems development.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Web Hosting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">VPS Hosting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dedicated Servers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Domain Registration</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Systems Development</a></li>
              <li><a href="#tools" className="hover:text-white transition-colors">Online Converters</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise Solutions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Integration</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Arosoft Innovations Limited. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Tools />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
