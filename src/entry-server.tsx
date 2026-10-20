// Build-time only: renders the homepage to static HTML so crawlers and no-JS
// visitors get the full text. scripts/prerender.mjs injects the result into
// dist/index.html; the client (main.tsx) then renders over it.
import { renderToString } from "react-dom/server";
import App from "./App";

export function render(): string {
  return renderToString(<App />);
}
