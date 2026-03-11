import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Upload, ExternalLink, MessageCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const StudentOffer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    systemName: '',
    systemRepo: '',
    packageType: 'hosting_only',
    extraNotes: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (file) {
        data.append('systemZip', file);
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        alert(result.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold tracking-wider mb-4 border border-blue-500/30">
            STUDENT OFFER
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Final Year Project Hosting
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Reliable hosting for university final year systems with a fixed student package. We support Laravel, PHP, WordPress, Python, Java, Node.js, and other web stacks. Choose your plan, place your order, and pay securely through Pesapal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#order-form" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Order now
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" /> WhatsApp support
            </a>
          </div>
          <p className="mt-8 text-sm text-slate-400">Offer valid until December 31, 2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Info & Pricing */}
          <div className="lg:col-span-7 space-y-12">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Clear Pricing Packages</h2>
              <p className="text-slate-600 mb-8">No hidden pricing. Click a package button and jump straight to the order form.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Package 1 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                  <div className="absolute top-0 right-0 bg-slate-100 text-slate-600 px-3 py-1 rounded-bl-lg rounded-tr-xl text-xs font-bold uppercase tracking-wider">
                    Package 1
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Hosting only</h3>
                  <p className="text-slate-500 text-sm mb-4 h-10">Reliable deployment for your final year project system.</p>
                  <div className="text-3xl font-extrabold text-blue-600 mb-6">UGX 50,000</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Secure hosting setup for one student project</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Deployment support for Laravel, PHP, WordPress, Java, Python, and Node.js apps</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Technical onboarding with DNS guidance</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Valid until December 2026</li>
                  </ul>
                  <a href="#order-form" onClick={() => setFormData({...formData, packageType: 'hosting_only'})} className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 py-2 rounded-lg font-medium transition-colors">
                    Order hosting only
                  </a>
                </div>

                {/* Package 2 */}
                <div className="bg-white rounded-2xl p-6 border-2 border-blue-600 shadow-md relative">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-xl text-xs font-bold uppercase tracking-wider">
                    Package 2
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Domain + hosting</h3>
                  <p className="text-slate-500 text-sm mb-4 h-10">Get both hosting and your own project domain.</p>
                  <div className="text-3xl font-extrabold text-blue-600 mb-6">UGX 86,000</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Everything in Hosting only package</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> One domain name registration (.com where available)</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Domain and DNS connection handled for you</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Upgrade to full yearly hosting anytime</li>
                  </ul>
                  <a href="#order-form" onClick={() => setFormData({...formData, packageType: 'domain_hosting'})} className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Order domain + hosting
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Offer Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Student budget fit</h4>
                  <p className="text-slate-600 text-sm">Fixed price tiers built for final year teams and individual students.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Fast onboarding</h4>
                  <p className="text-slate-600 text-sm">We help you connect your project and complete launch setup quickly.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Secure payment</h4>
                  <p className="text-slate-600 text-sm">Checkout is handled by Pesapal for mobile money and card options where available.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Upgrade anytime</h4>
                  <p className="text-slate-600 text-sm">Move from student package to full yearly hosting whenever you are ready.</p>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Supported Tech Stacks</h2>
              <p className="text-slate-600 mb-6">This hosting offer is not limited to Laravel or PHP. We also deploy and support Java, Python, WordPress, Node.js, and modern frontend stacks.</p>
              <div className="space-y-4">
                <div>
                  <span className="font-bold text-slate-900">Backend:</span> <span className="text-slate-700">PHP, Laravel, Node.js, Java, Python.</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">CMS:</span> <span className="text-slate-700">WordPress and custom PHP CMS projects.</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Frontend:</span> <span className="text-slate-700">React, Vue, Blade, and static web apps.</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Form */}
          <div className="lg:col-span-5" id="order-form">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Place Your Order</h2>
              <p className="text-slate-500 text-sm mb-6">Submit your project details and you will be redirected to Pesapal checkout.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full name *</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                  <input type="text" name="institution" placeholder="e.g. KIU" value={formData.institution} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">System name *</label>
                  <input required type="text" name="systemName" placeholder="Example: Student Result Management System" value={formData.systemName} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">System repo (optional)</label>
                  <input type="url" name="systemRepo" placeholder="https://github.com/username/project" value={formData.systemRepo} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">System ZIP source code *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-500 transition-colors bg-slate-50">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1">
                          <span>Upload a file</span>
                          <input required type="file" className="sr-only" accept=".zip,.rar,.tar.gz" onChange={handleFileChange} />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">Upload your latest source ZIP (max 50MB).</p>
                      {file && <p className="text-sm font-semibold text-emerald-600 mt-2">{file.name}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Choose package *</label>
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${formData.packageType === 'hosting_only' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="packageType" value="hosting_only" checked={formData.packageType === 'hosting_only'} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-900">Hosting only</span>
                      </div>
                      <span className="font-bold text-slate-900">UGX 50,000</span>
                    </label>
                    <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${formData.packageType === 'domain_hosting' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="packageType" value="domain_hosting" checked={formData.packageType === 'domain_hosting'} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-900">Domain + hosting</span>
                      </div>
                      <span className="font-bold text-slate-900">UGX 86,000</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Extra notes</label>
                  <textarea name="extraNotes" rows={3} value={formData.extraNotes} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? 'Processing...' : 'Order using Pesapal'} <ExternalLink className="w-5 h-5" />
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 text-sm">Checkout & Support</h4>
                <p className="text-xs text-slate-500 mb-2">Every order is saved and assigned a reference. You can refresh status after payment callback.</p>
                <p className="text-xs text-slate-500">After successful payment and valid source handover, your system goes live within a maximum of 6 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
