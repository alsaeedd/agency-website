// Build-time only: renders pages to static HTML so crawlers and no-JS
// visitors get the full text. scripts/prerender.mjs injects the results into
// dist/index.html and the dist/ral-hr/ pages; the client then renders over them.
import { renderToString } from "react-dom/server";
import App from "./App";
import RalHrPage from "./components/ralhr/RalHrPage";
import Inquire from "./components/ralhr/Inquire";

export function render(): string {
  return renderToString(<App />);
}
export function renderRalHr(): string {
  return renderToString(<RalHrPage />);
}
export function renderInquire(): string {
  return renderToString(<Inquire />);
}
