import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { APP_CONFIG } from "./src/shared/appConfig.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Initialization
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Endpoints
  app.post("/api/recommendation", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      
      const systemInstruction = `
        Anda adalah Pakar Konsultan Keberlanjutan & Strategi Iklim Senior untuk platform Emissioculator.
        Keahlian Anda: Inventarisasi Gas Rumah Kaca (GRK), Metodologi IPCC Tier 1, Ekonomi Sirkular, dan Mitigasi Perubahan Iklim di Institusi.
        
        Panduan Menjawab:
        1. Berikan jawaban yang sangat edukatif, saintifik namun mudah dipahami tentang masalah iklim dan lingkungan.
        2. Gunakan Standar IPCC: 1kg sampah makanan ≈ 0.05kg CH4 ≈ 1.4kg CO2e.
        3. Berikan rekomendasi kebijakan konkret untuk sekolah/kantor (misal: pengomposan, pembatasan porsi, kampanye Zero Waste).
        4. Gunakan bahasa Indonesia yang profesional, ramah, dan solutif.
        5. Format jawaban dengan Markdown yang rapi (bold, list, headings).
        6. Jika ditanya di luar topik lingkungan/emisi, arahkan kembali dengan sopan ke topik keberlanjutan.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", // Using a valid model name
        contents: [
          { role: "user", parts: [{ text: `Konteks User: ${JSON.stringify(context)}. Pertanyaan User: ${prompt}` }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ recommendation: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to get AI recommendation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
