import { motion } from "motion/react";
import { APP_CONFIG } from "../shared/appConfig";
import { Image as ImageIcon } from "lucide-react";

export const Gallery = () => {
  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-[#2E7D32] font-black tracking-widest uppercase text-sm mb-4"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Visualisasi Impact</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1A2E1A]">Aksi Nyata di Lapangan</h2>
          </div>
          <p className="text-[#1A2E1A]/60 max-w-sm">
            Dokumentasi implementasi sistem Emissioculator di berbagai institusi pendidikan dan perkantoran.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {APP_CONFIG.gallery.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-[2rem] overflow-hidden group ${
                idx === 1 || idx === 2 ? 'lg:aspect-[4/5]' : 'lg:aspect-square'
              }`}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E1A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <h4 className="text-white font-bold text-lg">{item.title}</h4>
                <p className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">Sustainability Action</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
