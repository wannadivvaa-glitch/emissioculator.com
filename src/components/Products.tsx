import { motion } from "motion/react";
import { APP_CONFIG } from "../shared/appConfig";
import { Layers } from "lucide-react";

export const Products = () => {
  return (
    <section id="modules" className="py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[#2E7D32] font-black tracking-widest uppercase text-sm mb-4"
          >
            <Layers className="w-4 h-4" />
            <span>Ekosistem Emissioculator</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-[#1A2E1A] mb-4">Enterprise Sustainability Modules</h2>
          <p className="text-[#1A2E1A]/60 max-w-2xl mx-auto">
            Platform modular yang dapat disesuaikan dengan kebutuhan instansi, mulai dari pencatatan hingga analisis mendalam.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {APP_CONFIG.products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-[#1A2E1A]/5 hover:shadow-2xl hover:shadow-[#1A2E1A]/10 transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#2E7D32] uppercase tracking-wider">
                  {product.category}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-[#1A2E1A] mb-3 group-hover:text-[#2E7D32] transition-colors">{product.name}</h3>
                <p className="text-sm text-[#1A2E1A]/60 mb-6 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#1A2E1A]/5">
                  <span className="text-xs font-black text-[#D4AF37] uppercase">{product.price}</span>
                  <button className="text-[#2E7D32] font-bold text-sm hover:underline">Learn More</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
