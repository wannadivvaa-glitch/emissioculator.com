import { APP_CONFIG } from "../shared/appConfig";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#1A2E1A] text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-[#2E7D32] p-2 rounded-xl">
                <Leaf className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                EMISSIO<span className="text-[#2E7D32]">CULATOR</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {APP_CONFIG.description}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-widest text-xs mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><a href="#hero" className="hover:text-[#2E7D32] transition-colors">Home</a></li>
              <li><a href="#calculator" className="hover:text-[#2E7D32] transition-colors">IPCC Calculator</a></li>
              <li><a href="#modules" className="hover:text-[#2E7D32] transition-colors">Modules Ecosystem</a></li>
              <li><a href="#gallery" className="hover:text-[#2E7D32] transition-colors">Implementation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-widest text-xs mb-8">Contact Info</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#2E7D32]" />
                <span>+{APP_CONFIG.contact.whatsapp}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#2E7D32]" />
                <span>{APP_CONFIG.contact.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
                <span>{APP_CONFIG.contact.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-widest text-xs mb-8">Newsletter</h4>
            <p className="text-xs text-white/40 mb-6">Dapatkan update terbaru terkait regulasi emisi karbon dan pengelolaan limbah organik.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs w-full focus:outline-none focus:border-[#2E7D32]"
              />
              <button className="bg-[#2E7D32] text-white px-4 py-3 rounded-xl hover:bg-white hover:text-[#1A2E1A] transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          <p>© 2026 {APP_CONFIG.brandName}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">IPCC Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
