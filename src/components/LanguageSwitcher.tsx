"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";
import { LOCALE_LABELS, type Locale } from "@/i18n/translations";

const LOCALES: { code: Locale; flag: string }[] = [
  { code: "en", flag: "/us.svg" },
  { code: "fr", flag: "/fr.svg" },
  { code: "rw", flag: "/rw.svg" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="flag-btn"
        onClick={() => setOpen(!open)}
        aria-label={`Language: ${LOCALE_LABELS[locale]}`}
      >
        <Image
          src={current.flag}
          alt={LOCALE_LABELS[locale]}
          width={36}
          height={24}
          className="flag-img"
        />
      </button>

      {open && (
        <div className="lang-dropdown">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              className={`lang-option ${l.code === locale ? "active" : ""}`}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
            >
              <Image
                src={l.flag}
                alt={LOCALE_LABELS[l.code]}
                width={28}
                height={19}
                className="flag-img-sm"
              />
              <span className="lang-option-label">{LOCALE_LABELS[l.code]}</span>
              {l.code === locale && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
