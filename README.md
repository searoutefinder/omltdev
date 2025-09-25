# 🗺️ OMLT – React + Vite App

This repository contains a frontend application built with **React 19** and **Vite** for rendering interactive GIS trail maps. The app also features the maps with the search bar and filtering capabilities.  **Mapbox GL JS** library is used for map development and **ArcGIS Online (AGOL)** as the geospatial data backend. 
> Bootstrapped with [Vite](https://vitejs.dev/)

---

## ⚡️ Tech Stack

- **React 19** - component-based UI library with newest hooks and concurrent rendering 
- **Vite** – for blazing-fast frontend development
- **Mapbox GL JS** - beacuse of WebGL-powered vector tile & graphic layer renderer
- **TypeScript** -  extension of JavaScript for safer coding 
- **AGOL (ArcGIS Online)** – for hosting and serving geospatial layers
- **ArcGIS REST API** – for querying hosted feature services

---

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js (v19+ recommended)  
- Git, npm or yarn

### 📥 Installation

```bash
npm install
# or
yarn

### Running the App in Dev Mode
npm run dev

### Expose the app to local WiFi network (e.g., for testing from your phone or another laptop)
npm run dev -- --host

### Build for Production
npm run build

### Preview Production Build
npm run preview
```


### 📁 Project Structure

```txt
src/
├── assets/              # Static assets (fonts: League Sparta, RedHat)
├── components/          # Reusable UI components
├── configs/             # App-level config for Trail Maps setup
├── constants/           # Shared constants, API endpoints, AGOL fetch utils
├── context/             # React context providers (e.g. initial Map States, MapProvider)
├── hooks/               # Custom React hooks (e.g. addLayers, dataFetcher, lineHighlight) 
├── pages/               # Route-based components (e.g. /home, /rising-routes, /webform)
├── utils/               # Helpers for map behavior, UI logic, data processing, and workflows
├── types/               # Shared TypeScript types and interfaces
├── workers/             # Web Worker scripts for off-main-thread heavy processing
├── App.jsx              # Main app layout + routing
├── index.tsx            # React DOM entry point
public/                  # Static files (favicon, images, etc.)
vite.config.ts           # Vite configuration
```

### Available Scripts
| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start the dev server                 |
| `npm run dev -- --host` | Start dev server accessible over LAN |
| `npm run build`         | Build the app for production         |
| `npm run preview`       | Preview local production build       |


### 📚 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [ArcGIS REST API](https://developers.arcgis.com/rest/services-reference/enterprise/get-started-with-the-services-directory/)





