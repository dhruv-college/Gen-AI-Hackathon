# 🎨 Artisan Hub – AI-Powered Marketplace for Local Artisans  

> **Empowering Indian artisans with AI-driven visibility and storytelling.**  
> Built for the **Google Gen AI Hackathon 2025** under the theme:  
> **“AI-Powered Marketplace Assistance for Local Artisans.”**

---

## 🌟 Overview  

**Artisan Hub** is an intelligent marketplace that helps local artisans showcase their handcrafted work online — like a “LinkedIn for Artisans.”  
With a simple mobile-friendly interface, artisans can upload photos of their creations, and the AI automatically generates **descriptions, tags, and translations** to make their products discoverable worldwide.  

---

## 🚀 Features  

### 🧭 Core Features
- 🔐 Simple **Sign In / Sign Up** (frontend-only demo)
- 🌐 **Multi-language support** (English + Tamil prototype)
- 👤 **Profile setup** for artisans (name, location, craft type, about)
- 🖼️ **AI-powered description & tag generation** from product photos
- 🏠 **Personal dashboard** for artisans to manage their work
- 🛍️ **Marketplace view** for buyers to explore artisan profiles and crafts
- 💬 **Smart AI translations** powered by Google Vertex AI

### 🧠 AI & Smart Assistance
- 📸 **Auto Tag Generator:** Uses image input to generate tags & captions  
- 🌏 **Language Translation:** Uses Google’s Translation API via Vertex AI  
- 🔍 **Craft Discovery:** Semantic search suggestions for users browsing crafts

---

## 🧰 Tech Stack  

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React + TypeScript + Vite |
| **Styling** | Tailwind CSS + ShadCN UI + Lucide Icons |
| **AI & APIs** | Google Vertex AI (Text & Vision Models), Google Cloud Translation API |
| **State & Data** | React Query + Context |
| **Backend (Future)** | Firebase / Supabase (for auth, profiles & image storage) |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

---

## 🧠 Google APIs & Gen AI Integration Plan  

| Use Case | Google Service | Description |
|-----------|----------------|-------------|
| 🖼️ **Craft Image Understanding** | Vertex AI Vision API | Analyze uploaded craft images to generate descriptive tags & categories. |
| ✍️ **Auto Description Generation** | Vertex AI Text Model (Gemini) | Create creative, SEO-friendly descriptions for each artisan’s craft. |
| 🌏 **Language Translation** | Google Cloud Translation API | Translate artisan bios and product info into regional languages (Tamil prototype). |
| 🔎 **Recommendation Engine** | Vertex AI Matching Engine | Suggest similar artisans or related crafts to buyers. |

> For the hackathon demo, the AI responses are simulated using static data and mock JSON,  
> but the structure supports seamless integration with Vertex AI endpoints.  

---

## 🖼️ UI Highlights  

- 🎨 Elegant warm color palette inspired by Indian craft tones.  
- 💫 Smooth animations, shadows, and gradients for modern appeal.  
- 📱 Fully responsive layout optimized for mobile and desktop.  

---

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## File Structure 
```
ahv2
├─ .firebaserc
├─ bun.lockb
├─ components.json
├─ DEPLOYMENT.md
├─ eslint.config.js
├─ firebase.json
├─ firestore.indexes.json
├─ firestore.rules
├─ functions
│  ├─ .eslintrc.js
│  ├─ index.js
│  ├─ package-lock.json
│  └─ package.json
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  ├─ placeholder.svg
│  └─ robots.txt
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ components
│  │  ├─ LanguageSelector.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ aspect-ratio.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     ├─ chart.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ command.tsx
│  │     ├─ context-menu.tsx
│  │     ├─ dialog.tsx
│  │     ├─ drawer.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ hover-card.tsx
│  │     ├─ input-otp.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ menubar.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ progress.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ resizable.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ sonner.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     ├─ toast.tsx
│  │     ├─ toaster.tsx
│  │     ├─ toggle-group.tsx
│  │     ├─ toggle.tsx
│  │     ├─ tooltip.tsx
│  │     └─ use-toast.ts
│  ├─ config
│  │  └─ firebaseConfig.ts
│  ├─ context
│  │  └─ LanguageContext.tsx
│  ├─ data
│  │  ├─ mockProducts.ts
│  │  ├─ mockProfiles.ts
│  │  └─ types.ts
│  ├─ hooks
│  │  ├─ use-mobile.tsx
│  │  └─ use-toast.ts
│  ├─ index.css
│  ├─ lib
│  │  └─ utils.ts
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ Auth.tsx
│  │  ├─ Dashboard.tsx
│  │  ├─ Marketplace.tsx
│  │  ├─ NotFound.tsx
│  │  ├─ Profile.tsx
│  │  └─ Welcome.tsx
│  ├─ services
│  └─ vite-env.d.ts
├─ storage.rules
├─ tailwind.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```