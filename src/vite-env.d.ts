/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  // Supabase environment variables removed - app is now offline-first
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
