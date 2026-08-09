import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10 flex-1">
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-xs">
        <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-[23px] grid grid-cols-1 md:grid-cols-2 gap-8 border border-[#E8E4DE]">
          
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] my-0 font-serif">Get in Touch</h1>
              <p className="text-xs font-bold text-[#8A857F] mt-1">Have questions about rentals or custom corporate orders?</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shrink-0 shadow-warm-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-black text-[#8A857F] uppercase tracking-wider">Email</span>
                  <span className="text-sm font-black text-[#1C1C1C]">support@ezrent.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shrink-0 shadow-warm-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-black text-[#8A857F] uppercase tracking-wider">Phone</span>
                  <span className="text-sm font-black text-[#1C1C1C]">+1 (800) 555-EZRENT</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shrink-0 shadow-warm-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-black text-[#8A857F] uppercase tracking-wider">Headquarters</span>
                  <span className="text-sm font-black text-[#1C1C1C]">Innovation Way, Suite 400</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-[#F3EFE8] p-6 rounded-2xl border border-[#E8E4DE] shadow-warm-xs">
            <h3 className="text-sm font-black text-[#1C1C1C]">Send us a Message</h3>
            
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full bg-[#FAF8F5] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl px-3 py-2.5 border border-[#E8E4DE] focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                className="w-full bg-[#FAF8F5] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl px-3 py-2.5 border border-[#E8E4DE] focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Message</label>
              <textarea
                rows={3}
                required
                placeholder="How can we help you?"
                className="w-full bg-[#FAF8F5] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl px-3 py-2.5 border border-[#E8E4DE] focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-warm-xs active:scale-98"
            >
              <Send className="w-3.5 h-3.5 text-[#E8B923]" />
              <span>Send Message</span>
            </button>

            {submitted && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold justify-center pt-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Message sent successfully! We will get back to you shortly.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
