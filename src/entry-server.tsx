// Build-time only: renders pages to static HTML so crawlers and no-JS
// visitors get the full text. scripts/prerender.mjs injects the results into
// dist/index.html and the dist/ral-hr/ pages; the client then renders over them.
import { renderToString } from "react-dom/server";
import App from "./App";
import { LangContext, type Lang } from "./i18n";
import RalHrPage from "./components/ralhr/RalHrPage";
import Inquire from "./components/ralhr/Inquire";
import SiteChrome from "./components/ralhr/SiteChrome";
import { setRalHrLang } from "./components/ralhr/t";

const ralhr = (lang: Lang, page: JSX.Element) => {
  setRalHrLang(lang);
  try {
    return renderToString(<LangContext.Provider value={lang}><SiteChrome>{page}</SiteChrome></LangContext.Provider>);
  } finally {
    setRalHrLang(null);
  }
};

export function render(lang: Lang = "en"): string {
  setRalHrLang(lang);
  return renderToString(<LangContext.Provider value={lang}><App /></LangContext.Provider>);
}
export function renderRalHr(lang: Lang = "en"): string {
  return ralhr(lang, <RalHrPage />);
}
export function renderInquire(lang: Lang = "en"): string {
  return ralhr(lang, <Inquire />);
}
