# AutoTracker Landing Page (Silo App)

A modern, responsive, high-converting landing page for **AutoTracker** (متتبع صيانة المركبات) built as an isolated silo web application.

## Key Features

- **Decoupled Silo Architecture**: Has its own `package.json`, TypeScript configuration, Tailwind CSS setup, and Vite build pipeline, fully isolated from the Expo mobile app.
- **Bilingual & RTL Native**: First-class support for Arabic (`dir="rtl"`, Cairo font) and English (`dir="ltr"`, Inter font) with dynamic layout shifting.
- **Dark & Light Mode**: Seamless theme toggling with persistent user preference storage in `localStorage`.
- **Interactive Vehicle Simulator**: Real-time mock dashboard allowing prospective users to drag an odometer slider and watch maintenance indicators dynamically calculate and change status between **Good (Green)**, **Upcoming (Amber)**, and **Overdue (Red)**.
- **Feature Showcase**: Highlights Google Sheets 2-way sync, Google Drive receipt vault, Google Calendar & Gmail alerts, fuel logging, and zero-vendor-lockin privacy.
- **Google Sheets & Drive Mirror**: Live interactive tabular preview demonstrating how records and invoices look inside the user's personal Google Drive.
- **Download & GitHub CTAs**: Direct download links for the Android APK and open-source project repository.

## Development

Run development server:
```bash
cd landing
bun dev
# or: npm run dev
```

From the root directory:
```bash
npm run landing:dev
```

## Production Build

Compile and bundle for deployment (Vercel, Netlify, Cloudflare Pages, GitHub Pages):
```bash
cd landing
bun run build
# or: npm run build
```

Production output will be generated in `landing/dist/`.
