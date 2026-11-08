// Lightweight in-house i18n (no library). The language comes from the URL:
// anything under /ar/ is Arabic, everything else English. See docs/i18n/PLAN.md.
import { createContext, useContext } from "react";

export type Lang = "en" | "ar";

export const LangContext = createContext<Lang | null>(null);
/** 'en' | 'ar' for the page being rendered. Works without a provider
 *  (falls back to the URL), so any entry, e.g. the RAL HR pages, can use it. */
export const useLang = (): Lang => useContext(LangContext) ?? detectLang();

export const langFromPath = (p: string): Lang => (/^\/ar(\/|$)/.test(p) ? "ar" : "en");
export const detectLang = (): Lang =>
  typeof location === "undefined" ? "en" : langFromPath(location.pathname);

// English paths that have an Arabic mirror at /ar<path>. Keep in sync with
// content/pages-ar.mjs (scripts/prerender.mjs fails the build if they drift).
export const AR_PATHS = ["/", "/ral-hr/", "/ral-hr/inquire/"];

const bare = (p: string) => p.split("#")[0].split("?")[0];

/** Map an internal English href to the current language. */
export const localePath = (lang: Lang, href: string): string =>
  lang === "ar" && href.startsWith("/") && AR_PATHS.includes(bare(href)) ? "/ar" + href : href;

/** Same page in the other language (falls back to the other home page). */
export const altPath = (pathname: string): string => {
  if (langFromPath(pathname) === "ar") return pathname.replace(/^\/ar/, "") || "/";
  return AR_PATHS.includes(pathname) ? "/ar" + pathname : "/ar/";
};

/** Pick the dictionary for the current language: const t = useT(DICT). */
export function useT<T>(dict: { en: T; ar: T }): T {
  return dict[useLang()];
}
