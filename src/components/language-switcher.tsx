"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const toggleLanguage = (newLocale: "vi" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer gap-2 px-2 w-auto">
          <Globe className="h-4 w-4 text-slate-600" />
          <span className="text-xs font-bold uppercase text-slate-600">
            {locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => toggleLanguage("vi")}
          className={`cursor-pointer flex items-center justify-between ${locale === "vi" ? "bg-slate-100 font-medium" : ""}`}
        >
          <span className="flex items-center gap-2">
            <span>🇻🇳</span>
            <span>Tiếng Việt</span>
          </span>
          {locale === "vi" && <Check className="h-4 w-4 text-indigo-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toggleLanguage("en")}
          className={`cursor-pointer flex items-center justify-between ${locale === "en" ? "bg-slate-100 font-medium" : ""}`}
        >
          <span className="flex items-center gap-2">
            <span>🇺🇸</span>
            <span>English</span>
          </span>
          {locale === "en" && <Check className="h-4 w-4 text-indigo-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
