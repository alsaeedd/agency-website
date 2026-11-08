// Build-time only: renders pages to static HTML so crawlers and no-JS
// visitors get the full text. scripts/prerender.mjs injects the results into
// dist/index.html and the dist/ral-hr/ pages; the client then renders over them.
import { renderToString } from "react-dom/server";
import App from "./App";
import { LangContext, type Lang } from "./i18n";
import RalHrPage from "./components/ralhr/RalHrPage";
import Inquire from "./components/ralhr/Inquire";
import SiteChrome from "./components/ralhr/SiteChrome";

export function render(lang: Lang = "en"): string {
  return renderToString(<LangContext.Provider value={lang}><App /></LangContext.Provider>);
}
export function renderRalHr(): string {
  return renderToString(<SiteChrome><RalHrPage /></SiteChrome>);
}
export function renderInquire(): string {
  return renderToString(<SiteChrome><Inquire /></SiteChrome>);
}
