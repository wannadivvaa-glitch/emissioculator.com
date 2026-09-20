# Emissioculator - Enterprise Carbon & Food Waste Emission Engine

Emissioculator is a professional enterprise-grade platform designed to measure, convert, and analyze methane (CH4) and carbon equivalent (CO2e) emissions from organic waste in institutions and canteens, based on the IPCC Tier 1 standard.

## Features

- **IPCC Tier 1 Calculator**: Real-time conversion of waste weight to emission data.
- **Enterprise Modules**: Scalable modules for canteen tracking, executive dashboards, and research.
- **AI Sustainability Consultant**: Integrated Google Gemini AI to provide expert recommendations.
- **Mobile First Design**: Fully responsive, high-contrast, professional UI.
- **Executive Eco-Tech Aesthetic**: Emerald Green & Gold color palette with Plus Jakarta Sans typography.

## Tech Stack

- **Frontend**: React 18+ (Vite), Tailwind CSS, Motion, Lucide Icons.
- **Backend**: Express.js (Node.js), @google/genai SDK.
- **Standards**: IPCC Tier 1 Methodology.

## Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## cPanel / Shared Hosting Deployment

This application is built to be "cPanel Ready" using the Node.js Selector.

1. **Build the Application**:
   ```bash
   npm run build
   ```
   This generates the `dist/` folder for the frontend and `dist/server.cjs` for the backend.

2. **Upload Files**:
   Upload the following to your cPanel `public_html` or the folder defined in Node.js Selector:
   - `dist/`
   - `package.json`
   - `.env` (with production keys)

3. **Configure Node.js Selector**:
   - **App Root**: path to your files.
   - **App URL**: your domain.
   - **Application startup file**: `dist/server.cjs`.

4. **Install Packages**:
   Click "Run npm install" in the cPanel Node.js Selector interface.

5. **Restart App**:
   Restart the Node.js application from the dashboard.

---
Developed by **Satelitweb & Wan Adivanaira Kirani**.
Standard: Zero-Slop, Production-Grade Architecture.
