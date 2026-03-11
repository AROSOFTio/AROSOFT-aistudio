import React, { useState } from 'react';
import { Server, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Arosoft Innovations</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                <Link to="/#hosting" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Hosting</Link>
                <Link to="/#domains" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Domains</Link>
                <Link to="/student-offer" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-blue-50">Student Offer</Link>
                <Link to="/#tools" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Tools</Link>
                <Link to="/blog" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Blog</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/admin/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Sign In
            </Link>
            <Link to="/student-offer" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Started
            </Link>
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

      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/#hosting" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Hosting</Link>
            <Link to="/#domains" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Domains</Link>
            <Link to="/student-offer" className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100">Student Offer</Link>
            <Link to="/#tools" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Tools</Link>
            <Link to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Blog</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 px-5 flex flex-col gap-3">
            <Link to="/admin/login" className="w-full text-center text-slate-600 hover:text-slate-900 font-medium py-2" onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
            <Link to="/student-offer" className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => setIsOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
