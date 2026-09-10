/* Common Component: LanguageSelector */
import { Globe } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import DropdownPill from "./DropdownPill";

export default function LanguageSelector({ iconOnly = false, align = "right" }) {
  const { language, setLanguage, locales, t } = useLanguage();

  return (
    <DropdownPill
      ariaLabel={t("common.language", "Language")}
      icon={<Globe className="size-5" aria-hidden="true" />}
      label={language.toUpperCase()}
      variant={iconOnly ? undefined : "code"}
      iconOnly={iconOnly}
      align={align}
      activeCode={language}
      onSelect={setLanguage}
      options={locales.map((l) => ({
        code: l.code,
        display: l.label,
        meta: l.code.toUpperCase(),
      }))}
    />
  );
}
