"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Arabic", code: "ar" },
  { name: "Japanese", code: "ja" },
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
    <div className="flex flex-col gap-1 w-full text-gray-600">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-2 rounded transition-colors w-full ${
          isOpen ? "bg-gray-50 text-gray-900 font-medium" : "hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-4">
          <Globe className="size-5 shrink-0 text-gray-500" />
          <span className="text-sm font-medium">{currentLanguage.name}</span>
        </div>
        <ChevronDown
          className={`size-4 transition-transform duration-200 text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="flex flex-col gap-0.5 mt-1 bg-gray-50/50 rounded-md p-1 border border-gray-100">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLanguageCode;
            return (
              <li key={lang.code} className="w-full">
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left p-2 px-3 text-sm rounded transition-colors ${
                    isSelected
                      ? "bg-white text-blue-600 font-medium shadow-sm border border-gray-100"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
