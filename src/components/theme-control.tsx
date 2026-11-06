"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, Clock, Monitor, Moon, Sun } from "@/components/icons";
import type { Language } from "@/lib/i18n";
import { watchSiteTheme, type SiteTheme, type ThemeController, type ThemePreference } from "@/lib/theme";

const options = [
  { value: "time", Icon: Clock, ko: "시간 자동", en: "By time", koDescription: "07:00–19:00에는 라이트", enDescription: "Light from 7 am to 7 pm" },
  { value: "system", Icon: Monitor, ko: "기기 설정", en: "Device", koDescription: "기기의 화면 테마 따르기", enDescription: "Follow your device theme" },
  { value: "light", Icon: Sun, ko: "라이트 모드", en: "Light", koDescription: "항상 밝은 화면", enDescription: "Always use the light theme" },
  { value: "dark", Icon: Moon, ko: "다크 모드", en: "Dark", koDescription: "항상 어두운 화면", enDescription: "Always use the dark theme" },
] as const;

export function ThemeControl({ language }: { language: Language }) {
  const [preference, setPreference] = useState<ThemePreference>("time");
  const [theme, setTheme] = useState<SiteTheme>("light");
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const controller = useRef<ThemeController | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const english = language === "en";
  const heading = english ? "Theme" : "화면 테마";
  const selected = options.find(option => option.value === preference) ?? options[0];
  const current = options.find(option => option.value === theme)!;
  const description = `${english ? "Theme settings" : "테마 설정"}: ${english ? selected.en : selected.ko} · ${english ? "Now" : "현재"} ${english ? current.en : current.ko}`;
  const storageNote = english ? "Your choice is saved in this browser." : "선택한 설정은 이 브라우저에 저장됩니다.";

  useLayoutEffect(() => {
    const active = watchSiteTheme(document, window, setPreference, setTheme);
    controller.current = active;
    return () => { active.destroy(); controller.current = null; };
  }, []);

  useLayoutEffect(() => {
    if (open) items.current[focusIndex]?.focus();
  }, [open, focusIndex]);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  function showMenu(index = 0) {
    setFocusIndex(index);
    setOpen(true);
  }

  function closeMenu(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }

  function menuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next: number;
    switch (event.key) {
      case "ArrowDown": next = (focusIndex + 1) % options.length; break;
      case "ArrowUp": next = (focusIndex - 1 + options.length) % options.length; break;
      case "Home": next = 0; break;
      case "End": next = options.length - 1; break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        closeMenu(true);
        return;
      case "Tab":
        // Reverse Tab lands on the trigger; forward Tab continues past the closed menu.
        if (event.shiftKey) event.preventDefault();
        closeMenu(true);
        return;
      default:
        if (event.key.length !== 1 || !/[a-z]/i.test(event.key) || event.ctrlKey || event.metaKey || event.altKey) return;
        next = options.findIndex((_, offset) => {
          const option = options[(focusIndex + 1 + offset) % options.length];
          return (english ? option.en : option.ko).toLowerCase().startsWith(event.key.toLowerCase());
        });
        if (next < 0) return;
        next = (focusIndex + 1 + next) % options.length;
    }
    event.preventDefault();
    setFocusIndex(next);
  }

  return <div className="theme-control" ref={root}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenu(); }}>
    <button className="theme-toggle" type="button" ref={trigger} aria-label={description} title={`${description}. ${storageNote}`}
      aria-haspopup="menu" aria-expanded={open} aria-controls={menuId}
      onClick={() => { if (open) closeMenu(); else showMenu(); }}
      onKeyDown={event => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        showMenu(event.key === "ArrowUp" ? options.length - 1 : 0);
      }}>
      <Sun className="theme-toggle-sun" />
      <Moon className="theme-toggle-moon" />
    </button>
    <div id={menuId} className="theme-menu" role="menu" aria-label={heading} hidden={!open} onKeyDown={menuKeyDown}>
      <p className="theme-menu-heading" role="presentation">{heading}</p>
      {options.map(({ value, Icon, ko, en, koDescription, enDescription }, index) => <button type="button" key={value}
        className="theme-option" role="menuitemradio" aria-checked={preference === value} tabIndex={open && focusIndex === index ? 0 : -1}
        ref={element => { items.current[index] = element; }} onFocus={() => setFocusIndex(index)}
        onClick={() => { controller.current?.setPreference(value); closeMenu(true); }}>
        <Icon className="theme-option-icon" />
        <span className="theme-option-copy"><strong>{english ? en : ko}</strong><small>{english ? enDescription : koDescription}</small></span>
        <Check className="theme-check" />
      </button>)}
      <p className="theme-menu-note" role="presentation">{storageNote}</p>
    </div>
  </div>;
}
