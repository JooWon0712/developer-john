export type Language = "ko" | "en";

function splitPath(path: string) {
  const boundary = path.search(/[?#]/);
  const pathname = boundary < 0 ? path : path.slice(0, boundary);
  const suffix = boundary < 0 ? "" : path.slice(boundary);
  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    throw new Error("Language links require a local absolute pathname.");
  }
  return { pathname, suffix };
}

export function getLanguage(path: string): Language {
  const { pathname } = splitPath(path);
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ko";
}

export function getBasePath(path: string): string {
  const { pathname } = splitPath(path);
  if (pathname === "/en" || pathname === "/en/") return "/";
  const base = pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
  return base.replace(/^\/+/, "/");
}

export function localizePath(path: string, language: Language): string {
  const base = getBasePath(path);
  const { suffix } = splitPath(path);
  return (language === "en" ? base === "/" ? "/en" : `/en${base}` : base) + suffix;
}
