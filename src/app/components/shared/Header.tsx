import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";

type HeaderProps = {
  lang: string;
};

export function Header({ lang }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-primary/10 px-6">
      <div className="max-w-full mx-auto h-full flex items-center justify-between">
        <Link
          href={`/${lang}`}
          className="text-xl font-bold text-primary tracking-wide"
        >
          Mada
        </Link>
        <div className="flex items-center h-full shrink-0">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
