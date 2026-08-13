# 🎓 PRAJNA 2026 — Hackathon Management Portal

> **PRAJNA 2026** is a premium, feature-rich, and real-time portal built to manage registrations, dynamic rules validation, and administrative workflows for the 36-hour national-level hackathon at **Mohan Babu University (MBU)**.



## 🚀 Key Features

*   **🔒 Intelligent Rules & Eligibility Engine**:
    *   **Branch Diversity**: Guarantees interdisciplinary collaboration (minimum 2 different branches per team).
    *   **Female Representation**: Automatically enforces gender diversity guidelines (at least 1 female participant per team).
    *   **Academic Cohorts**: Restricts participation strictly to eligible academic years (e.g., 3rd & 4th Year).
*   **⚡ Realtime Event Config Syncing**:
    *   Subscribes to Supabase Realtime Channels to dynamically open/close registrations, update venue details, shift registration deadlines, or update branch lists.
*   **📚 Branch-Specific Sections**:
    *   Dynamically maps specific sections (such as **B1 to B12** exclusively for the **AIML** department and **A to F** for other branches) to prevent data entry mistakes.
*   **🛠️ Feature-Packed Admin Console**:
    *   **Realtime Statistics**: View total registered teams, participant count, and female ratio instantly.
    *   **Content Management**: Add or remove memories, update past winners, and release/lock problem statements.
    *   **Excel Export Engine**: Download cleanly-formatted directory files (`.xlsx`) grouped by academic year, branch, and section.
*   **💾 Hybrid Offline Resilience**:
    *   Automatically falls back to local storage cache if Supabase is offline or unconfigured. Synchronizes state seamlessly once connection is restored.

---

## 🛠️ Tech Stack & Architecture

*   **Core**: React 19 (TypeScript)
*   **Build Tool**: Vite 8 (with Rollup optimizations)
*   **Styling**: Tailwind CSS v3 (Vanilla CSS structure)
*   **Database**: Supabase Client (PostgreSQL)
*   **Excel Engine**: SheetJS (XLSX compiler)
*   **Icons**: Lucide React

---

## ⚡ Production Optimizations

To deliver rapid page load speeds, the production bundler is configured with **manual code splitting** to separate large libraries into optimized, browser-cached chunks:
```js
// vite.config.ts
manualChunks(id) {
  if (id.includes('node_modules')) {
    if (id.includes('xlsx')) return 'vendor-xlsx';
    if (id.includes('@supabase')) return 'vendor-supabase';
    if (id.includes('lucide-react')) return 'vendor-lucide';
    return 'vendor-core';
  }
}
```

---

## 🚀 Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/prasadborusu/PHR2026.git
cd PHR2026
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anonymous-key
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` directory.

---

## ⚖️ License
Created for **Mohan Babu University (MBU)**. All rights reserved.
