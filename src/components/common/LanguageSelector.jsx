import { Globe } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import DropdownPill from "./DropdownPill";

/**
 * Header language switcher. Placed in the header rather than the footer at the
 * client's request, so shoppers can find it without hunting.
 */
export default function LanguageSelector({ iconOnly = false, align = "right" }) {
  const { language, setLanguage, locales, t } = useLanguage();
  const active = locales.find((l) => l.code === language) ?? locales[0];

  return (
    <DropdownPill
      ariaLabel={t("common.language", "Language")}
      icon={<Globe className="size-5" aria-hidden="true" />}
      label={active?.label}
      iconOnly={iconOnly}
      align={align}
      activeCode={language}
      onSelect={setLanguage}
      options={locales.map((l) => ({ code: l.code, display: l.label }))}
    />
  );
}
