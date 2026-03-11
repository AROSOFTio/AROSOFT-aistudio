import React from 'react';
import { Server } from 'lucide-react';

export const Footer = () => {
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
