/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_MAPBOX_TOKEN_RISING_ROUTES: string;
  readonly VITE_BACKEND_PROXY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
