// Style imports used by the web build (expo-router web output). Without these
// declarations TypeScript cannot resolve `*.css` / `*.module.css` imports.

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.css";
