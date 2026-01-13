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
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const toggleLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
          <Languages className="h-5 w-5 text-slate-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => toggleLanguage("vi")}
          className={`cursor-pointer ${locale === "vi" ? "bg-slate-100 font-medium" : ""}`}
        >
          🇻🇳 Tiếng Việt
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toggleLanguage("en")}
          className={`cursor-pointer ${locale === "en" ? "bg-slate-100 font-medium" : ""}`}
        >
          🇺🇸 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
