import { motion } from "motion/react";
import { Leaf, Menu, X, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { loginWithGoogle } from "../lib/firebase";

interface NavbarProps {
  onOpenAuth?: () => void;
  onOpenDashboard?: () => void;
  hasActiveSession?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenDashboard, hasActiveSession }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#1A2E1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="bg-[#2E7D32] p-2 rounded-xl group-hover:shadow-lg group-hover:shadow-[#2E7D32]/20 transition-all duration-300">
                <Leaf className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#1A2E1A] leading-none">
                  EMISSIO<span className="text-[#2E7D32]">CULATOR</span>
                </span>
                <span className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase">
                  Enterprise Engine
                </span>
              </div>
            </motion.div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-[#1A2E1A]/70 uppercase tracking-widest">
            <a href="#hero" className="hover:text-[#2E7D32] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#2E7D32] transition-colors">Metodologi</a>
            <a href="#products" className="hover:text-[#2E7D32] transition-colors">Modul</a>
            <a href="#faq" className="hover:text-[#2E7D32] transition-colors">FAQ</a>
            
            <div className="h-6 w-px bg-[#1A2E1A]/10" />

            {hasActiveSession ? (
              <button 
                onClick={onOpenDashboard}
                className="bg-[#2E7D32] text-white px-5 py-2.5 rounded-full hover:bg-[#1A2E1A] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Buka Dashboard</span>
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="bg-[#1A2E1A] text-white px-6 py-2.5 rounded-full hover:bg-[#2E7D32] transition-all duration-300 shadow-xl shadow-[#1A2E1A]/10 cursor-pointer"
              >
                Masuk Dashboard
              </button>
            )}

            {user && (
              <div className="flex items-center gap-2 bg-[#2E7D32]/5 px-3 py-1.5 rounded-full border border-[#2E7D32]/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-5 h-5 rounded-full" />
                ) : (
                  <UserIcon className="w-4 h-4 text-[#2E7D32]" />
                )}
                <span className="text-[10px] text-[#1A2E1A] lowercase truncate max-w-[100px]">
                  {user.displayName || user.email}
                </span>
                <button 
                  onClick={logout}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#1A2E1A]">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-[#1A2E1A]/10 py-6 px-4 space-y-4"
        >
          <div className="flex flex-col space-y-4 text-center font-bold">
            <a href="#hero" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#features" onClick={() => setIsOpen(false)}>Metodologi</a>
            <a href="#products" onClick={() => setIsOpen(false)}>Modul</a>
            <a href="#faq" onClick={() => setIsOpen(false)}>FAQ</a>
            
            <button 
              onClick={() => {
                setIsOpen(false);
                if (hasActiveSession && onOpenDashboard) {
                  onOpenDashboard();
                } else if (onOpenAuth) {
                  onOpenAuth();
                }
              }}
              className="bg-[#1A2E1A] text-white py-3 rounded-2xl w-full cursor-pointer"
            >
              {hasActiveSession ? 'Buka Dashboard' : 'Masuk Dashboard'}
            </button>

            {user && (
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="text-red-500 pt-2 border-t border-[#1A2E1A]/5 text-xs font-bold"
              >
                Logout ({user.displayName || user.email})
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};
