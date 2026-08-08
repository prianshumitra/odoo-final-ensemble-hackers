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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE4DB] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#18181B] my-0">Get in Touch</h1>
            <p className="text-xs text-[#8A8694] mt-1">Have questions about rentals or custom corporate orders?</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[#8A8694] uppercase">Email</span>
                <span className="text-sm font-semibold text-[#18181B]">support@diligentwombat.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[#8A8694] uppercase">Phone</span>
                <span className="text-sm font-semibold text-[#18181B]">+1 (800) 555-WOMBAT</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[#8A8694] uppercase">Headquarters</span>
                <span className="text-sm font-semibold text-[#18181B]">Innovation Way, Suite 400</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#FAF7F2] p-6 rounded-2xl border border-[#EAE4DB]">
          <h3 className="text-sm font-bold text-[#18181B]">Send us a Message</h3>
          
          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full bg-white text-xs rounded-xl px-3 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              className="w-full bg-white text-xs rounded-xl px-3 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Message</label>
            <textarea
              rows={3}
              required
              placeholder="How can we help you?"
              className="w-full bg-white text-xs rounded-xl px-3 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
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
  );
};
