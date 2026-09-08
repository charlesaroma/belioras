import { Globe } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import DropdownPill from "./DropdownPill";

/**
 * Header language switcher. Placed in the header rather than the footer at the
 * client's request, so shoppers can find it without hunting.
 *
 * `variant="code"` shows the ISO 639-1 code — EN, FR, DE, ZH, ES, IT — which
 * is uniformly two characters across all six locales, so the header does not
 * reflow when a shopper switches. The open list keeps the endonyms (Français,
 * 中文): a shopper looking for their own language recognises it written the
 * way they write it, not as a Latin abbreviation.
 *
 * The accessible name stays the full word, because "EN" alone does not tell a
 * screen-reader user what the control does.
 */
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
