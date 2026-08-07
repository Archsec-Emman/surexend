# SureXend — How to Run This Project



## Prerequisites

Before running SureXend, your machine needs:

1. **Node.js v20 LTS** → Download from https://nodejs.org (choose "LTS" version)
2. **npm** (comes with Node.js automatically)
3. **Git** → Download from https://git-scm.com

---

## Step 1: Install Node.js

1. Go to https://nodejs.org
2. Click "Download Node.js (LTS)"
3. Run the installer, accept all defaults
4. Open a NEW PowerShell window and verify:
   ```
   node --version    → should show v20.x.x
   npm --version     → should show 10.x.x
   ```

---

## Step 2: Install Dependencies

Open PowerShell in the `surexend` folder:
```powershell
cd "C:\Users\ASAKE ISLAMIA SALAH\.gemini\antigravity\scratch\surexend"
npm install
```

This will take 2–3 minutes to download all packages.

---

## Step 3: Set Environment Variables

Create a file called `.env.local` in the `surexend` folder with this content:

```env
# Brand variant: 'gold' or 'lemon' — determines which logo theme deploys
NEXT_PUBLIC_BRAND_VARIANT=gold

# Backend API URL (change this when your backend is running)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# These are set by your backend developer:
# NEXT_PUBLIC_FIREBASE_CONFIG=...
# NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=...
```

---

## Step 4: Run the Development Server

```powershell
npm run dev
```

Then open your browser to: **http://localhost:3000**

---

## Step 5: Preview Both Logo Variants

To preview the **Gold** version:
- Change `.env.local`: `NEXT_PUBLIC_BRAND_VARIANT=gold`
- Restart dev server

To preview the **Lemon-Green** version:
- Change `.env.local`: `NEXT_PUBLIC_BRAND_VARIANT=lemon`
- Restart dev server

---

## Step 6: Place Your Logo Files

Copy your two logo images into the `public/` folder:
```
public/
  logo-gold.png      ← Gold variation logo
  logo-lemon.png     ← Lemon variation logo
  icons/
    icon-192.png     ← Your logo resized to 192x192px
    icon-512.png     ← Your logo resized to 512x512px
    apple-touch-icon.png ← 180x180px for iOS
```


---

## File Structure

```
surexend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (fonts, PWA meta)
│   │   ├── globals.css         ← All global styles
│   │   ├── page.tsx            ← Landing page
│   │   └── auth/               ← Login/Register pages (to build)
│   ├── components/
│   │   ├── SurexendLoader.tsx  ← Logo loading animation
│   │   ├── MobileResilienceScript.tsx ← Anti-WSOD protection
│   │   └── PWAInstallPrompt.tsx ← Add-to-home-screen prompt
│   ├── context/
│   │   └── ThemeContext.tsx    ← Gold/Lemon theme switcher
│   └── lib/
│       ├── api.ts              ← All API calls (connect to backend here)
│       └── utils.ts            ← Helper functions
├── public/
│   ├── manifest.json           ← PWA configuration
│   ├── sw.js                   ← Service worker
│   └── offline.html            ← Offline fallback page
├── tailwind.config.js          ← Design system tokens
├── next.config.ts              ← Next.js configuration
└── package.json                ← Dependencies
```

