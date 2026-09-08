# MEDDET™ — Clinical Drug Index & Medicine Price BD

<p align="center">
  <img src="public/logo.png" alt="MEDDET Logo" width="220" />
</p>

<p align="center">
  <strong>Bangladesh's Clinical Drug Index, BDT Medicine Price Guide & Alternative Brand Comparator</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Database-30%2C000%2B_Brands-14967F?style=flat-square" alt="30k Brands" />
  <img src="https://img.shields.io/badge/License-Proprietary-095D7E?style=flat-square" alt="License" />
</p>

---

## 📖 Overview

**MEDDET™** is a clinical drug database and pharmaceutical price comparison engine designed specifically for healthcare professionals, patients, pharmacists, and medical students in Bangladesh.

It provides instant access to **30,000+ brand medicines**, active generic ingredients, verified **BDT MRP prices**, lower-cost alternative brand recommendations, and comprehensive **bilingual clinical monographs** (English & Bengali).

---

## ✨ Key Features

- **🔍 Comprehensive Medicine Search:** Lightning-fast instant search across brand names, active generic substances, pharmaceutical manufacturers, strengths, and medical indications.
- **💊 Complete Clinical Monographs:** Detailed clinical reference data including Indications, Adult/Pediatric Dosage, Side Effects, Contraindications, Precautions, Pregnancy Risk Categories, and Overdose protocols.
- **💰 Accurate Pricing & Pack Economics:** Verified Maximum Retail Price (MRP in ৳ BDT), per-unit/per-bottle calculation, pharmacy discount modeling, and commercial pack pricing.
- **🔄 Smart Alternative Brand Comparator:** Instant automatic detection of same-generic, same-dosage-form alternative brands with live percentage savings calculators to help reduce healthcare costs.
- **🔤 Interactive Alphabet & Category Directory:** Filter medicines alphabetically (A–Z, #), by dosage form (Tablets, Syrups, Injections, Ointments, Eye Drops), by medical condition, or by manufacturer.
- **🌐 Bilingual Language Toggle (English & বাংলা):** Seamless on-the-fly toggling between English and Bengali for clinical monographs, dosage guidelines, and interface elements.
- **⚡ Performance-First Architecture:** 
  - Ultra-lightweight WebP image pipeline (91%+ file size reduction).
  - Two-tier data hydration with `CacheStorage` API for instant offline-ready access.
  - Inline loading skeletons ensuring sub-second First Contentful Paint (FCP).
- **🌗 Dark / Light Mode:** Native responsive dark mode support with zero flash of unstyled content (FOUC).
- **🔌 Developer REST API:** Built-in RESTful API endpoints for searching medicines, querying generics, calculating alternatives, and retrieving database statistics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript |
| **Build & Tooling** | Vite 6 |
| **Styling & Design** | Tailwind CSS v4, Vanilla CSS Design System |
| **Animation & UX** | Motion (Framer Motion) |
| **Icons & Media** | Lucide React, Custom Optimized WebP Medical Icons |
| **Data Engine** | In-Memory Indexed Search Engine with Browser `CacheStorage` |
| **Deployment** | Cloudflare Pages / Edge Network |

---

## 📂 Project Structure

```text
├── public/
│   ├── data/                 # Clinical JSON datasets (brands, generics, companies, dosage notes)
│   ├── icons/                # High-resolution optimized WebP dosage form icons
│   ├── logo.webp             # Primary brand logo
│   ├── medical-bg.webp       # Background texture asset
│   ├── robots.txt            # Search engine crawler configuration
│   └── sitemap.xml           # XML sitemap indexing all 30,000+ medicines
├── src/
│   ├── api/                  # Public REST API route handlers
│   ├── components/
│   │   ├── common/           # Header, BottomNav, Sidebar, Disclaimer, TableOfContents
│   │   ├── home/             # HomeLanding hero, dosage form grids, top companies
│   │   ├── medicine/         # MedicineHero, PriceSection, AlternativeBrands, GenericBrandsExplorer, etc.
│   │   ├── search/           # SearchBar, AlphabetFilter, FilterDrawer
│   │   └── index.ts          # Clean component barrel
│   ├── data/
│   │   └── dbEngine.ts       # Core indexed search engine & data caching layer
│   ├── utils/
│   │   ├── dosageFormHelper.tsx  # Dosage form classification & custom icon mapper
│   │   ├── pricingHelper.ts      # Clinical & commercial pack pricing calculator
│   │   ├── seoManager.ts         # Dynamic document metadata & Schema.org JSON-LD generator
│   │   └── slugify.ts            # Unicode & Bengali-aware URL slug generator
│   ├── App.tsx               # Primary application router & view controller
│   ├── index.css             # Global styles & design system tokens
│   ├── main.tsx              # Application entry point
│   └── types.ts              # Global TypeScript interfaces and data models
├── index.html                # Pre-rendered HTML with inline critical FCP skeleton
├── package.json              # Project dependencies and build scripts
└── vite.config.ts            # Vite configuration with vendor chunk code splitting
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Installation

Clone the repository and install the project dependencies:

```bash
git clone https://github.com/dev-abrarfahim/medvhai.git
cd medvhai
npm install
```

### 2. Development Server

Start the local development server with hot module replacement:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### 3. Production Build

Compile and bundle the application for production:

```bash
npm run build
```

The optimized static assets will be generated in the `dist/` directory.

### 4. Deploying to Cloudflare Pages

Deploy the compiled production build to Cloudflare Pages:

```bash
npx wrangler pages deploy dist --project-name medvhai
```

---

## 🔌 Public REST API Endpoints

MEDDET provides built-in REST API endpoints for external integrations:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/search?q=Napa&form=Tablet&page=1&limit=20` | Search brand medicines and active ingredients |
| `GET` | `/api/v1/medicines/:id` | Retrieve full clinical details & monograph for a brand ID |
| `GET` | `/api/v1/alternatives?genericId=123&form=Tablet` | Get lower-cost brand alternatives for a generic |
| `GET` | `/api/v1/generics/:id` | Retrieve generic monograph and all associated brand medicines |
| `GET` | `/api/v1/stats` | Database statistics (total brands, generics, companies) |

---

## ⚠️ Medical Information Disclaimer

> **MEDDET™** is an educational clinical reference platform created to assist healthcare professionals and provide verified drug information for educational purposes. It does **NOT** provide medical advice, diagnosis, or treatment recommendations. Always consult a registered medical practitioner or physician before initiating, altering, or discontinuing any pharmaceutical therapy.

---

## 📄 License & Copyright

© 2026 **MEDDET Healthcare Index**. All rights reserved.  
Crafted for the Bangladeshi Healthcare Ecosystem.
