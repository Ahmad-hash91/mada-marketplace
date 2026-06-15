"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { name: "English", code: "en" },
  { name: "العربية", code: "ar" },
  { name: "日本語", code: "ja" },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentLanguageCode = pathname.split("/")[1] || "en";
  const currentLanguage =
    LANGUAGES.find((l) => l.code === currentLanguageCode) || LANGUAGES[0];

  const handleLanguageChange = (newLocale: string) => {
    const localeRegex = /^\/(en|ar|ja)(?=\/|$)/;
    let newPathname = "";

    if (localeRegex.test(pathname)) {
      newPathname = pathname.replace(localeRegex, `/${newLocale}`);
    } else {
      newPathname = pathname;
    }

    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    /* Relative positioning limits the absolute drop overlay boundary coordinates box */
    <div className="relative inline-block text-left w-36">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 items-center justify-between px-3 py-2 text-sm font-medium rounded-lg border transition-colors w-full cursor-pointer border-accent/20 ${
          isOpen
            ? "bg-secondary text-primary"
            : "bg-background text-text hover:bg-secondary/40"
        }`}
      >
        <div className="flex items-center gap-2">
          <Globe className="size-4 shrink-0 opacity-70" />
          <span className="text-sm font-medium">{currentLanguage.name}</span>
        </div>
        <ChevronDown
          className={`size-4 transition-transform duration-200 opacity-60 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop interception block masks screen to trigger dismiss actions instantly */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu panel box uses absolute floats to leave block level layout paths uninterrupted */}
          <ul className="absolute right-0 top-full mt-1 flex flex-col gap-0.5 w-full bg-background rounded-md p-1 border border-primary/10 shadow-lg z-50">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguageCode;
              const fontStyle =
                lang.code === "ar"
                  ? "font-arabic"
                  : lang.code === "ja"
                    ? "font-japanese"
                    : "font-sans";

              return (
                <li key={lang.code} className="w-full">
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left p-2 px-3 text-sm rounded-md transition-colors cursor-pointer ${fontStyle} ${
                      isSelected
                        ? "bg-secondary/60 text-primary font-semibold"
                        : "hover:bg-secondary/30 text-text"
                    }`}
                  >
                    {lang.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
