// Tiny translator for the RAL HR pages: t('English {0}', arg) returns the
// Arabic entry from AR on /ar/ pages (falls back to the English), with {0}
// style placeholders filled in. Language comes from useLang()'s source: the
// URL on the client, and setRalHrLang() during build-time SSR.
import { detectLang, type Lang } from '../../i18n'
import { AR } from './i18n-ar'

let forced: Lang | null = null
export const setRalHrLang = (l: Lang | null) => { forced = l }
export const ralHrLang = (): Lang => forced ?? detectLang()
export const isAr = () => ralHrLang() === 'ar'

export function t(en: string, ...args: Array<string | number>): string {
  const s = ralHrLang() === 'ar' ? AR[en] ?? en : en
  return args.length ? s.replace(/\{(\d+)\}/g, (m, i) => (args[+i] !== undefined ? String(args[+i]) : m)) : s
}
