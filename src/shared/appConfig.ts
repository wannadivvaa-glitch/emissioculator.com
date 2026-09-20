export const APP_CONFIG = {
  brandName: "Emissioculator",
  businessType: "Platform Kalkulator & Analisis Emisi Karbon Organik Organisasi",
  tagline: "Ubah Limbah Menjadi Data, Kurangi Emisi untuk Bumi.",
  description: "Platform pintar berbasis web untuk mengukur, mengkonversi, dan menganalisis estimasi emisi gas metana (CH4) dan karbon ekuivalen (CO2e) dari sampah organik organisasi secara otomatis berdasarkan standar IPCC Tier 1.",
  themeColor: {
    primary: "#1A2E1A",  // Deep Eco Dark Accent
    accent: "#2E7D32",   // Forest Green Accent
    gold: "#D4AF37",     // Gold Accent
    bgLight: "#FAF8F5"   // Warm Neutral Ivory
  },
  contact: {
    whatsapp: "6281234567890",
    email: "info@emissioculator.com",
    address: "Eco-Tech Innovation Hub, Indonesia"
  },
  heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop", 
  products: [
    {
      id: 1,
      name: "Smart Organic Tracker",
      category: "Modul Operasional",
      price: "Akses Gratis Riset",
      description: "Modul pencatatan berat harian limbah organik per unit operasional dengan konversi otomatis standar IPCC Tier 1.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "IPCC Tier 1 Calculator Engine",
      category: "Modul Kalkulator",
      price: "Real-time Calculation",
      description: "Mesin hitung otomatis yang mengkonversi kilogram sampah organik menjadi emisi Gas Metana (CH4) dan CO2e.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Executive Emission Dashboard",
      category: "Modul Analisis",
      price: "Visualisasi Data",
      description: "Grafik interaktif tren harian limbah dan total akumulasi jejak karbon untuk laporan ilmiah atau institusi.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "AI Sustainability Consultant",
      category: "Modul AI GenAI",
      price: "Powered by Gemini",
      description: "Asisten AI cerdas yang memberikan analisis mendalam, saran pengurangan limbah, dan rekomendasi kebijakan hijau.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
    }
  ],
  gallery: [
    { title: "Penimbangan Sampah Organik", image: "https://images.unsplash.com/photo-1532996122724-e3c3fa4a0d55?q=80&w=800&auto=format&fit=crop" },
    { title: "Analisis Data Lingkungan", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" },
    { title: "Manajemen Ramah Lingkungan", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" },
    { title: "Aksi Nyata Kurangi Emisi", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop" }
  ],
  faq: [
    { q: "Bagaimana cara Emissioculator menghitung emisi gas metana?", a: "Emissioculator menggunakan standar acuan internasional IPCC Tier 1, di mana setiap 1 kg sampah organik diasumsikan menghasilkan sekitar 0.05 kg CH4, yang kemudian dikonversi ke ekuivalen karbon (CO2e) dengan pengali 28." },
    { q: "Apakah aplikasi ini cocok untuk penelitian tingkat organisasi atau instansi?", a: "Sangat cocok! Emissioculator dirancang khusus untuk mendukung riset ilmiah kuantitatif dengan antarmuka yang ramah pengguna untuk staf operasional dan hasil rekapitulasi data yang siap disajikan dalam bentuk laporan resmi." },
    { q: "Bagaimana cara kerja fitur AI Consultant di dalam aplikasi?", a: "Fitur AI Consultant memanfaatkan integrasi Google Gemini untuk membaca data input sistem dan memberikan wawasan, kesimpulan otomatis, serta saran praktis pengurangan limbah kepada pengguna." }
  ]
};
